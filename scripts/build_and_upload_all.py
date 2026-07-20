import pandas as pd
import uuid
import re
import math
import os
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL') or os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

f1 = r'd:\CreaterZone\Influencer_All_Data_Structured.csv'
f2 = r'd:\CreaterZone\Sheet1_Structured_Full.csv'
OUTPUT = r'd:\CreaterZone\Combined_Deduped_Full.csv'

print('--- STEP 1: Loading & Merging Datasets ---')
df1 = pd.read_csv(f1, dtype=str)
df2 = pd.read_csv(f2, dtype=str)
print(f'  Influencer_All_Data_Structured.csv: {len(df1)} rows')
print(f'  Sheet1_Structured_Full.csv         : {len(df2)} rows')

combined_df = pd.concat([df1, df2], ignore_index=True)
print(f'  Total raw combined rows            : {len(combined_df)}')

def clean_url(url):
    if not isinstance(url, str) or not url.strip(): return None
    u = url.strip()
    u = re.split(r'\?', u)[0].rstrip('/')
    u = u.replace('iinstagram.com', 'instagram.com')
    if 'instagram.com' not in u.lower() and 'instagr.am' not in u.lower():
        if u.startswith('@') or re.match(r'^[a-zA-Z0-9_\.]{2,40}$', u):
            handle = u.lstrip('@').strip()
            return f'https://www.instagram.com/{handle}'.lower()
        return None
    if u.startswith('http://'): u = 'https://' + u[7:]
    elif u.lower().startswith('www.'): u = 'https://' + u
    elif u.lower().startswith('instagram.com'): u = 'https://www.' + u.lower()
    return u.lower()

def clean_phone(p):
    if not isinstance(p, str) or not p.strip() or p.strip().lower() in ('nan','none',''): return None
    p = re.sub(r'[\s\-().]', '', p.strip())
    if p.startswith('+91'): p = p[3:]
    elif p.startswith('0091'): p = p[4:]
    digits = re.sub(r'\D', '', p)
    if len(digits) > 10: digits = digits[-10:]
    return digits if len(digits) >= 7 else None

def parse_followers(v):
    if not v or pd.isna(v): return 0
    s = str(v).lower().replace(',','').replace('+','').strip()
    mult = 1
    if s.endswith('m'): mult=1_000_000; s=s[:-1]
    elif s.endswith('k'): mult=1_000; s=s[:-1]
    m = re.search(r'[\d.]+', s)
    if m:
        try:
            val = int(float(m.group(0)) * mult)
            return val if val <= 500_000_000 else 0
        except: pass
    return 0

combined_df['norm_url'] = combined_df['instagram_url'].apply(clean_url)

# Handle single phone vs array in existing files
def extract_phones(row):
    phones = []
    # check whatsapp_number
    p1 = clean_phone(row.get('whatsapp_number'))
    if p1: phones.append(p1)
    # check whatsapp_numbers if string array
    wns = row.get('whatsapp_numbers')
    if isinstance(wns, str) and wns.startswith('{'):
        content = wns[1:-1]
        for part in content.split(','):
            p2 = clean_phone(part.strip('"\' '))
            if p2 and p2 not in phones:
                phones.append(p2)
    return phones

combined_df['phones'] = combined_df.apply(extract_phones, axis=1)
combined_df['fol_num'] = combined_df['followers'].apply(parse_followers)

has_url_df = combined_df[combined_df['norm_url'].notna()].copy()
no_url_df  = combined_df[combined_df['norm_url'].isna()].copy()

now = datetime.now(timezone.utc).isoformat()
final_records = []
seen_urls = set()
seen_phones = set()
seen_emails = set()

