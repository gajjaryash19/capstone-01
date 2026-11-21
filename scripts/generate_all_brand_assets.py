"""
Valora Master Brand Identity & Asset Exporter
Precision-crafted SVG master assets, transparent PNGs, and favicon suite.
"""
import os
import io
import resvg_py
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

# Master Destination Paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BRAND_DIR = os.path.join(PROJECT_ROOT, "brand")
FRONTEND_BRAND = os.path.join(PROJECT_ROOT, "frontend", "public", "brand")
FRONTEND_FAVICON = os.path.join(PROJECT_ROOT, "frontend", "public", "favicon")

for d in [BRAND_DIR, os.path.join(BRAND_DIR, "svg"), os.path.join(BRAND_DIR, "png"),
         os.path.join(BRAND_DIR, "favicon"), FRONTEND_BRAND, FRONTEND_FAVICON]:
    os.makedirs(d, exist_ok=True)

# --------------------------------------------------------------------------
# Master Geometric Geometry Definitions (100x100 grid)
# --------------------------------------------------------------------------
# Left Foundation Vector: Ingest & Historical Cohorts
P_LEFT = "15,22 33,22 47,76 30,76"
# Right Trajectory Vector: Velocity & Retention Engine
P_RIGHT_BODY = "41,86 58,86 78,33 62,33 48,70 41,86"
# Right Apex Horizon Facet: Predictive Alpha & Lifetime Value Discovery
P_RIGHT_APEX = "65,26 81,26 87,12 71,12"
# Simplified Full Right Vector (for micro icons 16px if needed)
P_RIGHT_FULL = "41,86 58,86 87,12 71,12 48,70 41,86"

def build_symbol_svg(theme="primary", simplified=False):
    """
    Constructs the standalone V symbol SVG.
    Themes:
      - 'primary': #F0F0F0 with #C8F169 apex accent
      - 'mono': #F0F0F0 (dark mode / neutral)
      - 'white': #FFFFFF (pure solid white)
      - 'black': #090A0C (pure solid black / light background)
    """
    if theme == "primary":
        c_body = "#F0F0F0"
        c_apex = "#C8F169"
    elif theme == "white":
        c_body = "#FFFFFF"
        c_apex = "#FFFFFF"
    elif theme == "black":
        c_body = "#090A0C"
        c_apex = "#090A0C"
    else:  # mono
        c_body = "#F0F0F0"
        c_apex = "#F0F0F0"

    if simplified:
        return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">
  <polygon points="{P_LEFT}" fill="{c_body}"/>
  <polygon points="{P_RIGHT_FULL}" fill="{c_body}"/>
</svg>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none">
  <polygon points="{P_LEFT}" fill="{c_body}"/>
  <polygon points="{P_RIGHT_BODY}" fill="{c_body}"/>
  <polygon points="{P_RIGHT_APEX}" fill="{c_apex}"/>
</svg>"""

# --------------------------------------------------------------------------
# Wordmark Extraction (Segoe UI Bold, DIN / Geometric grotesque proportions)
# --------------------------------------------------------------------------
font = TTFont("C:/Windows/Fonts/segoeuib.ttf")
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()

def get_glyph_path(char):
    gid = cmap[ord(char)]
    glyph = glyph_set[gid]
    pen = SVGPathPen(glyph_set)
    glyph.draw(pen)
    return pen.getCommands(), glyph.width

letter_glyphs = {c: get_glyph_path(c) for c in "VALOR"}

def build_logo_svg(theme="primary", compact=False):
    """
    Constructs the master primary logo SVG: Symbol + VALORA wordmark.
    ViewBox: 280 x 72 (compact, perfectly proportioned, no dead space).
    Symbol: 52x52 at (10, 10).
    Wordmark: VALORA at optical center y=36, cap height 24, baseline 48.
    """
    if theme == "primary":
        c_body = "#F0F0F0"
        c_apex = "#C8F169"
        c_text = "#F0F0F0"
    elif theme == "white":
        c_body = "#FFFFFF"
        c_apex = "#FFFFFF"
        c_text = "#FFFFFF"
    elif theme == "black":
        c_body = "#090A0C"
        c_apex = "#090A0C"
        c_text = "#090A0C"
    else:  # mono
        c_body = "#F0F0F0"
        c_apex = "#F0F0F0"
        c_text = "#F0F0F0"

    vb_h = 72
    sym_scale = 0.52
    sym_x = 10
    sym_y = 10
    
    # Wordmark baseline at y = 48, cap-height 24.
    f_scale = 24.0 / 1434.0
    start_x = 72.0
    baseline_y = 48.0
    
    kerning_map = {
        ('V', 'A'): -160,
        ('A', 'L'): -70,
        ('L', 'O'): -50,
        ('O', 'R'): -40,
        ('R', 'A'): -80
    }
    tracking = 160.0
    
    word_svg = []
    curr_x = start_x
    word = "VALORA"
    for i, ch in enumerate(word):
        if i > 0:
            pair = (word[i-1], ch)
            curr_x += kerning_map.get(pair, 0) * f_scale
        p_cmd, w = letter_glyphs[ch]
        word_svg.append(f'<g transform="translate({curr_x:.2f}, {baseline_y:.2f}) scale({f_scale:.6f}, -{f_scale:.6f})"><path d="{p_cmd}" fill="{c_text}"/></g>')
        curr_x += (w + tracking) * f_scale

    actual_width = int(curr_x + 12)  # tight clean boundary
    
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {actual_width} {vb_h}" width="100%" height="100%" fill="none">
  <!-- Valora Master Brand Logo (Symbol + Wordmark) -->
  <g transform="translate({sym_x}, {sym_y}) scale({sym_scale})">
    <polygon points="{P_LEFT}" fill="{c_body}"/>
    <polygon points="{P_RIGHT_BODY}" fill="{c_body}"/>
    <polygon points="{P_RIGHT_APEX}" fill="{c_apex}"/>
  </g>
  <g id="wordmark">
    {''.join(word_svg)}
  </g>
</svg>"""

