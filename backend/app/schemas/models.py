from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    query: str
    context: Optional[str] = None

class Context(BaseModel):
    content: str
    metadata: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    contexts: List[Context]

class IngestRequest(BaseModel):
    path: str

class IngestResponse(BaseModel):
    indexed: int

class SearchResponse(BaseModel):
    results: List[Context]

class PersonaRequest(BaseModel):
    query: str

class PersonaResponse(BaseModel):
    answer: str

class PersonaGetResponse(BaseModel):
    system: str
    style: str

class PersonaPutRequest(BaseModel):
    system: Optional[str] = None
    style: Optional[str] = None

class OkResponse(BaseModel):
    ok: bool

class FeedbackRequest(BaseModel):
    feedback: str

class FeedbackResponse(BaseModel):
    message: str

class CrowdingRequest(BaseModel):
    location: str

class CrowdingResponse(BaseModel):
    crowding_level: str
    message: str
