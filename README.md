# OAuth 2.0 Demo

Google OAuth 2.0 + NestJS + Session-based portfolio demo project.

## Architecture

- **Backend**: NestJS + Passport.js (Google OAuth 2.0) + express-session
- **Frontend**: Vite + React + TypeScript + React Router
- **Deployment**: EC2 + Nginx (reverse proxy) + PM2 + Let's Encrypt

Uses a single origin (NestJS serves the React build as static files) to keep session cookies simple.

## Local Development

### 1. Environment Variables

```bash
cp .env.example .env
# Fill in actual values in the .env file
```

### 2. Google OAuth App Setup

In [Google Cloud Console](https://console.cloud.google.com/):
- Create an OAuth 2.0 client
- Authorized redirect URIs: `http://localhost:3000/auth/google/callback`

### 3. Run Server

```bash
cd server
npm install
npm run start:dev
```

### 4. Client Dev Server (Optional)

```bash
cd client
npm install
npm run dev
# http://localhost:5173 (Vite proxy → NestJS 3000)
```

### 5. Production Build (Integrated)

```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build

# Run with PM2
pm2 start ecosystem.config.js --env production
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/google` | Initiate Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/api/me` | Get current user info |
| POST | `/api/logout` | Logout |

## Deployment (EC2 + Nginx)

```bash
# Nginx config (X-Forwarded-Proto header required)
# Let's Encrypt: certbot --nginx -d oauth-demo.codingbear.dev
# PM2: pm2 start ecosystem.config.js && pm2 save && pm2 startup
```

See `ecosystem.config.js` for detailed deployment configuration.

## Security Notes

- `SESSION_SECRET` must be a random string of 32+ characters
- Never commit the `.env` file
- Access/Refresh tokens are not stored (only profile info in in-memory store)
