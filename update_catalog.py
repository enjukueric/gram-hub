"""
update_catalog.py — Rebuild GramHub product catalog from latest Enjuku BC backup.

Usage:
    python update_catalog.py

Looks for the most recent "Enjuku Backup *.csv" in EnjukuBackups folder,
extracts visible/purchasable products, writes catalog.json (lean, for search),
upserts extended details (thumbnail + description) to Supabase gramhub_catalog,
then commits and pushes catalog.json to GitHub.
"""

import csv
import json
import glob
import os
import re
import subprocess
import sys
import urllib.request
import urllib.error

BACKUP_DIR    = r'C:\Users\battl\EnjukuBackups'
OUTPUT        = os.path.join(os.path.dirname(__file__), 'catalog.json')
BASE_URL      = 'https://www.enjukuracing.com'
SUPABASE_URL  = 'https://mzjicrhoyftmzeqqjzbj.supabase.co'
SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16amljcmhveWZ0bXplcXFqemJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTA2MjIsImV4cCI6MjA4OTY2NjYyMn0.AnCmuMZQhvBg_vU5tx4oaNo18eJdieX02d4uawfeEI0'
BATCH_SIZE    = 500
MAX_DESC_LEN  = 600
MAX_IMG_SLOTS = 10

def find_latest_backup():
    files = glob.glob(os.path.join(BACKUP_DIR, 'Enjuku Backup *.csv'))
    if not files:
        sys.exit(f'No backup files found in {BACKUP_DIR}')
    return max(files, key=os.path.getmtime)

def strip_html(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:MAX_DESC_LEN]

def find_thumbnail(row, headers_map):
    for n in range(1, MAX_IMG_SLOTS + 1):
        thumb_key = f'Product Image Is Thumbnail - {n}'
        url_key   = f'Product Image URL - {n}'
        if thumb_key in headers_map and url_key in headers_map:
            ti = headers_map[thumb_key]
            ui = headers_map[url_key]
            if len(row) > ti and row[ti].strip() == 'Y':
                url = row[ui].strip() if len(row) > ui else ''
                if url:
                    return url
    url1_key = 'Product Image URL - 1'
    if url1_key in headers_map:
        i = headers_map[url1_key]
        return row[i].strip() if len(row) > i else ''
    return ''

def build_data(backup_path):
    catalog = []
    details = []
    with open(backup_path, encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        headers = next(reader)
        hmap = {h: i for i, h in enumerate(headers)}
        idx_type    = hmap['Item Type']
        idx_sku     = hmap['Product Code/SKU']
        idx_name    = hmap['Product Name']
        idx_url     = hmap['Product URL']
        idx_visible = hmap['Product Visible?']
        idx_allow   = hmap['Allow Purchases?']
        idx_desc    = hmap.get('Product Description', -1)
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
            full_url = BASE_URL + url
            catalog.append({'s': sku, 'n': name, 'u': full_url})
            img  = find_thumbnail(row, hmap)
            desc = strip_html(row[idx_desc]) if idx_desc >= 0 and len(row) > idx_desc else ''
            details.append({'sku': sku, 'name': name, 'url': full_url, 'img': img, 'description': desc})
    return catalog, details

def supabase_upsert(table, rows):
    url = f'{SUPABASE_URL}/rest/v1/{table}'
    data = json.dumps(rows).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'resolution=merge-duplicates,return=minimal')
    try:
        urllib.request.urlopen(req, timeout=30)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        print(f'  Supabase error {e.code}: {body[:200]}')

def upsert_details(details):
    total = len(details)
    batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
    print(f'Upserting {total:,} products to Supabase in {batches} batches...')
    for i in range(0, total, BATCH_SIZE):
        batch = details[i:i + BATCH_SIZE]
        supabase_upsert('gramhub_catalog', batch)
        done = min(i + BATCH_SIZE, total)
        print(f'  {done:,}/{total:,}', end='\r')
    print()

def main():
    backup = find_latest_backup()
    print(f'Using backup: {os.path.basename(backup)}')

    print('Building catalog...')
    catalog, details = build_data(backup)
    print(f'Products: {len(catalog):,}')

    out = json.dumps(catalog, separators=(',', ':'))
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(out)
    print(f'catalog.json written: {len(out)/1024:.1f} KB')

    upsert_details(details)
    print('Supabase catalog updated.')

    print('Pushing catalog.json to GitHub...')
    repo = os.path.dirname(__file__)
    subprocess.run(['git', 'add', 'catalog.json'], cwd=repo, check=True)
    subprocess.run(['git', 'commit', '-m', f'Update product catalog from {os.path.basename(backup)}'], cwd=repo, check=True)
    subprocess.run(['git', 'push', 'origin', 'master'], cwd=repo, check=True)
    print('Done. Catalog is live.')

if __name__ == '__main__':
    main()