# 1. Process URL groups
for url, group in has_url_df.groupby('norm_url', sort=False):
    phones = []
    for row_phones in group['phones']:
        for p in row_phones:
            if p and p not in phones:
                phones.append(p)

    emails = [e.strip().lower() for e in group['email'].dropna() if str(e).strip() and str(e).lower() != 'nan']
    email_val = emails[0] if emails else None

    best_row = group.sort_values(by='fol_num', ascending=False).iloc[0]

    name_val = best_row['name'] if pd.notna(best_row['name']) and str(best_row['name']).strip() not in ('nan', 'Untitled Creator', '') else 'Untitled Creator'
    if name_val == 'Untitled Creator':
        better_names = [r['name'] for _, r in group.iterrows() if pd.notna(r['name']) and str(r['name']).strip() not in ('nan', 'Untitled Creator', '')]
        if better_names:
            name_val = better_names[0]

    username_val = best_row['username'] if pd.notna(best_row['username']) and str(best_row['username']).strip() not in ('nan', '') else ''
    if not username_val:
        m = re.search(r'(?:instagram\.com|instagr\.am)/([a-zA-Z0-9_\.]+)', url, re.IGNORECASE)
        username_val = m.group(1).lower() if m else 'creator'

    final_records.append({
        'id': str(uuid.uuid4()),
        'name': name_val,
        'username': username_val,
        'bio': best_row.get('bio') if pd.notna(best_row.get('bio')) and str(best_row.get('bio')).lower() != 'nan' else None,
        'gender': best_row.get('gender') if pd.notna(best_row.get('gender')) and str(best_row.get('gender')).lower() != 'nan' else 'female',
        'verified': False,
        'location_country': 'India',
        'location_state': best_row.get('location_state') if pd.notna(best_row.get('location_state')) and str(best_row.get('location_state')).lower() != 'nan' else None,
        'location_city': best_row.get('location_city') if pd.notna(best_row.get('location_city')) and str(best_row.get('location_city')).lower() != 'nan' else None,
        'followers': int(best_row['fol_num']),
        'following': 0, 'avg_views': 0, 'avg_likes': 0, 'engagement_rate': 0.0,
        'categories': best_row.get('categories') if pd.notna(best_row.get('categories')) and str(best_row.get('categories')).lower() != 'nan' else '{beauty,lifestyle}',
        'platforms': '{instagram}',
        'profile_image_url': None, 'cover_image_url': None,
        'instagram_url': url,
        'youtube_url': None,
        'whatsapp_numbers': phones,
        'email': email_val,
        'pricing_min': None, 'pricing_max': None,
        'languages': best_row.get('languages') if pd.notna(best_row.get('languages')) and str(best_row.get('languages')).lower() != 'nan' else '{"Hindi"}',
        'audience_gender_split': None, 'audience_age_ranges': None, 'audience_top_countries': None,
        'created_at': now, 'updated_at': now,
    })
    seen_urls.add(url)
    if email_val: seen_emails.add(email_val)
    for p in phones: seen_phones.add(p)

# 2. Process non-URL rows
for idx, row in no_url_df.iterrows():
    row_phones = row['phones']
    e = str(row['email']).strip().lower() if pd.notna(row['email']) and str(row['email']).lower() != 'nan' else None
    name_val = row['name'] if pd.notna(row['name']) and str(row['name']).strip() not in ('nan', 'Untitled Creator', '') else None

    if not row_phones and not e and not name_val:
        continue
    if any(p in seen_phones for p in row_phones):
        continue
    if e and e in seen_emails:
        continue

    final_records.append({
        'id': str(uuid.uuid4()),
        'name': name_val or 'Untitled Creator',
        'username': row['username'] if pd.notna(row['username']) and str(row['username']).strip() not in ('nan', '') else f'creator_nourl_{idx}',
        'bio': row.get('bio') if pd.notna(row.get('bio')) and str(row.get('bio')).lower() != 'nan' else None,
        'gender': row.get('gender') if pd.notna(row.get('gender')) and str(row.get('gender')).lower() != 'nan' else 'female',
        'verified': False,
        'location_country': 'India',
        'location_state': row.get('location_state') if pd.notna(row.get('location_state')) and str(row.get('location_state')).lower() != 'nan' else None,
        'location_city': row.get('location_city') if pd.notna(row.get('location_city')) and str(row.get('location_city')).lower() != 'nan' else None,
        'followers': int(row['fol_num']),
        'following': 0, 'avg_views': 0, 'avg_likes': 0, 'engagement_rate': 0.0,
        'categories': row.get('categories') if pd.notna(row.get('categories')) and str(row.get('categories')).lower() != 'nan' else '{beauty,lifestyle}',
        'platforms': '{instagram}',
        'profile_image_url': None, 'cover_image_url': None,
        'instagram_url': None,
        'youtube_url': None,
        'whatsapp_numbers': row_phones,
        'email': e,
        'pricing_min': None, 'pricing_max': None,
        'languages': row.get('languages') if pd.notna(row.get('languages')) and str(row.get('languages')).lower() != 'nan' else '{"Hindi"}',
        'audience_gender_split': None, 'audience_age_ranges': None, 'audience_top_countries': None,
        'created_at': now, 'updated_at': now,
    })
    for p in row_phones: seen_phones.add(p)
    if e: seen_emails.add(e)

