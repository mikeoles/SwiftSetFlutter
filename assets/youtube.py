import os
import sqlite3
import traceback
from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    if not url:
        return None
    parsed_url = urlparse(url)
    
    # Handle short URLs (youtu.be/VIDEO_ID)
    if parsed_url.hostname == 'youtu.be':
        return parsed_url.path[1:].split('?')[0].split('&')[0]
        
    # Handle standard URLs (youtube.com/...)
    elif parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        query_params = parse_qs(parsed_url.query)
        if 'v' in query_params:
            return query_params['v'][0]
        path_parts = parsed_url.path.split('/')
        if path_parts:
            return path_parts[-1].split('?')[0]
            
    return None

def check_youtube_videos_batch(video_ids):
    """Checks up to 50 video IDs in a single API call. Returns a set of valid IDs."""
    if not video_ids:
        return set()
        
    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        print("CRITICAL ERROR: YOUTUBE_API_KEY environment variable is missing.")
        return set()

    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        request = youtube.videos().list(part='id', id=','.join(video_ids))
        response = request.execute()
        valid_ids = {item['id'] for item in response.get('items', [])}
        return valid_ids
    except Exception as e:
        print("\n--- API REQUEST EXCEPTION ---")
        if hasattr(e, 'content'):
            try:
                import json
                error_details = json.loads(e.content.decode('utf-8'))
                print("Detailed Server Message:", json.dumps(error_details, indent=2))
            except Exception:
                print("Raw Server Response:", e.content)
        else:
            print(f"Error Message: {e}")
        print("-----------------------------\n")
        return set()

def main():
    db_path = os.path.join('assets', 'exercises.db')
    
    if not os.path.exists(db_path):
        print(f"CRITICAL ERROR: Database file not found at path: {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # UPDATED: Pulling 'name' alongside 'url' from the database
    # (If your column is named 'exercise_name', change 'name' to 'exercise_name' below)
    cursor.execute("SELECT name, url FROM exercises")
    entries = cursor.fetchall()
    conn.close()

    # UPDATED: Maps video_id -> {"url": url, "name": exercise_name}
    video_data_map = {}
    for name, url in entries:
        video_id = extract_video_id(url)
        if video_id:
            video_data_map[video_id] = {"url": url, "name": name}
        elif url:
            print(f"Unable to extract video ID from URL: {url} (Exercise: {name})")

    unique_ids = list(video_data_map.keys())
    valid_count = 0
    invalid_count = 0
    
    print(f"Starting validation for {len(unique_ids)} unique video links...\n")
    
    for i in range(0, len(unique_ids), 50):
        batch = unique_ids[i:i+50]
        valid_batch_ids = check_youtube_videos_batch(batch)
        
        valid_count += len(valid_batch_ids)
        
        # Cross-reference the batch to pinpoint dead links
        for vid in batch:
            if vid not in valid_batch_ids:
                invalid_count += 1
                exercise_meta = video_data_map[vid]
                # UPDATED: Now neatly prints the exercise name next to the broken link
                print(f"[INVALID] Exercise: {exercise_meta['name']} | Video ID: {vid} | URL: {exercise_meta['url']}")

    print("\n--- Final Summary ---")
    print(f"Total Unique Videos Checked: {len(unique_ids)}")
    print(f"Valid Videos: {valid_count}")
    print(f"Invalid Videos Broken: {invalid_count}")

if __name__ == "__main__":
    main()
