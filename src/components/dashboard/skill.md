---
name: menu-image-fetcher
description: Sources, downloads, optimizes, and renames royalty-free food images for a restaurant menu JSON/CSV list into a local project folder.
---

# Menu Image Fetcher Skill

## Goal
Populate a local folder (`public/images/menu/`) with clean, royalty-free food images matching a structured menu list, and output an updated `menu_with_images.json` mapping each item to its local file path.

## Workflow
1. **Read Input:** Load `menu.json` containing item `id`, `name`, `category`, `diet`, and `search_query`.
2. **Source Image (Per Item):**
   - Use the browser subagent or Wikimedia Commons / Unsplash / Pixabay search to find a high-resolution, watermark-free, commercially usable photo matching `search_query` (falling back to `category` if exact dish results are empty).
   - Never download watermarked stock previews (Shutterstock, iStock, Getty, Alamy).
3. **Download & Standardize:**
   - Download the image to `public/images/menu/{id:03d}_{sanitized_name}.webp`.
   - Convert/resize to 800x600 (cover crop) using Python `Pillow` or Node `sharp` so all menu cards have uniform aspect ratios and fast load times.
4. **Verify & Log:**
   - Confirm each saved file is non-empty (>10 KB) and valid image binary.
   - Update `menu_with_images.json` with `"image": "/images/menu/001_Plain_Roti.webp"` and `"source_url"` for license tracking.
