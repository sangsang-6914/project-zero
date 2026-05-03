# 마케터의서재

> 검색해도 나오지 않는 마케팅의 진짜 답

현직 마케터가 직접 운영하는 1인 지식 커머스 플랫폼. 퍼포먼스·콘텐츠·IT서비스 홍보 실무 글과 영상을 건별로 판매합니다.

**프로덕션 URL**: https://marketerlibrary.vercel.app

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 백엔드 / DB / Auth | Supabase (PostgreSQL + RLS + Auth) |
| 스토리지 | Supabase Storage |
| 에디터 | Tiptap v2 |
| 결제 | 카카오페이 단건 결제 REST API |
| 배포 | Vercel |
| 소셜 로그인 | Kakao OAuth, Google OAuth |

---

## 주요 기능

**사용자**
- 카카오 / Google 소셜 로그인
- 콘텐츠 목록 조회 및 태그 필터링
- 카카오페이로 콘텐츠 단건 결제
- 구매한 글(Tiptap 렌더링) / 영상(YouTube embed) / PDF 열람
- 좋아요, 댓글 / 대댓글
- 구매 내역 조회
- 커뮤니티 Q&A 작성

**관리자** (`/admin`)
- 콘텐츠 작성·수정·삭제 (Tiptap 에디터, 썸네일·PDF 업로드)
- 발행 / 임시저장 관리
- 커뮤니티 Q&A 답변

---

## 로컬 개발 환경 설정

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 채웁니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret>

KAKAO_PAY_SECRET_KEY=<kakao-pay-admin-key>
KAKAO_PAY_CID=TC0ONETIME

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Supabase DB 스키마 실행

Supabase 대시보드 SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

---

## 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx                  # 랜딩 (최신 글 + 인기 영상)
│   ├── contents/
│   │   ├── page.tsx              # 콘텐츠 목록 + 태그 필터
│   │   └── [id]/
│   │       ├── page.tsx          # 콘텐츠 상세 (미구매 / Paywall)
│   │       └── view/page.tsx     # 콘텐츠 열람 (구매 후)
│   ├── community/page.tsx        # 커뮤니티 Q&A
│   ├── my/page.tsx               # 구매 내역
│   ├── admin/                    # 관리자 백오피스
│   ├── api/payment/              # 카카오페이 결제 API
│   └── auth/callback/            # OAuth 콜백
├── components/
│   ├── layout/                   # GNB, Footer
│   ├── content/                  # ContentCard, ContentViewer, LikeButton, CommentSection
│   ├── editor/                   # TiptapEditor
│   └── payment/                  # KakaoPayButton
├── lib/
│   ├── supabase/                 # client.ts, server.ts
│   └── kakao/                    # payments.ts
├── types/index.ts
└── middleware.ts                 # 인증 + 관리자 role 체크
supabase/
└── schema.sql                    # DB 스키마 + RLS + RPC
```

---

## 배포

`main` 브랜치 푸시 시 Vercel에 자동 배포됩니다.

```bash
git push origin main
```
