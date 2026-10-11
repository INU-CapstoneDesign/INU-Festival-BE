# 인수인계 문서

> 2026-10-10, FE 레포(`INU-Festival-FE`)에서 Claude와 나눈 대화를 정리한 문서. 새 세션은 이 문서에서 이어간다.

## 1. 배경

- 프론트(`INU-Festival-FE`)는 살아 있지만 백엔드가 동작하지 않는다. 기존 백엔드는 EC2(`3.35.68.147:8080`)였다.
- 처음에는 MSW(목 서버)도 고려했지만, **실제 운영이 목적**이라 진짜 백엔드를 만들기로 했다.
- 2024년 백엔드 레포를 확인한 결과 Node.js 기반이었다. 사용자는 백엔드 경험이 없으므로 **재활용하지 않고 TypeScript로 새로 작성**하기로 했다. 기존 레포는 설계도로 참고한다.
  - 새로 쓰는 이유: 운영 중에 직접 고칠 수 있으려면 코드를 이해해야 하고, 프론트와 같은 TS를 쓸 수 있고, 규모가 작고(API 약 20개) 축제(5월 예상)까지 시간이 충분하고, 기존 코드는 손볼 곳이 많다.
- 레포 정리: 기존 레포는 `INU-Festival-BE-2024`로 이름을 바꿨고, 새 레포는 `INU-CapstoneDesign/INU-Festival-BE`(Public)다.
  - TODO(사용자): `INU-Festival-BE-2024`를 Archive로 설정하기

## 2. 2024 백엔드 분석 (`INU-Festival-BE-2024`)

**스택:** Node 21, JavaScript(CommonJS), Express 4, MySQL 8 + Sequelize, Socket.io 4, EJS 관리자 페이지, multer(이미지를 로컬에 저장), mecab-ya(인기 키워드), node-cron, xlsx, Docker Compose, AWS

**모델:** User, Booth, BoothDay, BoothImg, Comment, Keywords, Notice, NoticeImg, Oneline(방명록), Perform

**API**

| Method | 경로 | 비고 |
|---|---|---|
| POST | `/user/lms` | 로그인. 응답 `{ accessToken }` |
| GET | `/user/me` | 응답 `{ id, name }` (둘 다 studentId) |
| GET | `/user/logout` | |
| GET | `/booth/all` | `{ booths }` |
| GET | `/booth/ranking` | `{ booths }`. ⚠️ 프론트는 `/booth/top`을 호출 중 |
| GET | `/booth/category` | 프론트 미사용 |
| GET | `/booth/:id` | `{ booth }` |
| GET | `/booth/:id/comment` | `{ boothComments }` |
| POST | `/booth/comment/:id` | 인증 필요 |
| PUT/DELETE | `/booth/:bid/comment/:cid` | 프론트 미사용 |
| PUT | `/booth/liked/:id` | body `{ likeCount }` |
| GET | `/timetable` | `{ performs }`. 프론트도 `performs`로 수정됨 (FE 커밋 전) |
| GET | `/notice` | `{ notices }` |
| GET / POST | `/sentence` | 방명록. GET은 `{ shouts }` |
| GET | `/keywords` | 인기 키워드 |
| POST | `/api` | 내부용 앱센터 인증 |
| * | `/admin/booth...`, `/manage/...` | 관리자 (EJS, 이미지 업로드) |
| WS | 클라이언트 `emit("message")` → 서버 `emit("update")` | 방명록 실시간 |

**로그인 방식 (재사용 가능한 핵심):** 학번과 비밀번호를 `https://api.inuappcenter.kr/account/status`에 Basic Auth로 보내고, 응답이 `undergraduate: true`이면 재학생으로 보고 토큰을 발급한다.
- TODO: 이 앱센터 API가 **지금도 동작하는지** 확인 (가장 먼저 확인할 것). 동작하지 않으면 대안으로 학교 이메일 인증, 카카오 로그인, 익명 중에서 정한다.
- 포털 비밀번호가 우리 서버를 거치므로 비밀번호를 로그에 남기지 않고, HTTPS를 반드시 적용한다.

