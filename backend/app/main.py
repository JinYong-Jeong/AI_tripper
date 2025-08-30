from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import health, chat, ingest, search, persona, feedback, db, crowding

app = FastAPI(title="Tourism AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(persona.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(db.router, prefix="/api")
app.include_router(crowding.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Tourism AI Backend running"}
