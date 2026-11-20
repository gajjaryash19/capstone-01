"""
Script to synchronize pure vector SVG favicon across public paths.
"""
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BRAND_FAVICON_SVG = ROOT_DIR / 'brand' / 'favicon' / 'favicon.svg'
FRONTEND_FAVICON_SVG = ROOT_DIR / 'frontend' / 'public' / 'favicon' / 'favicon.svg'

with open(BRAND_FAVICON_SVG, 'r', encoding='utf-8') as f:
    svg_content = f.read()

with open(FRONTEND_FAVICON_SVG, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('SVG favicon synchronized successfully at', FRONTEND_FAVICON_SVG)
