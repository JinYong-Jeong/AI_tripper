from fastapi import APIRouter
from app.schemas.models import ChatRequest, ChatResponse, Context
from app.services.rag.pipeline import generate_answer

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest) -> ChatResponse:
    res = generate_answer(body.query)
    return ChatResponse(answer=res["answer"], contexts=[Context(**c) for c in res["contexts"]])
