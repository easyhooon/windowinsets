#!/usr/bin/env python3
"""Import original Galaxy artwork from user-downloaded Samsung ZIPs.

Usage: python3 scripts/import-samsung-skins.py /path/to/downloads
Only layout and its referenced background/foreground are copied. Existing entries
are preserved. Screen coordinates come from layout; body clips are illustrative.
"""
import argparse
import json
from pathlib import Path
import re
import struct
import zipfile

ROOT = Path(__file__).resolve().parents[1]
# Illustration-only outer corner clips, in source image pixels. Not RoundedCorner data.
RADII = {'s20': 190, 's20-fe': 115, 's20-plus': 165, 's20-ultra': 165,
         's21': 140, 's21-fe': 135, 's21-plus': 135, 's21-ultra': 180,
         's22': 140, 's22-plus': 140, 's22-ultra': 30,
         's23': 145, 's23-fe': 145, 's23-plus': 135, 's23-ultra': 30,
         's24': 135, 's24-fe': 155, 's24-plus': 165, 's24-ultra': 30,
         's25': 160, 's25-edge': 140, 's25-fe': 145,
         's26': 120, 's26-fe': 145, 's26-plus': 145, 's26-ultra': 140}


def import_skins(downloads):
    manifest = ROOT / 'app/data/skins.ts'
    header, payload = manifest.read_text().split('export const skins: Record<string, DeviceSkin> = ', 1)
    skins = json.loads(payload.strip().removesuffix(';'))
    imported = []
    catalog = []
    for archive in sorted(downloads.glob('Galaxy*.zip')):
        if 'TriFold' in archive.stem:
            continue  # Separate product decision; do not register automatically.
        slug = re.sub(r'[^a-z0-9]+', '-', archive.stem.lower()).strip('-')
        name = archive.stem.replace('_', ' ')
        if slug.startswith('galaxy-tab-'):
            family, form = 'Galaxy Tab', 'tablet'
        elif 'fold' in slug:
            family, form = 'Galaxy Z Fold', 'foldable-book'
        elif 'flip' in slug:
            family, form = 'Galaxy Z Flip', 'foldable-flip'
        elif slug.startswith('galaxy-note'):
            family, form = 'Galaxy Note', 'bar'
        elif re.match(r'galaxy-a\d', slug):
            family, form = 'Galaxy A', 'bar'
        elif re.match(r'galaxy-s\d', slug):
            family, form = 'Galaxy S', 'bar'
        else:
            continue
        screens = []
        with zipfile.ZipFile(archive) as z:
            files = {n.lower(): n for n in z.namelist() if not n.startswith('__MACOSX/')}
            layouts = sorted(n for n in files.values() if n.endswith('/layout'))
            for layout_name in layouts:
                folder = layout_name.rsplit('/', 1)[0]
                leaf = folder.rsplit('/', 1)[-1].lower()
                screen_id = 'cover' if 'cover' in leaf or ('folded' in leaf and 'unfolded' not in leaf) else 'main'
                assert screen_id not in screens, f'Duplicate screen in {archive.name}'
                screens.append(screen_id)
                key = f'{slug}/{screen_id}'
                if key in skins:
                    continue
                original_layout = z.read(layout_name)
                layout = original_layout.decode()
                background = re.search(r'background\s*{\s*image\s+(\S+)', layout)[1]
                if slug == 'galaxy-tab-s6' and background == 'device_Port-Black.png':
                    background = 'device_Port-Grey.png'  # Official ZIP has no Black asset.
                mask_match = re.search(r'foreground\s*{\s*mask\s+(\S+)', layout)
                foreground = mask_match[1] if mask_match else None
                def asset(name):
                    # Some official layouts use different filename casing than their ZIP.
                    return z.read(files[f'{folder}/{name}'.lower()])
                image = asset(background)
                assert image[:8] == b'\x89PNG\r\n\x1a\n'
                width, height = struct.unpack('>II', image[16:24])
                sw, sh = map(int, re.search(r'display\s*{\s*width\s+(\d+)\s*height\s+(\d+)', layout).groups())
                x, y = map(int, re.search(r'part2\s*{\s*name\s+device\s*x\s+(\d+)\s*y\s+(\d+)', layout).groups())
                assert x + sw <= width and y + sh <= height, archive.name
                dest = ROOT / 'public/skins' / key
                dest.mkdir(parents=True, exist_ok=True)
                assets = [('device.png', image), ('layout', original_layout)]
                if foreground:
                    assets.append(('foreground.png', asset(foreground)))
                for filename, data in assets:
                    (dest / filename).write_bytes(data)
                (dest / 'source.json').write_text(json.dumps({
                    'archive': archive.name, 'folder': folder,
                    'background': background, 'foreground': foreground,
                    'source': 'https://developer.samsung.com/galaxy-emulator-skin',
                    'providedAt': '2026-09-22',
                }, indent=2) + '\n')
                margin = (100 if 'active' in slug else 55) if form == 'tablet' else 40
                mx, my = min(margin, x), min(margin, y)
                skins[key] = {'image': f'/skins/{key}/device.png',
                              'foreground': f'/skins/{key}/foreground.png' if foreground else None,
                              'width': width, 'height': height,
                              'screen': {'x': x, 'y': y, 'width': sw, 'height': sh},
                              'body': {'x': x-mx, 'y': y-my,
                                       'width': min(sw+2*mx, width-(x-mx)),
                                       'height': min(sh+2*my, height-(y-my)),
                                       'radius': RADII.get(slug.removeprefix('galaxy-'), 70 if form == 'tablet' else 100)}}
                if slug == 'galaxy-s20':
                    skins[key]['body'] = {'x': 334, 'y': 325, 'width': 1558, 'height': 3368, 'radius': 220}
                imported.append(key)
        if screens:
            catalog.append({'slug': slug, 'name': name, 'series': family, 'formFactor': form,
                            'screens': sorted(screens, key=lambda value: value != 'cover')})
    (ROOT / 'app/data/skinCatalog.json').write_text(json.dumps(catalog, indent=2) + '\n')
    manifest.write_text(header + 'export const skins: Record<string, DeviceSkin> = ' + json.dumps(skins, indent=2) + ';\n')
    print(f'Imported {len(imported)} skins: ' + ', '.join(imported))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('downloads', type=Path)
    import_skins(parser.parse_args().downloads)
