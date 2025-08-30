from fastapi import APIRouter, Query
from app.schemas.models import SearchResponse, Context
from app.services.rag.vectorstore import query as vs_query

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
async def search(q: str = Query(...), k: int = Query(4, ge=1, le=20)):
    docs = vs_query(q, top_k=k)
    return SearchResponse(results=[Context(**d) for d in docs])

