import os
from typing import List, Dict, Any
import requests
from dotenv import load_dotenv

from app.services.rag.vectorstore import add_texts

load_dotenv()


KTO_BASE_1 = "http://apis.data.go.kr/B551011/LocgoHubTarService1/areaBasedList1"
KTO_BASE_2 = "http://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1"


def _fetch_kto(url: str, page: int = 1, num_rows: int = 100) -> List[Dict[str, Any]]:
    key = os.getenv("KTO_SERVICE_KEY")
    if not key:
        raise RuntimeError("KTO_SERVICE_KEY가 .env에 필요합니다")
    params = {
        "serviceKey": key,
        "numOfRows": str(num_rows),
        "pageNo": str(page),
        "MobileOS": "ETC",
        "MobileApp": "Kauni",
        "_type": "json",
    }
    r = requests.get(url, params=params, timeout=60)
    r.raise_for_status()
    data = r.json()
    # 방어적으로 items 파싱
    try:
        items = (
            data.get("response", {})
            .get("body", {})
            .get("items", {})
            .get("item", [])
        )
        if isinstance(items, dict):
            items = [items]
        if not isinstance(items, list):
            items = []
    except Exception:
        items = []
    return items


def _item_to_doc(item: Dict[str, Any]) -> Dict[str, Any]:
    # 가능한 필드를 모아 텍스트 구성 (필드명이 다를 수 있어 최대한 유연하게)
    title = item.get("title") or item.get("name") or item.get("facltNm") or ""
    addr = item.get("addr1") or item.get("addr") or item.get("address") or ""
    overview = (
        item.get("overview")
        or item.get("descr")
        or item.get("description")
        or item.get("intro")
        or ""
    )
    tel = item.get("tel") or item.get("phone") or ""
    cat = item.get("cat3") or item.get("cat2") or item.get("cat1") or ""
    text = "\n".join([
        f"제목: {title}" if title else "",
        f"주소: {addr}" if addr else "",
        f"연락처: {tel}" if tel else "",
        f"분류: {cat}" if cat else "",
        overview,
    ]).strip()
    meta = {k: v for k, v in item.items() if k not in {"overview"}}
    meta["source"] = "kto"
    return {"text": text, "metadata": meta}


def ingest_kto(num_rows: int = 100) -> int:
    items1 = _fetch_kto(KTO_BASE_1, page=1, num_rows=num_rows)
    items2 = _fetch_kto(KTO_BASE_2, page=1, num_rows=num_rows)
    all_items = items1 + items2
    if not all_items:
        return 0
    docs = [_item_to_doc(it) for it in all_items]
    texts = [d["text"] for d in docs]
    metas = [d["metadata"] for d in docs]
    add_texts(texts, metas, ids=None)
    return len(docs)