**새로 만들 때 반복하지 말 것 (2024 코드의 문제)**
1. `login.js`에 하드코딩된 우회 계정과 공통 비밀번호가 있었다
2. DB 비밀번호가 `docker-compose.yml`과 `config.json`에 커밋되어 있었다
3. 소켓이 받은 데이터를 검증 없이 `broadcast`했다. 새 버전은 저장을 `POST /sentence`(인증 필요)에서 하고, 소켓은 저장된 결과를 브로드캐스트만 한다
4. CORS가 `*`로 전체 허용이었다. 새 버전은 프론트 도메인만 허용한다
5. 축제 날짜(`2024-05-07~09`, 화·수·목)가 코드에 하드코딩되어 있었다. 새 버전은 환경변수나 DB 설정으로 뺀다
6. 좋아요가 클라이언트가 보낸 숫자를 그대로 믿는 구조였다. 새 버전은 증가분만 반영하고 상한을 둔다
7. ID 타입이 섞여 있었다. 새 버전은 DB에서 Int로 통일하고, 프론트가 문자열을 기대하는 곳은 응답할 때 변환한다

## 3. 운영을 위해 필요한 것

- PostgreSQL (관리형, 자동 백업)
- 관리자 기능: 공지, 부스, 공연 CRUD와 부적절한 글 삭제. 범위는 아직 미정 (API만 만들지, 관리자 화면까지 만들지)
- 이미지: S3나 R2 같은 외부 스토리지
- 남용 방지: 방명록, 댓글, 좋아요에 rate limit과 금칙어 필터
- 보안: helmet, CORS 제한, 입력 검증(zod), HTTPS
- 장애 대응: Sentry, 헬스체크 엔드포인트
- 트래픽은 축제 기간에 집중되므로 서버 1대 + 관리형 DB로 충분하다. 소켓을 여러 서버로 늘릴 때만 Redis adapter를 붙인다

## 4. 배포 구조

```
브라우저 ─┬─ 프론트 (Vercel)
          └─ https://api.<도메인>  →  Railway (Express + Socket.io)  →  Railway Postgres
```
- 프론트는 백엔드 도메인을 **직접** 호출한다. Vercel rewrite로 프록시하면 WebSocket이 통과하지 못하기 때문이다. CORS는 서버에서 처리한다.
- Railway 설정: Build `npm ci && npx prisma generate && npm run build`, Start `npx prisma migrate deploy && npm start`. 환경변수는 `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
- 조직 레포라서 Railway GitHub App을 설치하려면 **조직 Owner의 승인**이 필요하다

## 5. 프론트(FE 레포)에서 할 일

FE는 `refactor/api-service` 브랜치에서 API 호출을 `ApiService` 하나로 모으는 리팩터링을 진행 중이다 (`docs/API_REFACTOR_PLAN.md`, `docs/API_SPECIFICATION.md`). FE 작업에서는 사용자가 코드를 직접 작성하고 Claude는 안내만 한다.

- [ ] `ApiService.ts`의 `/booth/top`을 `/booth/ranking`으로 수정 (`useFetchBoothsRanking.ts`도 같이)
- [x] `ApiService.fetchPerforms`의 `data.perform`을 `data.performs`로 수정 (2026-10-11 확인, 커밋 전)
- [ ] `vercel.json`의 rewrite `"/(.*)" → "/"`가 `/api`까지 `index.html`로 보내고 있음. 백엔드를 직접 호출하도록 바꾸면서 `/api` 헤더 블록을 삭제
- [ ] `.env.production`의 `VITE_API_URL`을 백엔드 주소로 바꾸고, 소켓용 `VITE_SOCKET_URL`을 추가 (`GuestBook.tsx`의 `io("/api")`는 경로가 아니라 네임스페이스로 해석됨)
- [ ] `vite.config.ts`의 dev proxy target을 `http://localhost:4000`으로 바꾸고, `/legacy/api` prefix를 `rewrite`로 제거
- [ ] API 명세의 원본을 BE 레포로 옮기고 FE 문서에는 링크만 남기기

