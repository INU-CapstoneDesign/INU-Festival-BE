# INU-Festival-BE

인천대학교 대동제 웹사이트의 백엔드. **실제 축제 운영**이 목표다 (작년 축제: 2024년 5월, 3일간 약 1.4만 명 이용).

전체 배경·결정 이력·로드맵은 `docs/HANDOFF.md`에 있다. 새 세션은 먼저 그 문서를 읽고 "현재 진행 상황"에서 이어간다.

## 사용자와 작업 방식

- 사용자는 프론트엔드 개발자(`kaori-killer`, 2024년 FE 담당)이고 **백엔드 지식이 없다**. 백엔드 개념은 처음부터, 프론트(React/Vite)에 비유해서 설명한다.
- 역할 분담 (합의됨):
  - **Claude가 작성**: 프로젝트 설정, 설정 파일, 폴더 뼈대, 배포 설정처럼 반복적인 부분
  - **사용자가 작성**: API 로직, 비즈니스 로직. Claude는 먼저 개념을 설명하고, 사용자가 작성한 뒤 리뷰한다
- 단계 진행: 개념 설명 → 작성 → 실행해서 확인 (프론트 연결 포함) → 다음 단계
- 커밋과 push는 사용자에게 확인을 받고 한다.

## 스택 (결정됨)

- Node 22, TypeScript, Express 5
- PostgreSQL + Prisma (다음 단계에서 도입)
- 배포: Railway (서버 + 관리형 Postgres). Socket.io 때문에 Vercel 서버리스는 쓰지 않는다
- 프론트는 별도 레포 `INU-CapstoneDesign/INU-Festival-FE`, Vercel 배포 (로컬 `~/Desktop/INU-Festival-FE`)

## 원칙

- **API 경로와 응답 형태는 2024 버전(`INU-CapstoneDesign/INU-Festival-BE-2024`)과 맞춘다.** 그래야 프론트를 거의 고치지 않아도 된다. 2024 코드는 설계도로만 참고하고 그대로 복사하지 않는다.
- 레포가 **Public**이다. 비밀번호, 시크릿, 토큰은 `.env`에만 두고 절대 커밋하지 않는다. 필요한 키는 `.env.example`에 이름만 적는다.
- 클라이언트가 보낸 사용자 정보(`studentId` 등)를 믿지 않는다. 작성자는 항상 인증 토큰에서 꺼낸다.

## 명령

- `npm run dev`: 개발 서버 (tsx watch, http://localhost:4000)
- `npm run build`: `dist/`로 컴파일
- `npm start`: `dist/index.js` 실행 (배포용)
- `npm run check`: 타입 검사
