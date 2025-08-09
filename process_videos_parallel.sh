#!/bin/bash

echo "Processing remaining videos with parallel processing..."

# Get list of videos that haven't been processed yet
all_videos=$(find extracted_arxiu/ -name "*.mp4")
processed_videos=$(ls processed_videos/ 2>/dev/null | sed 's/pixelated_//' | sort)

remaining_videos=""
for video in $all_videos; do
    filename=$(basename "$video")
    if [[ ! "$processed_videos" =~ "$filename" ]]; then
        remaining_videos="$remaining_videos $video"
    fi
done

total_remaining=$(echo $remaining_videos | wc -w)
echo "Remaining videos to process: $total_remaining"

# Process 4 videos in parallel at a time
export -f process_video
echo "$remaining_videos" | xargs -n 1 -P 4 -I {} bash -c '
    filename=$(basename "{}")
    echo "Processing: $filename"
    ffmpeg -i "{}" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_videos/pixelated_$filename" -y > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Completed: $filename"
    else
        echo "✗ Failed: $filename"
    fi
'

echo "Parallel video processing complete!"
final_vid_count=$(ls processed_videos/ 2>/dev/null | wc -l)
echo "Total videos processed: $final_vid_count/140"