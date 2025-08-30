from fastapi import APIRouter, HTTPException
from app.schemas.models import IngestRequest, IngestResponse
from app.services.rag.ingest import read_text_files
from app.services.rag.vectorstore import add_texts
import uuid
from app.services.ingestors.kto_api import ingest_kto

router = APIRouter()


@router.post("/ingest", response_model=IngestResponse)
async def ingest(req: IngestRequest):
    if not req.path:
        raise HTTPException(status_code=400, detail="path is required")
    texts, metas, _ids = read_text_files(req.path)
    if not texts:
        return IngestResponse(indexed=0)
    ids = [str(uuid.uuid4()) for _ in texts]
    add_texts(texts, metas, ids)
    return IngestResponse(indexed=len(texts))


@router.post("/ingest/kto", response_model=IngestResponse)
async def ingest_kto_api():
    count = ingest_kto(num_rows=100)
    return IngestResponse(indexed=count)

