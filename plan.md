OAuth Demo (NestJS + Session + Simple React) 태스크 목록

0) 목표 URL (확정)
	•	https://oauth-demo.codingbear.dev
	•	OAuth 시작: GET /auth/google
	•	콜백: GET /auth/google/callback
	•	API: GET /api/me, POST /api/logout
	•	React 라우트: /(로그인 버튼), /success(프로필 표시), /error

⸻

A. Nest 프로젝트 세팅
	•	NestJS 생성
	•	@nestjs/config + env validation(zod/joi)
	•	passport, @nestjs/passport, passport-google-oauth20
	•	세션: express-session + cookie-parser
	•	app.set('trust proxy', 1) (Nginx 뒤에 둘 거면 거의 필수)

⸻

B. Session + Passport(Google OAuth)
	•	AuthModule / AuthController
	•	GET /auth/google (passport guard로 redirect)
	•	GET /auth/google/callback (로그인 성공 처리 후 프론트로 redirect)
	•	GoogleStrategy 구현
	•	scope: profile, email
	•	serializeUser / deserializeUser 구현(간단 in-memory로 OK)
	•	세션에 user id만 저장, /api/me에서 프로필 반환

중요: 콜백에서 성공하면
	•	res.redirect('/success') 로 보내기 (React route)

⸻

C. React(간단) 붙이기

“간단 React”면 Vite가 제일 빠름.
	•	client/에 Vite React 앱 생성
	•	페이지 구성
	•	/ : “Login with Google” 버튼 → 클릭 시 window.location.href = '/auth/google'
	•	/success : GET /api/me 호출해서 profile 표시
	•	/error : 실패 안내 + 다시 로그인 버튼
	•	빌드/서빙
	•	vite build 결과물 client/dist를 Nest가 정적 서빙
	•	Nest에서 ServeStaticModule로 client/dist 서빙
	•	React Router 사용 시(선택) fallback 설정(모든 라우트가 index.html로)

✅ 이렇게 하면 프론트/백이 같은 도메인/오리진이라 세션 쿠키가 아주 편해져.

⸻

D. API 엔드포인트 (React가 쓸 것)
	•	GET /api/me
	•	로그인 안 됐으면 401
	•	로그인 됐으면 { name, email, provider, id }
	•	POST /api/logout
	•	세션 파기 + 쿠키 정리

⸻

E. 보안/품질 “가성비” 체크 (포폴이라 필수)
	•	세션 쿠키 설정 제대로
	•	httpOnly: true
	•	secure: true (HTTPS에서)
	•	sameSite: 'lax' (대부분 OAuth에 무난)
	•	세션 secret은 env로, 로그에 노출 금지
	•	OAuth 실패 시 /error로 redirect
	•	Rate limit(선택): /auth/*에 throttling
	•	.env 절대 커밋 금지 + .env.example 제공

⸻

F. EC2 배포(데모답게 “실제로 돌아가게”)
	•	Nginx 리버스 프록시: oauth-demo.codingbear.dev → localhost:3000
	•	Let’s Encrypt로 HTTPS
	•	Node 프로세스는 pm2
	•	Google OAuth 콘솔에 등록:
	•	Authorized redirect URI: https://oauth-demo.codingbear.dev/auth/google/callback

⸻

코드 공개용으로 특히 신경 쓸 포인트

1) “공개 레포에서 절대 하면 안 되는 것”
	•	.env 커밋 ❌
	•	client secret / session secret / tokens 로그 출력 ❌
	•	콜백에서 받은 access_token 같은 걸 프론트로 전달 ❌ (세션만 유지)

2) “프로처럼 보이는 디테일(난이도 거의 안 올림)”
	•	env validation(없으면 ‘샘플’ 느낌)
	•	/api/me에서 401 처리 깔끔하게
	•	README에 “Same-origin session cookies” 한 줄 설명
	•	스크린샷 2장(홈/성공)

3) React를 “간단”하게 유지하는 원칙
	•	상태관리 라이브러리 금지(필요 없음)
	•	UI 프레임워크도 최소(plain CSS or Tailwind 정도)
	•	라우팅도 2~3개만



추천 repo 구성
```
oauth-demo/
  server/   (NestJS)
  client/   (Vite React)
  README.md
  .env.example
```