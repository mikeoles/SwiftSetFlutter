import os
import sqlite3
import traceback  # Add this import at the top of the file
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
        # Fallback for path-based IDs like /embed/ or /v/
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
        print("CRITICAL ERROR: YOUTUBE_API_KEY environment variable is completely empty or missing.")
        return set()

    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        request = youtube.videos().list(part='id', id=','.join(video_ids))
        response = request.execute()
        valid_ids = {item['id'] for item in response.get('items', [])}
        return valid_ids
    except Exception as e:
        print("\n--- API REQUEST EXCEPTION ---")
        print(f"Error Type: {type(e)}")
        
        # Safely extract the hidden payload from the Google API wrapper
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
    # Path adjusted to 'assets/exercises.db' because GitHub Actions executes from the root folder
    db_path = os.path.join('assets', 'exercises.db')
    
    if not os.path.exists(db_path):
        print(f"CRITICAL ERROR: Database file not found at path: {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, url FROM exercises")
    entries = cursor.fetchall()
    conn.close()

    # Step 1: Parse all valid video IDs and map them back to their URLs
    id_to_url_map = {}
    for _, url in entries:
        video_id = extract_video_id(url)
        if video_id:
            id_to_url_map[video_id] = url
        elif url:
            print(f"Unable to extract video ID from URL: {url}")

    # Step 2: Batch process the unique IDs in chunks of 50
    unique_ids = list(id_to_url_map.keys())
    valid_count = 0
    invalid_count = 0
    
    print(f"Starting validation for {len(unique_ids)} unique video links...\n")
    
    for i in range(0, len(unique_ids), 50):
        batch = unique_ids[i:i+50]
        valid_batch_ids = check_youtube_videos_batch(batch)
        
        valid_count += len(valid_batch_ids)
        
        # Identify invalid ones in this specific batch
        for vid in batch:
            if vid not in valid_batch_ids:
                invalid_count += 1
                print(f"[INVALID] Video ID: {vid} | URL: {id_to_url_map[vid]}")

    print("\n--- Final Summary ---")
    print(f"Total Unique Videos Checked: {len(unique_ids)}")
    print(f"Valid Videos: {valid_count}")
    print(f"Invalid Videos Broken: {invalid_count}")

if __name__ == "__main__":
    main()
