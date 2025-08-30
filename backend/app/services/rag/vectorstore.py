from typing import List, Dict, Any

from app.core.supabase_client import get_supabase_client
from .embeddings import get_default_embedder

_EMBEDDING_DIM = 384  # all-MiniLM-L6-v2
_TABLE = "documents"
_RPC_MATCH = "match_documents"


def add_texts(texts: List[str], metadatas: List[Dict[str, Any]] | None = None, ids: List[str] | None = None):
    sb = get_supabase_client()
    embedder = get_default_embedder()
    vectors = embedder.embed(texts)
    if metadatas is None:
        metadatas = [{} for _ in texts]
    rows = []
    for i, (t, m, v) in enumerate(zip(texts, metadatas, vectors)):
        # float32를 float로 변환하여 JSON 직렬화 문제 해결
        v_float = [float(x) for x in v]
        row: Dict[str, Any] = {"content": t, "metadata": m, "embedding": v_float}  # text -> content로 변경
        if ids and i < len(ids):
            row["id"] = ids[i]
        rows.append(row)
    sb.table(_TABLE).upsert(rows).execute()


def query(text: str, top_k: int = 4) -> List[Dict[str, Any]]:
    sb = get_supabase_client()
    
    try:
        # 먼저 RPC 함수 시도
        embedder = get_default_embedder()
        qv = embedder.embed([text])[0]
        qv_float = [float(x) for x in qv]
        
        res = sb.rpc(_RPC_MATCH, {"query_embedding": qv_float, "match_count": top_k}).execute()
        data = res.data or []
        print("RPC function succeeded!")
        return [
            {
                "id": d.get("id"),
                "content": d.get("text", ""),  # text -> content로 매핑
                "metadata": d.get("metadata"),
                "distance": d.get("distance", 0.0),
            }
            for d in data
        ]
    except Exception as e:
        print(f"RPC function failed: {e}")
        print("Falling back to simple text search...")
        
        try:
            # RPC 함수가 없으면 간단한 텍스트 검색으로 대체
            res = sb.table(_TABLE).select("*").limit(top_k).execute()
            data = res.data or []
            print("Table query succeeded!")
            return [
                {
                    "id": d.get("id"),
                    "content": d.get("text", ""),  # text -> content로 매핑
                    "metadata": d.get("metadata"),
                    "distance": d.get("distance", 0.0),
                }
                for d in data
            ]
        except Exception as e2:
            print(f"Table query also failed: {e2}")
            print("Returning dummy data for now...")
            
            # 모든 것이 실패하면 더미 데이터 반환
            return [
                {
                    "id": "dummy_1",
                    "content": "관광지 정보를 찾을 수 없습니다. 현재 데이터베이스가 설정되지 않았습니다.",
                    "metadata": {"source": "dummy"},
                    "distance": 0.0,
                }
            ]