# --------------------------------------------------------------------------
# Generate Master SVGs
# --------------------------------------------------------------------------
svg_assets = {
    "valora-symbol.svg": build_symbol_svg("primary"),
    "valora-symbol-mono.svg": build_symbol_svg("mono"),
    "valora-logo.svg": build_logo_svg("primary"),
    "valora-logo-mono.svg": build_logo_svg("mono"),
}

for filename, content in svg_assets.items():
    with open(os.path.join(BRAND_DIR, "svg", filename), "w", encoding="utf-8") as f:
        f.write(content)
    with open(os.path.join(FRONTEND_BRAND, filename), "w", encoding="utf-8") as f:
        f.write(content)

print("Generated master SVG files.")

# --------------------------------------------------------------------------
# Generate Transparent PNG Exports
# --------------------------------------------------------------------------
png_jobs = [
    ("valora-symbol.png", build_symbol_svg, "primary", 1024, 1024),
    ("valora-symbol-white.png", build_symbol_svg, "white", 1024, 1024),
    ("valora-symbol-black.png", build_symbol_svg, "black", 1024, 1024),
    ("valora-logo.png", build_logo_svg, "primary", 1024, None),
    ("valora-logo-white.png", build_logo_svg, "white", 1024, None),
    ("valora-logo-black.png", build_logo_svg, "black", 1024, None),
]

for filename, builder, theme, w, h in png_jobs:
    svg_str = builder(theme)
    if h is None:
        png_data = resvg_py.svg_to_bytes(svg_string=svg_str, width=w)
    else:
        png_data = resvg_py.svg_to_bytes(svg_string=svg_str, width=w, height=h)

    for target_dir in [os.path.join(BRAND_DIR, "png"), FRONTEND_BRAND]:
        with open(os.path.join(target_dir, filename), "wb") as f:
            f.write(png_data)

    im = Image.open(io.BytesIO(png_data))
    print(f"Exported PNG: {filename} -> Size: {im.size}, Mode: {im.mode}")

# --------------------------------------------------------------------------
# Generate Favicon Suite
# --------------------------------------------------------------------------
favicon_svg_content = build_symbol_svg("primary")
favicon_16_svg = build_symbol_svg("primary")

favicon_targets = [
    ("favicon-16.png", 16, 16),
    ("favicon-32.png", 32, 32),
    ("favicon-48.png", 48, 48),
    ("apple-touch-icon.png", 180, 180),
    ("favicon-96x96.png", 96, 96),
    ("web-app-manifest-192x192.png", 192, 192),
    ("web-app-manifest-512x512.png", 512, 512),
]

for target_dir in [os.path.join(BRAND_DIR, "favicon"), FRONTEND_FAVICON]:
    with open(os.path.join(target_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(favicon_svg_content)

pil_images = {}
for filename, w, h in favicon_targets:
    raw_svg = favicon_16_svg if w <= 16 else favicon_svg_content
    png_bytes = resvg_py.svg_to_bytes(svg_string=raw_svg, width=w, height=h)
    im = Image.open(io.BytesIO(png_bytes))
    pil_images[w] = im

    for target_dir in [os.path.join(BRAND_DIR, "favicon"), FRONTEND_FAVICON]:
        with open(os.path.join(target_dir, filename), "wb") as f:
            f.write(png_bytes)
    print(f"Exported Favicon: {filename} -> Size: {im.size}")

# Generate multi-size favicon.ico
ico_path_brand = os.path.join(BRAND_DIR, "favicon", "favicon.ico")
ico_path_frontend = os.path.join(FRONTEND_FAVICON, "favicon.ico")

base_img = pil_images[48]
ico_sizes = [(16, 16), (32, 32), (48, 48)]
for ico_dest in [ico_path_brand, ico_path_frontend]:
    base_img.save(
        ico_dest,
        format="ICO",
        sizes=ico_sizes,
        append_images=[pil_images[16], pil_images[32]]
    )
print("Generated multi-resolution favicon.ico (16, 32, 48)")

print("\n--- ALL ASSETS EXPORTED SUCCESSFULLY ---")
