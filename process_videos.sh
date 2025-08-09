#!/bin/bash

# Process all MP4 videos with heavy pixelation
echo "Starting video processing with heavy pixelation..."

# Initialize counter
processed_count=0
total_videos=$(find extracted_arxiu/ -name "*.mp4" | wc -l)

echo "Total videos to process: $total_videos"

# Process each video
for video_path in extracted_arxiu/*.mp4; do
    if [ -f "$video_path" ]; then
        # Get just the filename without path
        filename=$(basename "$video_path")
        
        # Apply heavy pixelation (scale down by 20x, then scale back up with nearest neighbor)
        # This creates heavy block effect
        ffmpeg -i "$video_path" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_videos/pixelated_$filename" -y > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            processed_count=$((processed_count + 1))
            echo "Processed $processed_count/$total_videos: $filename"
        else
            echo "Failed to process: $filename"
        fi
    fi
done

echo "Video processing complete! Processed $processed_count out of $total_videos videos."