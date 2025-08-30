from fastapi import APIRouter
from app.core.supabase_client import get_supabase_client

router = APIRouter()


@router.get("/db/health")
async def db_health():
    try:
        sb = get_supabase_client()
        # documents 테이블 존재/접근 여부 확인 (없으면 예외 메시지 반환)
        try:
            res = sb.table("documents").select("id", count="exact").limit(0).execute()
            return {"ok": True, "table": "documents", "count": res.count}
        except Exception as e:
            return {"ok": True, "warning": str(e)}
    except Exception as e:
        return {"ok": False, "error": str(e)}


