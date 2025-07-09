from dotenv import load_dotenv
import requests
import os
# Load environment variables from .env file
load_dotenv()

# Supabase configuration from .env file
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ROLE_KEY = os.getenv('SUPABASE_KEY')
print(SUPABASE_ROLE_KEY)
response = requests.post(
    f"{SUPABASE_URL}/rest/v1/rpc/execute_sql",
    headers={
      "apikey": SUPABASE_ROLE_KEY,
      "Authorization": f"Bearer {SUPABASE_ROLE_KEY}",
      "Content-Type": "application/json"
    },
    json={"query": "SELECT * FROM public.sports;"}
)
print(response.status_code, response.json())
