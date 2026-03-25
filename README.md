# AI RAG Frontend

React · Vite · JWT · RAG Chat UI · Analytics + Profiles

## Overview

This repository houses the frontend for an enterprise-grade Retrieval-Augmented Generation (RAG) chatbot platform. It acts as the user gateway to the FastAPI/LangChain backend and provides authentication, real-time chat, analytics, and profile screens backed by JWT-protected routes.

## Key Features

- **Session management** – JWT login/register flows with tokens stored in `localStorage`.
- **Conversational chat** – Chat window, message bubbles, and streaming-like UI powered by Axios calls to `/chat`.
- **RAG responses** – Sources and token usage from PDF embeddings are surfaced to the user.
- **Role-aware analytics** – Dashboards showing token spend, admin summaries, and per-user statistics.
- **Enterprise layout** – Sidebar, navbar, layout wrapper, and reusable UI atoms (buttons, loaders, etc.).

## Architecture

```
React (Vite) → Context / Protected Routes → Axios → FastAPI backend
          ↳ LangChain / RAG / PostgreSQL / JWT Auth
```

The frontend injects the bearer token into each request (`Authorization: Bearer <JWT_TOKEN>`) through `src/api/axiosInstance.js`.

## Tech Stack

- React 19 + Vite 7
- React Router DOM v7
- Axios + Context API for API/auth orchestration
- MUI for icons + theming helper (`@mui/material`, `@mui/icons-material`)
- Plain CSS modules plus shared `global.css`, `App.css`, and `common` styles

## Getting Started

1. Install dependencies: `npm install`
2. Point the backend base URL in `src/api/axiosInstance.js` (defaults to `http://127.0.0.1:8000`).
3. Run the dev server: `npm run dev`
4. Open `http://localhost:5173` (Vite will print the exact address in the console).

### Scripts

- `npm run dev` – starts the Vite server with hot reload.
- `npm run build` – produces the `dist/` bundle.
- `npm run preview` – serves the production build locally.
- `npm run lint` – runs ESLint across the project.

## Authentication Flow

| Route | Payload | Response |
| --- | --- | --- |
| `POST /auth/register` | `{ email, password, role }` | `201` on success |
| `POST /auth/login` | `{ email, password }` | `{ access_token, token_type }` |

Tokens are stored via `localStorage.setItem("token", token)` and consumed by `AuthContext`.

## Visual Experience

- **Unified layout** – `components/layout/Layout.jsx` wraps the sidebar and navbar, keeping the header, notifications, and content panes aligned.
- **Sidebar navigation** – Icons + labels lead to Home, Chat, Analytics, and Profile while the active route is highlighted for orientation.
- **Chat canvas** – `chat/ChatWindow.jsx`, `chat/ChatInput.jsx`, and `components/MessageBubble.jsx` render the conversation, support scroll anchors, and show token/source metadata within each response bubble.
- **Analytics grid** – Cards, charts, and token counters surface usage trends; values are pulled from `/analytics/summary` or `/analytics/admin` based on role.
- **Profile + support** – The Profile screen confirms role/permissions and lets users log out cleanly via the navbar menu.
- **Forms and feedback** – Login/register forms give in-place validation, loaders, and error feedback using the shared `common/Loader` and button styles.

## API Clients

- `src/api/authService.js`: login & register wrappers.
- `src/api/chatService.js`: sends chat messages and records token usage.
- `src/api/axiosInstance.js`: sets `baseURL`, injects the Authorization header, and handles errors.

## Routing

- Public: `/` (login), `/register`.
- Protected under `/app/*`:
  - `/app/home`
  - `/app/chat`
  - `/app/analytics`
  - `/app/profile`

Routes are protected by `ProtectedRoute`/`ProtectedLayout` that redirect to `/` when no token exists.

## Directory Snapshot

```
src/
├── api/           # Axios + service helpers
├── app/           # Entry points + router/app shell
├── chat/          # Chat components (input, bubble, window)
├── components/    # Layout, navbar, sidebar
├── context/        # AuthContext provider/hooks
├── pages/          # Screens (Home, Chat, Analytics, Profile, Login, Register)
├── styles/         # Global/shared CSS
└── main.jsx         # React bootstrapper
```

## Deployment

1. Run `npm run build`.
2. Deploy the `dist/` artifact to any static host (Vercel, Netlify, GitHub Pages, etc.).
3. Ensure the backend URL in `axiosInstance.js` matches the production API.

## Contribution

1. Fork the repo.
2. Create a feature branch.
3. Run tests or lint (`npm run lint`) before opening a PR.
4. Provide screenshots/logs for UI or auth flow changes.