## 6. 로드맵

1. ✅ **서버 뼈대**: TS + Express 5, `GET /` → `{ message: "hello" }`
2. 🔶 **DB 연결**: Prisma 7.10 + PostgreSQL 17(Homebrew). `Notice` 모델과 첫 마이그레이션 완료. 나머지 모델은 3단계에서 API와 함께 추가
3. ⬜ **읽기 API**: `/notice`, `/timetable`, `/booth/all`, `/booth/ranking`, `/booth/:id`와 seed 데이터. 프론트를 연결해서 화면이 뜨는지 확인
4. ⬜ **인증**: 앱센터 재학생 확인, JWT, `/user/lms`, `/user/me`, `/user/logout`, 인증 미들웨어
5. ⬜ **쓰기 API**: 부스 댓글, 좋아요, 방명록 `POST /sentence`
6. ⬜ **Socket.io**: 방명록 실시간
7. ⬜ **운영 준비**: 보안, rate limit, 관리자 기능, 이미지 스토리지, 축제 날짜 설정
8. ⬜ **배포**: Railway, 도메인, 프론트 환경변수 전환

**DB 모델 초안** (2단계에서 사용)

| 모델 | 필드 |
|---|---|
| User | id, studentId(unique), name, role(USER/ADMIN), createdAt |
| Booth | id, name, category, department, description, liked(기본값 0), markerImage, time, location, x, y |
| BoothDay | id, day, boothId |
| BoothImg | id, url, boothId |
| BoothComment | id, content, emoji, userId, boothId, createdAt, updatedAt |
| Perform | id, name, category, detail, date, day, time, img |
| Notice | id, category, title, content, updatedAt |
| NoticeImg | id, img, noticeId |
| Sentence | id, content, emoji, userId, createdAt (응답할 때 `studentId`를 User에서 붙임) |
| Keyword | 필요한지 미정 |

## 7. 현재 진행 상황

- 1단계 완료. `npm run dev`와 `npm run build && npm start` 모두 `{"message":"hello"}` 응답을 확인했다.
- 사용자가 직접 실행해서 확인했고, 첫 커밋(`chore: TS + Express 5 서버 뼈대`)을 `main`에 push했다.
- 커밋 메시지는 `type: 요약` 형식(`feat:`, `fix:`, `refactor:`, `chore:`, `docs:` 등)을 쓴다.
- 사용자의 백엔드 학습도 목적이다. 단계마다 정답 코드와 표 형식의 설명을 준다 (퀴즈나 빈칸 채우기는 하지 않는다).
- 2단계 진행 중 (2026-10-11):
  - 로컬 DB: Homebrew `postgresql@17`(`brew services`로 자동 실행), DB 이름 `inu_festival`, `.env`의 `DATABASE_URL`
  - Node: Homebrew `postgresql@17` 설치가 icu4c를 바꿔 Homebrew Node가 깨졌다. nvm의 Node 22(기본값)로 전환했고 Homebrew `node`는 unlink 상태다
  - Prisma 7.10.0으로 고정 (npm `latest` 태그가 8.0 rc라서). Prisma 7은 `prisma.config.ts`, `prisma-client` 생성기(`src/generated/prisma`, gitignore), 드라이버 어댑터(`@prisma/adapter-pg`)를 쓴다
  - `src/db.ts`의 `prisma` 하나를 서버 전체에서 import 한다
  - `Notice` 모델과 `add_notice` 마이그레이션 적용, 생성/조회/삭제 동작 확인
- 다음: 커밋 후 3단계 `GET /notice` (응답에서 `id`를 문자열로, `noticeImgs`는 `NoticeImg` 관계 추가 후)
