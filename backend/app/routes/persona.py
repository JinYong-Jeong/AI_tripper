from fastapi import APIRouter
from app.schemas.models import PersonaGetResponse, PersonaPutRequest, OkResponse
from app.services.rag import prompt as prompt_mod

router = APIRouter()


@router.get("/persona", response_model=PersonaGetResponse)
async def get_persona():
    return PersonaGetResponse(system=prompt_mod.SYSTEM_PROMPT, style=prompt_mod.ANSWER_STYLE)


@router.put("/persona", response_model=OkResponse)
async def put_persona(body: PersonaPutRequest):
    if body.system:
        prompt_mod.SYSTEM_PROMPT = body.system  # type: ignore
    if body.style is not None:
        prompt_mod.ANSWER_STYLE = body.style  # type: ignore
    return OkResponse(ok=True)

