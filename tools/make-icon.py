# App icon: black background with a glowing violet play mark (own design).
# Usage: python tools/make-icon.py  → src/static/icon.png (80x80) and largeIcon.png (130x130)
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = 1024


def gradient(size, top, bottom):
    g = Image.new('RGBA', (size, size))
    d = ImageDraw.Draw(g)
    for y in range(size):
        t = y / (size - 1)
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)) + (255,)
        d.line([(0, y), (size, y)], fill=c)
    return g


def rounded_triangle(size, pts, radius):
    # Draw the triangle, then round it: shrink, blur and threshold gives soft rounded corners.
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    m = m.filter(ImageFilter.MinFilter(radius * 2 + 1)).filter(ImageFilter.GaussianBlur(radius))
    # hard edge at 4x size; the final downscale smooths it
    return m.point(lambda v: 255 if v > 60 else 0)


def build():
    img = Image.new('RGBA', (S, S), (11, 10, 18, 255))
    # soft violet glow behind the mark
    glow = Image.new('L', (S, S), 0)
    ImageDraw.Draw(glow).ellipse([S * 0.16, S * 0.16, S * 0.84, S * 0.84], fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(S * 0.09))
    img.paste((123, 91, 245, 255), (0, 0), glow.point(lambda v: int(v * 0.55)))

    # play triangle, slightly right of centre (optical balance), upper part of the icon
    cx, cy, h = S * 0.54, S * 0.5, S * 0.5
    pts = [(cx - h * 0.45, cy - h * 0.52), (cx - h * 0.45, cy + h * 0.52), (cx + h * 0.55, cy)]
    mask = rounded_triangle(S, pts, int(S * 0.035))
    img.paste(gradient(S, (176, 156, 255), (106, 60, 240)), (0, 0), mask)

    return img


def main():
    big = build()
    out = os.path.join(ROOT, 'src', 'static')
    big.resize((130, 130), Image.LANCZOS).save(os.path.join(out, 'largeIcon.png'))
    big.resize((80, 80), Image.LANCZOS).save(os.path.join(out, 'icon.png'))
    big.resize((512, 512), Image.LANCZOS).save(os.path.join(ROOT, 'docs', 'icon-preview.png'))
    print('icons written')


main()
