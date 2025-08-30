import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None  # type: ignore

_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")


class LocalEmbeddings:
    def __init__(self):
        if SentenceTransformer is None:
            raise RuntimeError("sentence-transformers 설치 필요")
        self.model = SentenceTransformer(_MODEL)

    def embed(self, texts: List[str]) -> List[List[float]]:
        return [list(v) for v in self.model.encode(texts, normalize_embeddings=True)]


def get_default_embedder() -> LocalEmbeddings:
    return LocalEmbeddings()


