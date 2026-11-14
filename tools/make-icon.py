# App icon: black background with a glowing violet play mark and "7M" (own design).
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
    ImageDraw.Draw(glow).ellipse([S * 0.18, S * 0.12, S * 0.82, S * 0.76], fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(S * 0.09))
    img.paste((123, 91, 245, 255), (0, 0), glow.point(lambda v: int(v * 0.55)))

    # play triangle, slightly right of centre (optical balance), upper part of the icon
    cx, cy, h = S * 0.53, S * 0.41, S * 0.46
    pts = [(cx - h * 0.45, cy - h * 0.52), (cx - h * 0.45, cy + h * 0.52), (cx + h * 0.55, cy)]
    mask = rounded_triangle(S, pts, int(S * 0.035))
    img.paste(gradient(S, (176, 156, 255), (106, 60, 240)), (0, 0), mask)

    # "7M" under the mark
    font = None
    for f in ['C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf']:
        if os.path.exists(f):
            font = ImageFont.truetype(f, int(S * 0.17))
            break
    d = ImageDraw.Draw(img)
    text = '7M'
    box = d.textbbox((0, 0), text, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    d.text(((S - tw) / 2 - box[0], S * 0.74 - box[1]), text, font=font, fill=(236, 232, 255, 255))
    return img


def main():
    big = build()
    out = os.path.join(ROOT, 'src', 'static')
    big.resize((130, 130), Image.LANCZOS).save(os.path.join(out, 'largeIcon.png'))
    big.resize((80, 80), Image.LANCZOS).save(os.path.join(out, 'icon.png'))
    big.resize((512, 512), Image.LANCZOS).save(os.path.join(ROOT, 'docs', 'icon-preview.png'))
    print('icons written')


main()
