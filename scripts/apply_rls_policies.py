import os
import sys
import httpx
from dotenv import load_dotenv
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv(".env.local")

url = os.getenv("SUPABASE_URL")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
anon_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
project_ref = "pfpvfazrusjjigibnzva"

# Correct Supabase SQL API endpoint
sql_url = f"https://{project_ref}.supabase.co/rest/v1/rpc/exec_sql"

# Full SQL block - run all policies in one shot
full_sql = """
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read creators" ON creators;
CREATE POLICY "Public read creators" ON creators FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE recent_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read recent_posts" ON recent_posts;
CREATE POLICY "Public read recent_posts" ON recent_posts FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read favorites" ON favorites;
CREATE POLICY "Public read favorites" ON favorites FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Users manage own favorites" ON favorites;
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own history" ON search_history;
CREATE POLICY "Users manage own history" ON search_history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
"""

headers = {
    "apikey": service_key,
    "Authorization": f"Bearer {service_key}",
    "Content-Type": "application/json",
}

# Try multiple possible SQL endpoints
endpoints = [
    f"https://{project_ref}.supabase.co/rest/v1/rpc/exec_sql",
    f"https://api.supabase.com/v1/projects/{project_ref}/database/query",
]

print("Attempting to apply RLS policies via Supabase SQL API...")
success = False

for endpoint in endpoints:
    try:
        r = httpx.post(
            endpoint,
            headers=headers,
            json={"query": full_sql},
            timeout=15
        )
        print(f"Endpoint: {endpoint}")
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:200]}")
        if r.status_code in (200, 201, 204):
            success = True
            break
    except Exception as e:
        print(f"Error with {endpoint}: {e}")

if not success:
    print("\nDirect SQL API not available. Generating SQL for manual execution in Supabase Dashboard...\n")
    print("=" * 70)
    print("PASTE THIS SQL INTO Supabase Dashboard > SQL Editor > New Query:")
    print("=" * 70)
    print(full_sql)
    print("=" * 70)

# Test anon access
print("\nTesting anon key access...")
sb_anon = create_client(url, anon_key)
try:
    res = sb_anon.rpc("search_creators", {"p_page": 1, "p_page_size": 3}).execute()
    print(f"Anon RPC: {len(res.data)} rows")
    if res.data:
        for row in res.data[:2]:
            print(f"  - {row.get('name')} | {row.get('followers')} followers")
    else:
        print("  Still 0 rows - RLS policies need to be applied manually in Supabase Dashboard")
except Exception as e:
    print(f"Anon RPC failed: {e}")
