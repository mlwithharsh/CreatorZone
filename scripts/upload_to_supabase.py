import pandas as pd
import math
import os
import re
import time
from dotenv import load_dotenv
from supabase import create_client

def parse_pg_array(val):
    if not isinstance(val, str) or not val.startswith('{') or not val.endswith('}'):
        return []
    content = val[1:-1]
    if not content:
        return []
    parts = []
    for part in re.findall(r'"([^"]*)"|([^,]+)', content):
        item = part[0] if part[0] else part[1].strip()
        if item:
            parts.append(item)
    return parts

def to_int(val):
    if val is None:
        return None
    try:
        if isinstance(val, float) and math.isnan(val):
            return None
        return int(float(val))
    except (ValueError, TypeError):
        return None

def to_float(val):
    if val is None:
        return None
    try:
        if isinstance(val, float) and math.isnan(val):
            return None
        return float(val)
    except (ValueError, TypeError):
        return None

def safe_str(val):
    if val is None:
        return None
    try:
        if isinstance(val, float) and math.isnan(val):
            return None
        s = str(val).strip()
        return s if s and s != 'nan' else None
    except Exception:
        return None

def main():
    load_dotenv()

    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    # Use service role key to bypass RLS for bulk insert
    supabase_key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_KEY")
    )

    if not supabase_url or not supabase_key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env")
        return

    print(f"Connecting to: {supabase_url}")
    supabase = create_client(supabase_url, supabase_key)

    csv_path = r"d:\CreaterZone\Influencer_All_Data_Structured.csv"
    print(f"Reading: {csv_path}")
    df = pd.read_csv(csv_path, dtype=str)   # Read everything as string to avoid float NaN issues

    records = []
    print(f"Parsing {len(df)} rows...")

    for _, row in df.iterrows():
        d = row.to_dict()

        record = {
            'id':                   safe_str(d.get('id')),
            'name':                 safe_str(d.get('name')) or 'Untitled Creator',
            'username':             safe_str(d.get('username')) or 'unknown',
            'bio':                  safe_str(d.get('bio')),
            'gender':               safe_str(d.get('gender')) or 'unspecified',
            'verified':             False,
            'location_country':     safe_str(d.get('location_country')) or 'India',
            'location_state':       safe_str(d.get('location_state')),
            'location_city':        safe_str(d.get('location_city')),
            'followers':            to_int(d.get('followers')) or 0,
            'following':            to_int(d.get('following')) or 0,
            'avg_views':            to_int(d.get('avg_views')) or 0,
            'avg_likes':            to_int(d.get('avg_likes')) or 0,
            'engagement_rate':      to_float(d.get('engagement_rate')) or 0.0,
            'categories':           parse_pg_array(d.get('categories') or ''),
            'platforms':            parse_pg_array(d.get('platforms') or ''),
            'profile_image_url':    safe_str(d.get('profile_image_url')),
            'cover_image_url':      safe_str(d.get('cover_image_url')),
            'instagram_url':        safe_str(d.get('instagram_url')),
            'youtube_url':          safe_str(d.get('youtube_url')),
            'whatsapp_number':      safe_str(d.get('whatsapp_number')),
            'email':                safe_str(d.get('email')),
            'pricing_min':          to_int(d.get('pricing_min')),
            'pricing_max':          to_int(d.get('pricing_max')),
            'languages':            parse_pg_array(d.get('languages') or ''),
            'audience_gender_split':None,
            'audience_age_ranges':  None,
            'audience_top_countries':None,
            'created_at':           safe_str(d.get('created_at')),
            'updated_at':           safe_str(d.get('updated_at')),
        }
        records.append(record)

    total = len(records)
    batch_size = 50          # Small batches to avoid HTTP/2 stream resets
    total_batches = math.ceil(total / batch_size)
    failed_batches = []

    print(f"Uploading {total} records in {total_batches} batches of {batch_size}...\n")

    for i in range(0, total, batch_size):
        batch_num = i // batch_size + 1
        batch = records[i:i + batch_size]

        for attempt in range(1, 6):            # 5 attempts per batch
            try:
                supabase.table("creators").upsert(batch, on_conflict="id").execute()
                print(f"  [{batch_num}/{total_batches}] OK  ({i + len(batch)}/{total})")
                time.sleep(0.3)                # Small pause to be kind to the API
                break
            except Exception as e:
                wait = 2 ** attempt            # 2, 4, 8, 16, 32 seconds
                print(f"  [{batch_num}/{total_batches}] Attempt {attempt} failed: {e}")
                if attempt < 5:
                    print(f"    Retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    print(f"  [{batch_num}/{total_batches}] SKIPPED after 5 attempts.")
                    failed_batches.append(batch_num)

    print(f"\n--- Upload complete ---")
    print(f"Total records attempted : {total}")
    print(f"Successful batches       : {total_batches - len(failed_batches)}/{total_batches}")
    if failed_batches:
        print(f"Failed batch numbers     : {failed_batches}")
    else:
        print("All batches uploaded successfully!")

if __name__ == "__main__":
    main()
