#!/bin/bash

echo "======================================="
echo "    PROCESSING BATCH 2 MEDIA FILES"
echo "======================================="
echo ""

# Count total files to process
total_images_zip2=$(find extracted_arxiu2/ -name "*.jpg" -not -path "*__MACOSX*" -not -name "._*" | wc -l)
total_images_zip3=$(find extracted_arxiu3/ -name "*.jpg" -not -path "*__MACOSX*" -not -name "._*" | wc -l)
total_videos_zip3=$(find extracted_arxiu3/ -name "*.mp4" -not -path "*__MACOSX*" -not -name "._*" | wc -l)
total_individual_videos=2
total_individual_images=1

total_images=$((total_images_zip2 + total_images_zip3 + total_individual_images))
total_videos=$((total_videos_zip3 + total_individual_videos))

echo "📊 PROCESSING PLAN:"
echo "   Images from Arxiu2.zip: $total_images_zip2"
echo "   Images from Arxiu3.zip: $total_images_zip3" 
echo "   Individual image file: $total_individual_images"
echo "   Total images to blur: $total_images"
echo ""
echo "   Videos from Arxiu3.zip: $total_videos_zip3"
echo "   Individual video files: $total_individual_videos"
echo "   Total videos to pixelate: $total_videos"
echo ""

# Process images with moderate blur
echo "🖼️  PROCESSING IMAGES WITH MODERATE BLUR..."
processed_images=0

# Process images from Arxiu2.zip
echo "Processing images from Arxiu2.zip..."
find extracted_arxiu2/ -name "*.jpg" -not -path "*__MACOSX*" -not -name "._*" | while read img_path; do
    filename=$(basename "$img_path")
    convert "$img_path" -blur 0x4 "processed_batch2_images/batch2_blurred_$filename"
    if [ $? -eq 0 ]; then
        processed_images=$((processed_images + 1))
        echo "✓ Image: $filename"
    else
        echo "✗ Failed: $filename"
    fi
done

# Process images from Arxiu3.zip
echo "Processing images from Arxiu3.zip..."
find extracted_arxiu3/ -name "*.jpg" -not -path "*__MACOSX*" -not -name "._*" | while read img_path; do
    filename=$(basename "$img_path")
    convert "$img_path" -blur 0x4 "processed_batch2_images/batch2_blurred_$filename"
    if [ $? -eq 0 ]; then
        processed_images=$((processed_images + 1))
        echo "✓ Image: $filename"
    else
        echo "✗ Failed: $filename"
    fi
done

# Process individual image file
echo "Processing individual image file..."
if [ -f "new_image.jpg" ]; then
    convert "new_image.jpg" -blur 0x4 "processed_batch2_images/batch2_blurred_WEYv5fEVOU5b3TXEhdvp.jpg"
    if [ $? -eq 0 ]; then
        echo "✓ Individual image processed"
    else
        echo "✗ Failed to process individual image"
    fi
fi

echo "Image processing complete!"
echo ""

# Process videos with heavy pixelation
echo "🎬 PROCESSING VIDEOS WITH HEAVY PIXELATION..."
processed_videos=0

# Process videos from Arxiu3.zip
echo "Processing videos from Arxiu3.zip..."
find extracted_arxiu3/ -name "*.mp4" -not -path "*__MACOSX*" -not -name "._*" | while read video_path; do
    filename=$(basename "$video_path")
    ffmpeg -i "$video_path" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_batch2_videos/batch2_pixelated_$filename" -y > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        processed_videos=$((processed_videos + 1))
        echo "✓ Video: $filename"
    else
        echo "✗ Failed: $filename"
    fi
done

# Process individual video files
echo "Processing individual video files..."
if [ -f "new_video1.mp4" ]; then
    ffmpeg -i "new_video1.mp4" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_batch2_videos/batch2_pixelated_JswE4SwqdmsQfLef3PzC.mp4" -y > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Individual video 1 processed"
    else
        echo "✗ Failed to process individual video 1"
    fi
fi

if [ -f "new_video2.mp4" ]; then
    ffmpeg -i "new_video2.mp4" -vf "scale=iw/20:ih/20,scale=iw*20:ih*20:flags=neighbor" -c:a copy "processed_batch2_videos/batch2_pixelated_ImHBnXCOaNfqltnBwcUh.mp4" -y > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Individual video 2 processed"
    else
        echo "✗ Failed to process individual video 2"
    fi
fi

echo "Video processing complete!"
echo ""

# Final summary
final_img_count=$(ls processed_batch2_images/ 2>/dev/null | wc -l)
final_vid_count=$(ls processed_batch2_videos/ 2>/dev/null | wc -l)

echo "======================================="
echo "       BATCH 2 PROCESSING COMPLETE!"
echo "======================================="
echo "📊 RESULTS:"
echo "   Images processed: $final_img_count/$total_images"
echo "   Videos processed: $final_vid_count/$total_videos"
echo ""
echo "📁 OUTPUT DIRECTORIES:"
echo "   🖼️  Blurred images: processed_batch2_images/"
echo "   🎬 Pixelated videos: processed_batch2_videos/"
echo ""
echo "🎯 All files processed with:"
echo "   • Moderate blur for images (0x4 blur radius)"
echo "   • Heavy pixelation for videos (20x scale reduction)"
echo "======================================="