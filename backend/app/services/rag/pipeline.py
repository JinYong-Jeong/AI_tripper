import os
from typing import Dict
from dotenv import load_dotenv

from . import vectorstore
from .prompt import format_prompt, create_fallback_response

load_dotenv()


def call_llm(prompt: str) -> str:
    """OpenAI API를 통한 LLM 호출"""
    import openai
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    if not api_key:
        return "OPENAI_API_KEY가 필요합니다"
    
    try:
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "당신은 대전 지역 관광 도우미 까우니입니다. 항상 까우니의 페르소나를 유지하고, 관광 관련 질문에만 답변하세요."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=512
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"OpenAI API 호출 오류: {e}"


def generate_answer(query: str) -> Dict:
    """RAG 파이프라인을 통한 답변 생성"""
    
    # 1단계: 가드레일 체크 (관광 관련 질문인지 확인)
    if not _is_tourism_related(query):
        fallback_response = create_fallback_response(query)
        return {
            "answer": fallback_response,
            "contexts": [],
            "source": "guardrail",
            "confidence": "high"
        }
    
    # 2단계: 벡터 검색으로 관련 컨텍스트 찾기
    docs = vectorstore.query(query, top_k=4)
    
    # 3단계: 프롬프트 포맷팅 및 LLM 호출
    if docs and docs[0].get('id') != 'dummy_1':  # 실제 데이터가 있는 경우
        prompt = format_prompt(query, docs)
        answer = call_llm(prompt)
        source = "rag"
        confidence = "high"
    else:
        # 더미 데이터인 경우 기본 응답
        answer = _generate_basic_response(query)
        source = "fallback"
        confidence = "low"
    
    return {
        "answer": answer,
        "contexts": docs,
        "source": source,
        "confidence": confidence
    }


def _is_tourism_related(query: str) -> bool:
    """질문이 관광 관련인지 확인하는 함수"""
    tourism_keywords = [
        '관광', '여행', '대전', '맛집', '숙박', '교통', '축제', '박물관', 
        '공원', '쇼핑', '문화', '역사', '자연', '레저', '힐링', '과학관',
        '시장', '카페', '레스토랑', '호텔', '펜션', '캠핑', '등산', '수영',
        '스키', '골프', '낚시', '피크닉', '산책', '드라이브'
    ]
    
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in tourism_keywords)


def _generate_basic_response(query: str) -> str:
    """기본 응답 생성 (데이터가 없는 경우)"""
    return (
        "안녕하세요! 까우니예요 🐦\n\n"
        "질문해주신 내용에 대해 정확한 정보를 찾아보고 있어요. "
        "현재 데이터베이스에 해당 정보가 없어서 정확한 답변을 드리기 어려워요.\n\n"
        "혹시 다른 관광 관련 질문이 있으시거나, "
        "더 구체적으로 궁금한 점이 있으시면 말씀해주세요!\n\n"
        "예시 질문:\n"
        "- 대전에서 맛있는 맛집 추천해줘\n"
        "- 대전과학관은 언제 가는 게 좋을까?\n"
        "- 대전 근처에 가볼만한 곳 있어?"
    )


