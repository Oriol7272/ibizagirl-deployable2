#!/bin/bash

# Process all JPG images with moderate blur
echo "Starting image processing with moderate blur..."

# Initialize counter
processed_count=0
total_images=$(find extracted_arxiu/ -name "*.jpg" | wc -l)

echo "Total images to process: $total_images"

# Process each image
for img_path in extracted_arxiu/*.jpg; do
    if [ -f "$img_path" ]; then
        # Get just the filename without path
        filename=$(basename "$img_path")
        
        # Apply moderate blur (blur radius 0x4) and save to processed_images
        convert "$img_path" -blur 0x4 "processed_images/blurred_$filename"
        
        if [ $? -eq 0 ]; then
            processed_count=$((processed_count + 1))
            echo "Processed $processed_count/$total_images: $filename"
        else
            echo "Failed to process: $filename"
        fi
    fi
done

echo "Image processing complete! Processed $processed_count out of $total_images images."