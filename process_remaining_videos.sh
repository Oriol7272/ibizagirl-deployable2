#!/bin/bash

echo "Processing remaining videos (134 left)..."

# Count current processed videos
current_count=$(ls processed_videos/ | wc -l)
echo "Currently processed: $current_count videos"

# Process remaining videos
count=0
find extracted_arxiu/ -name "*.mp4" | while read video_path; do
    filename=$(basename "$video_path")
    output_file="processed_videos/pixelated_$filename"
    
    # Skip if already processed
    if [ -f "$output_file" ]; then
        continue
    fi
    
    ffmpeg -i "$video_path" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "$output_file" -y > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        count=$((count + 1))
        new_total=$((current_count + count))
        echo "✓ Processed $new_total/140: $filename"
    else
        echo "✗ Failed to process: $filename"
    fi
done

final_count=$(ls processed_videos/ | wc -l)
echo "Processing complete! Total videos: $final_count/140"