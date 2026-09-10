
# 🧠 AI RAG Frontend  
Enterprise AI • JWT Auth • RAG Chat UI • Analytics Dashboard

---

## 📌 Project Overview

This is the React + Vite Frontend for the AI RAG Chatbot Platform.

It provides:

- 🔐 JWT Authentication (Login / Register)
- 🧠 Conversational Chat Interface
- 📄 RAG-based responses from PDFs (text, tables and images)
- 📊 Token Usage Analytics
- 👤 Profile & Role Display
- 🛡 Protected Routes
- 🎨 Modern Enterprise UI

---

## 🏗️ System Architecture

React (Vite)
    ↓
JWT Authentication
    ↓
FastAPI Backend
    ↓
LangChain + RAG + PostgreSQL

Authorization Header:
Authorization: Bearer <JWT_TOKEN>

**Prerequisite:** the backend (`RAG_AI_MODEL_SERVER_APP`) must already be running at `http://127.0.0.1:8000` — see that repo's own README for its setup (`.env`, `create_tables.py`, `python -m rag.ingest`, `uvicorn app:app --reload`). This frontend has no server of its own to fall back on.

Demoing Module 4 (retrieval modes, citations, agent traces)? `RAG_AI_MODEL_SERVER_APP/docs/demo_guide.md` maps each slide to a query to run right here in `ChatWindow.jsx`.

---

## 🧰 Tech Stack

- React 19
- Vite
- React Router
- Axios
- MUI (`@mui/material`, `@mui/icons-material`) + Emotion — used in `Home.jsx`, `Login.jsx`, `Register.jsx` and `Analytics.jsx`
- JWT Authentication
- Context API
- Protected Routes
- Custom CSS for everything else (`chat/`, `common/`, `components/layout/`, `styles/global.css`)

---

## 📁 Project Structure
```text
RAG_AI_MODEL_CLIENT_REACT_APP_NISCHAL_AREMANDA/
│
├── public/
├── src/
│   ├── api/
│   │   ├── authService.js
│   │   ├── axiosInstance.js
│   │   ├── chatService.js
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │
│   ├── chat/
│   │   ├── ChatWindow.jsx
│   │   ├── ChatInput.jsx
│   │   ├── MessageBubble.jsx
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Loader.jsx
│   │   ├── Loader.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── Analytics.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔐 Authentication Flow

### Register
POST /auth/register

{
  "email": "user@email.com",
  "password": "securepassword"
}

Every registration is created with `role: "USER"` server-side — the endpoint has no `role` field to set, so passing one has no effect. There is no self-serve way to become `ADMIN`; it's set directly in the `users` table (e.g. `UPDATE users SET role='ADMIN' WHERE email='...'`) by whoever runs the backend.

### Login
POST /auth/login
(sent as `application/x-www-form-urlencoded`, fields `username` + `password` — see `authService.js`)

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}

Token stored in localStorage. The JWT carries the user's role, which the backend uses to decide what a given `/chat` request is allowed to retrieve (see below).

---

## 💬 Chat Feature

POST /chat

Request:
{
  "message": "What is RAG?",
  "session_id": "session1",
  "memory_type": "buffer",
  "retrieval_mode": "hybrid_rerank"
}

`retrieval_mode` defaults to `"hybrid_rerank"` server-side if omitted, but `ChatWindow.jsx` always sends one explicitly now, picked from the mode dropdown above the message list. Valid values:
- `dense` — plain vector similarity search
- `hybrid` — vector search + BM25 keyword search, merged
- `hybrid_rerank` — hybrid, then reranked by a cross-encoder for relevance (default)
- `multi_query` — hybrid_rerank, fanned out across paraphrased query variants and merged
- `graph` — answered by knowledge-graph traversal instead of vector search (multi-hop, "who teaches/owns/reports to" questions)
- `agentic` — routes each query to `graph` or `vector` search and retries the other tool if the first finds nothing

Response:
{
  "user": "user@email.com",
  "session_id": "session1",
  "retrieval_mode": "hybrid_rerank",
  "reply": "RAG stands for Retrieval-Augmented Generation...",
  "mode_info": {},
  "tokens": {
    "prompt": 1052,
    "completion": 9,
    "total": 1061,
    "cost": 0.001596
  },
  "sources": [
    {
      "source_file": "SD0109_Chatbots.pdf",
      "page": 2,
      "content_type": "text",
      "access_level": "public",
      "relevance_score": 0.9973,
      "image_path": null,
      "snippet": "..."
    }
  ]
}

`content_type` is one of `"text" | "ocr_text" | "table" | "image" | "audio" | "graph_edge"` — a source can be a ruled table, an embedded image, a scanned/OCR'd page, a transcribed audio clip, or a graph-traversal edge, not just narrative text. `relevance_score` is only populated in `hybrid_rerank`/`multi_query` mode (`null` otherwise). `access_level` reflects permission-aware retrieval: a `"USER"`-role token never receives `"admin"`-level sources, even if they'd otherwise be the best match.

`mode_info` is populated only for `graph` (`graph_matched_entities`: which graph nodes the query resolved to) and `agentic` (`agent_trace`: the actual routing/retry decisions made, e.g. `["route=graph (heuristic fallback)", "graph_search: 0 fact(s)", "retry: vector_search", "vector_search: 3 chunk(s)"]`) — empty object for every other mode. `ChatWindow.jsx` renders both `sources` (as a collapsible citations panel under each bot message) and `mode_info` (as a collapsible "Agent trace" / "Matched entities" panel) when present.

---

## 📊 Analytics

User (own usage only):
GET /analytics/summary

Admin (global — token usage across all users, most-asked questions):
GET /analytics/admin
(requires the caller's JWT role to be `ADMIN`; returns 403 otherwise)

---

## ▶️ Setup Instructions

1️⃣ Clone Repository
git clone <your-repo-url>
cd RAG_AI_MODEL_CLIENT_REACT_APP_NISCHAL_AREMANDA

2️⃣ Install Dependencies
npm install

3️⃣ Configure Backend URL (already done in code)
Update src/api/axiosInstance.js if your backend runs somewhere other than the default:

baseURL: "http://127.0.0.1:8000"

4️⃣ Run Development Server
npm run dev

Open in browser:
http://localhost:5173

(Vite's default dev port, 5173, is also the only origin the backend's CORS policy currently allows — changing it requires updating `allow_origins` in the backend's `app.py` too.)

---

## 🔧 Build for Production

npm run build

Output folder:
dist/

Deploy dist/ to:
- Vercel
- Netlify
- GitHub Pages

---

## 🚀 Production Capabilities

✅ Secure JWT login  
✅ Protected routes  
✅ Role-based UI  
✅ Real-time chat UI  
✅ RAG integration (text, table and image sources)  
✅ Token analytics dashboard  
✅ Clean enterprise layout  

---

## 🎯 Enterprise-Ready Frontend

✔ Production-level React architecture  
✔ Secure backend integration  
✔ Scalable modular structure  
✔ Modern UI design  
