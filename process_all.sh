#!/bin/bash

echo "Starting batch processing of images and videos..."

# Process all JPG images with moderate blur
echo "Processing images with moderate blur..."
processed_images=0
total_images=$(find extracted_arxiu/ -name "*.jpg" | wc -l)
echo "Total images to process: $total_images"

find extracted_arxiu/ -name "*.jpg" | while read img_path; do
    if [ -f "$img_path" ]; then
        filename=$(basename "$img_path")
        convert "$img_path" -blur 0x4 "processed_images/blurred_$filename"
        if [ $? -eq 0 ]; then
            processed_images=$((processed_images + 1))
            echo "✓ Image $processed_images/$total_images: $filename"
        else
            echo "✗ Failed to process image: $filename"
        fi
    fi
done

echo "Image processing complete!"

# Process all MP4 videos with heavy pixelation
echo "Processing videos with heavy pixelation..."
processed_videos=0
total_videos=$(find extracted_arxiu/ -name "*.mp4" | wc -l)
echo "Total videos to process: $total_videos"

find extracted_arxiu/ -name "*.mp4" | while read video_path; do
    if [ -f "$video_path" ]; then
        filename=$(basename "$video_path")
        ffmpeg -i "$video_path" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_videos/pixelated_$filename" -y > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            processed_videos=$((processed_videos + 1))
            echo "✓ Video $processed_videos/$total_videos: $filename"
        else
            echo "✗ Failed to process video: $filename"
        fi
    fi
done

echo "Video processing complete!"

# Final summary
final_img_count=$(ls processed_images/ 2>/dev/null | wc -l)
final_vid_count=$(ls processed_videos/ 2>/dev/null | wc -l)

echo "=================================="
echo "PROCESSING COMPLETE!"
echo "Images processed: $final_img_count/$total_images"
echo "Videos processed: $final_vid_count/$total_videos"
echo "=================================="