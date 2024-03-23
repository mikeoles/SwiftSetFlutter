import sqlite3
from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs

# Function to check if a YouTube video exists
def is_valid_youtube_video(video_id):
    api_key = "enterhere"
    youtube = build('youtube', 'v3', developerKey=api_key)
    request = youtube.videos().list(part='snippet', id=video_id)
    try:
        response = request.execute()
        return bool(response.get('items'))
    except Exception as e:
        print("Error:", e)
        return False

# Function to extract video ID from YouTube URL
def extract_video_id(url):
    parsed_url = urlparse(url)
    if parsed_url.hostname == 'youtu.be':
        video_id = parsed_url.path[1:]
        if '&t=' in video_id:
            video_id = video_id.split("&t=")[0]  # Remove any additional query parameters
        return video_id
    elif parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        if 'v' in parsed_url.query:
            video_id = parse_qs(parsed_url.query)['v'][0]
            if '&t=' in video_id:
                video_id = video_id.split("&t=")[0]  # Remove any additional query parameters
            if '?t=' in video_id:
                video_id = video_id.split("?t=")[0]  # Remove any additional query parameters
            return video_id
        elif 'list' in parsed_url.query and 'v' in parsed_url.query:
            return parse_qs(parsed_url.query)['v'][0]
        else:
            video_id = parsed_url.path.split('/')[-1]
            if 't' in parse_qs(parsed_url.query):
                video_id = video_id.split('?')[0]
            return video_id
    else:
        return None

# Connect to the SQLite database
conn = sqlite3.connect('exercises.db')
cursor = conn.cursor()

# Execute a query to select all entries from the "exercises" table
cursor.execute("SELECT id, url FROM exercises")
entries = cursor.fetchall()

# Iterate through each entry and check URL validity
x = 0
count = 0
for entry in entries:
    exercise_id, url = entry
    if url:  # Check if URL is not empty
        video_id = extract_video_id(url)
        if video_id:
            if is_valid_youtube_video(video_id):
                x = 1
            else:
                print(f"Video ID {video_id} extracted from URL {url} is invalid.")
        else:
            print(f"Unable to extract video ID from URL {url}")

# Close the database connection
conn.close()
