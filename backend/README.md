# 관광 AI 백엔드

대전 지역 관광 정보를 제공하는 AI 챗봇 "까우니"의 백엔드 서버입니다.

## 🚀 주요 기능

- **RAG (Retrieval-Augmented Generation) 시스템**: 벡터 데이터베이스를 활용한 지능형 검색
- **까우니 페르소나**: 대전 지역 관광 도우미 캐릭터의 일관된 정체성 유지
- **가드레일 시스템**: 관광 관련 질문만 답변하여 안전성 확보
- **실시간 API 연동**: KTO 관광 API를 통한 최신 정보 제공

## 🏗️ 기술 스택

- **Framework**: FastAPI
- **Vector Database**: Supabase (pgvector)
- **LLM**: OpenAI GPT-4
- **Embeddings**: Sentence Transformers
- **Language**: Python 3.11+

## 📋 설치 및 실행

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 환경변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요:
```bash
cp .env.example .env
# .env 파일을 편집하여 실제 API 키를 입력
```

### 3. 서버 실행
```bash
uvicorn app.main:app --reload
```

## 🔧 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 | ✅ |
| `OPENAI_MODEL` | 사용할 OpenAI 모델 | ✅ |
| `SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase 익명 키 | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase 서비스 키 | ✅ |
| `KTO_SERVICE_KEY` | KTO 관광 API 키 | ✅ |

## 📁 프로젝트 구조

```
backend/
├── app/
│   ├── core/           # 핵심 설정 (Supabase 클라이언트 등)
│   ├── routes/         # API 엔드포인트
│   ├── schemas/        # Pydantic 모델
│   └── services/       # 비즈니스 로직
│       └── rag/        # RAG 시스템
│           ├── pipeline.py      # RAG 파이프라인
│           ├── prompt.py        # 프롬프트 엔지니어링
│           ├── vectorstore.py   # 벡터 저장소
│           └── embeddings.py    # 임베딩 처리
├── requirements.txt    # Python 의존성
└── README.md          # 프로젝트 문서
```

## 🎯 API 엔드포인트

- `POST /api/chat`: 챗봇 대화
- `POST /api/ingest`: 문서 수집
- `GET /api/search`: 정보 검색
- `POST /api/crowding`: 혼잡도 정보

## 🔒 보안

- `.env` 파일은 Git에 업로드되지 않습니다
- API 키는 환경변수로 관리됩니다
- 가드레일을 통한 안전한 응답 생성

## 📝 개발 상태

**현재 단계**: 프로토타입 완성
- ✅ RAG 시스템 구조 완성
- ✅ 까우니 페르소나 구현
- ✅ 가드레일 시스템 구현
- ⏳ Supabase DB 스키마 설정 필요
- ⏳ KTO API 연동 구현 필요

## 🤝 기여

이 프로젝트는 관광 AI 공모전을 위해 개발되었습니다.
