"""
update_catalog.py — Rebuild GramHub product catalog from latest Enjuku BC backup.

Usage:
    python update_catalog.py

Looks for the most recent "Enjuku Backup *.csv" in EnjukuBackups folder,
extracts visible/purchasable products, writes catalog.json to this folder,
then commits and pushes to GitHub.
"""

import csv
import json
import glob
import os
import subprocess
import sys

BACKUP_DIR = r'C:\Users\battl\EnjukuBackups'
OUTPUT     = os.path.join(os.path.dirname(__file__), 'catalog.json')
BASE_URL   = 'https://www.enjukuracing.com'

def find_latest_backup():
    files = glob.glob(os.path.join(BACKUP_DIR, 'Enjuku Backup *.csv'))
    if not files:
        sys.exit(f'No backup files found in {BACKUP_DIR}')
    latest = max(files, key=os.path.getmtime)
    return latest

def build_catalog(backup_path):
    catalog = []
    with open(backup_path, encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        headers = next(reader)
        idx_type    = headers.index('Item Type')
        idx_sku     = headers.index('Product Code/SKU')
        idx_name    = headers.index('Product Name')
        idx_url     = headers.index('Product URL')
        idx_visible = headers.index('Product Visible?')
        idx_allow   = headers.index('Allow Purchases?')
        for row in reader:
            if len(row) <= idx_url:
                continue
            if row[idx_type].strip() != 'Product':
                continue
            if row[idx_visible].strip() != 'Y':
                continue
            if row[idx_allow].strip() != 'Y':
                continue
            sku  = row[idx_sku].strip()
            name = row[idx_name].strip()
            url  = row[idx_url].strip()
            if not sku or not url:
                continue
            catalog.append({'s': sku, 'n': name, 'u': BASE_URL + url})
    return catalog

def main():
    backup = find_latest_backup()
    print(f'Using backup: {os.path.basename(backup)}')

    print('Building catalog...')
    catalog = build_catalog(backup)
    print(f'Products: {len(catalog):,}')

    out = json.dumps(catalog, separators=(',', ':'))
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'Written: {len(out)/1024:.1f} KB')

    print('Pushing to GitHub...')
    repo = os.path.dirname(__file__)
    subprocess.run(['git', 'add', 'catalog.json'], cwd=repo, check=True)
    subprocess.run(['git', 'commit', '-m', f'Update product catalog from {os.path.basename(backup)}'], cwd=repo, check=True)
    subprocess.run(['git', 'push', 'origin', 'master'], cwd=repo, check=True)
    print('Done. Catalog is live.')

if __name__ == '__main__':
    main()
