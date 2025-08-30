import os
from typing import Optional
from supabase import create_client, Client

_client: Optional[Client] = None


def _load_env_vars():
    """환경변수를 안전하게 로드하는 함수"""
    env_vars = {}
    
    if os.path.exists('.env'):
        print("DEBUG: .env file found, reading...")
        with open('.env', 'r', encoding='utf-8-sig') as f:  # utf-8-sig로 BOM 자동 제거
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                print(f"DEBUG: Line {line_num}: '{line}'")
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()
                    env_vars[key] = value
                    print(f"DEBUG: Parsed - {key} = {value[:20] if len(value) > 20 else value}")
                elif line:
                    print(f"DEBUG: Skipped line {line_num}: '{line}'")
    
    print(f"DEBUG: Final env_vars keys: {list(env_vars.keys())}")
    return env_vars


def get_supabase_client() -> Client:
    global _client
    if _client is not None:
        return _client

    # 환경변수 로드
    env_vars = _load_env_vars()
    
    # 필요한 값들 추출
    url = env_vars.get('SUPABASE_URL')
    service_key = env_vars.get('SUPABASE_SERVICE_KEY')
    anon_key = env_vars.get('SUPABASE_ANON_KEY')
    
    print(f"DEBUG: Loaded from .env - SUPABASE_URL = {url}")
    print(f"DEBUG: Loaded from .env - SUPABASE_SERVICE_KEY = {service_key[:20] if service_key else 'None'}...")
    print(f"DEBUG: Loaded from .env - SUPABASE_ANON_KEY = {anon_key[:20] if anon_key else 'None'}...")
    
    # 우선 서비스 키 사용, 없으면 ANON 키 사용
    key = service_key or anon_key

    if not url or not key:
        raise RuntimeError(
            f"Missing Supabase credentials. Set SUPABASE_URL and one of SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY in .env\n"
            f"Current values: URL={url}, SERVICE_KEY={'SET' if service_key else 'MISSING'}, ANON_KEY={'SET' if anon_key else 'MISSING'}"
        )

    _client = create_client(url, key)
    return _client
