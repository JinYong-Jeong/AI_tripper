from fastapi import APIRouter
from app.schemas.models import FeedbackRequest, OkResponse

router = APIRouter()


@router.post("/feedback", response_model=OkResponse)
async def feedback(body: FeedbackRequest):
    # TODO: DB 저장(Supabase 연동 가능)
    return OkResponse(ok=True)

