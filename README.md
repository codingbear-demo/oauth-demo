# OAuth 2.0 Demo

Google OAuth 2.0 + NestJS + Session 기반 포트폴리오 데모 프로젝트.

## Architecture

- **Backend**: NestJS + Passport.js (Google OAuth 2.0) + express-session
- **Frontend**: Vite + React + TypeScript + React Router
- **Deployment**: EC2 + Nginx (reverse proxy) + PM2 + Let's Encrypt

같은 오리진(NestJS가 React 빌드 정적 서빙)으로 세션 쿠키를 단순하게 유지합니다.

## Local Development

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에 실제 값 입력
```

### 2. Google OAuth 앱 설정

[Google Cloud Console](https://console.cloud.google.com/)에서:
- OAuth 2.0 클라이언트 생성
- Authorized redirect URIs: `http://localhost:3000/auth/google/callback`

### 3. 서버 실행

```bash
cd server
npm install
npm run start:dev
```

### 4. 클라이언트 개발 서버 (선택)

```bash
cd client
npm install
npm run dev
# http://localhost:5173 (Vite proxy → NestJS 3000)
```

### 5. 프로덕션 빌드 (통합)

```bash
# 클라이언트 빌드
cd client && npm run build

# 서버 빌드
cd server && npm run build

# PM2로 실행
pm2 start ecosystem.config.js --env production
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/google` | Google OAuth 로그인 시작 |
| GET | `/auth/google/callback` | Google OAuth 콜백 |
| GET | `/api/me` | 현재 로그인 사용자 정보 |
| POST | `/api/logout` | 로그아웃 |

## Deployment (EC2 + Nginx)

```bash
# Nginx 설정 (X-Forwarded-Proto 헤더 필수)
# Let's Encrypt: certbot --nginx -d oauth-demo.codingbear.dev
# PM2: pm2 start ecosystem.config.js && pm2 save && pm2 startup
```

자세한 배포 가이드는 `ecosystem.config.js` 참고.

## Security Notes

- `SESSION_SECRET`은 32자 이상 랜덤 문자열 사용
- `.env` 파일은 절대 커밋 금지
- Access/Refresh Token은 저장하지 않음 (프로필 정보만 in-memory store)