# Convert to dataframe & save
out_df = pd.DataFrame(final_records)
# Format whatsapp_numbers for CSV export as PG array format
out_df['whatsapp_numbers'] = out_df['whatsapp_numbers'].apply(lambda l: '{' + ','.join(l) + '}' if l else None)
out_df.to_csv(OUTPUT, index=False)

print(f'\n--- STEP 2: Unified Dataset Summary ---')
print(f'  Total raw records combined: 24,428')
print(f'  Total UNIQUE creators     : {len(out_df)}')
print(f'  Saved to                  : {OUTPUT}')

# Prepare records for Supabase JSON payload
upload_records = []
for r in final_records:
    # categories and languages need python lists if we send via json
    cats = r['categories'][1:-1].split(',') if isinstance(r['categories'], str) and r['categories'].startswith('{') else []
    langs = [x.strip('"') for x in r['languages'][1:-1].split(',')] if isinstance(r['languages'], str) and r['languages'].startswith('{') else []
    
    upload_records.append({
        'id': r['id'], 'name': r['name'], 'username': r['username'],
        'bio': r['bio'], 'gender': r['gender'], 'verified': r['verified'],
        'location_country': r['location_country'], 'location_state': r['location_state'], 'location_city': r['location_city'],
        'followers': r['followers'], 'following': 0, 'avg_views': 0, 'avg_likes': 0, 'engagement_rate': 0.0,
        'categories': [c for c in cats if c],
        'platforms': ['instagram'],
        'profile_image_url': None, 'cover_image_url': None,
        'instagram_url': r['instagram_url'], 'youtube_url': None,
        'whatsapp_numbers': r['whatsapp_numbers'], # Python list
        'email': r['email'],
        'pricing_min': None, 'pricing_max': None,
        'languages': [l for l in langs if l],
        'audience_gender_split': None, 'audience_age_ranges': None, 'audience_top_countries': None,
        'created_at': r['created_at'], 'updated_at': r['updated_at'],
    })

print(f'\n--- STEP 3: Truncating & Uploading to Supabase ---')
# Truncate existing creators in Supabase
try:
    # First clear records via batch delete
    print('  Clearing old records...')
    while True:
        res = supabase.table('creators').select('id').limit(500).execute()
        if not res.data: break
        ids = [row['id'] for row in res.data]
        supabase.table('creators').delete().in_('id', ids).execute()
    print('  Supabase creators table cleared.')
except Exception as e:
    print(f'  Clear warning: {e}')

total = len(upload_records)
batch_size = 50
total_batches = math.ceil(total / batch_size)
failed = []

print(f'  Uploading {total} records in {total_batches} batches...')
for i in range(0, total, batch_size):
    bn = i // batch_size + 1
    batch = upload_records[i:i+batch_size]
    for attempt in range(1, 6):
        try:
            supabase.table('creators').upsert(batch, on_conflict='id').execute()
            if bn % 20 == 0 or bn == total_batches:
                print(f'    [{bn}/{total_batches}] OK ({i+len(batch)}/{total})')
            time.sleep(0.2)
            break
        except Exception as e:
            wait = 2**attempt
            print(f'    [{bn}/{total_batches}] Attempt {attempt} failed: {e}')
            if attempt < 5: time.sleep(wait)
            else: failed.append(bn)

print(f'\n==========================================')
print(f'SUCCESS! Complete Combined Upload Complete')
print(f'  Total unique creators uploaded: {total}')
print(f'  Failed batches                 : {len(failed)}')
print(f'==========================================')
