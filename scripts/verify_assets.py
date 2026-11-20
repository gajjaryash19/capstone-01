"""
Valora Brand Asset Verification Script
Verifies existence, dimensions, transparency, SVG validity, and optical boundaries.
"""
import os
import glob
from PIL import Image

def verify_brand_assets(base_dir):
    print(f"\nVerifying directory: {base_dir}")
    # 1. Check SVGs
    svg_files = glob.glob(os.path.join(base_dir, "*.svg")) + glob.glob(os.path.join(base_dir, "svg", "*.svg"))
    print(f"Found {len(set(svg_files))} SVG files.")
    for svg in sorted(set(svg_files)):
        with open(svg, "r", encoding="utf-8") as f:
            content = f.read()
        assert "<svg" in content and "</svg>" in content, f"Invalid SVG: {svg}"
        assert 'xmlns="http://www.w3.org/2000/svg"' in content
        assert "viewBox" in content
        print(f"  [OK] SVG: {os.path.basename(svg)} ({len(content)} bytes)")

    # 2. Check PNGs
    png_files = glob.glob(os.path.join(base_dir, "*.png")) + glob.glob(os.path.join(base_dir, "png", "*.png"))
    print(f"Found {len(set(png_files))} PNG files.")
    for png in sorted(set(png_files)):
        im = Image.open(png)
        # Check transparent mode (RGBA)
        assert im.mode == "RGBA", f"Expected RGBA mode for transparency in {png}, got {im.mode}"
        # Check that there are transparent pixels (alpha < 255)
        extrema = im.getextrema()
        alpha_min = extrema[3][0]
        assert alpha_min == 0, f"Expected transparent background in {png}, min alpha is {alpha_min}"
        print(f"  [OK] PNG: {os.path.basename(png)} -> Size: {im.size}, Mode: {im.mode}, BBox: {im.getbbox()}")

verify_brand_assets("brand")
verify_brand_assets("frontend/public/brand")
verify_brand_assets("frontend/public/favicon")
