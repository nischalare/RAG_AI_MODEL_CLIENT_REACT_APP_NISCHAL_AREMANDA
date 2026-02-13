
# 🧠 AI RAG Frontend  
Enterprise AI • JWT Auth • RAG Chat UI • Analytics Dashboard

---

## 📌 Project Overview

This is the React + Vite Frontend for the AI RAG Chatbot Platform.

It provides:

- 🔐 JWT Authentication (Login / Register)
- 🧠 Conversational Chat Interface
- 📄 RAG-based responses from PDFs
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

---

## 🧰 Tech Stack

- React 18
- Vite
- React Router
- Axios
- JWT Authentication
- Context API
- Protected Routes
- Custom CSS Styling

---

## 📁 Project Structure

ai-rag-frontend/
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
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── MessageBubble.jsx
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
│   │   ├── App.css
│   │   ├── index.css
│   │
│   ├── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md

---

## 🔐 Authentication Flow

### Register
POST /auth/register

{
  "email": "user@email.com",
  "password": "securepassword",
  "role": "USER"
}

### Login
POST /auth/login

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}

Token stored in localStorage.

---

## 💬 Chat Feature

POST /chat

Request:
{
  "message": "What is RAG?",
  "session_id": "session1",
  "memory_type": "buffer"
}

Response:
{
  "user": "user@email.com",
  "session_id": "session1",
  "reply": "RAG stands for Retrieval-Augmented Generation...",
  "tokens": {
    "prompt": 1052,
    "completion": 9,
    "total": 1061,
    "cost": 0.001596
  },
  "sources": [...]
}

Frontend displays data.reply inside chat bubble.

---

## 📊 Analytics

User:
GET /analytics/summary

Admin:
GET /analytics/admin

---

## ▶️ Setup Instructions

1️⃣ Clone Repository
git clone <your-repo-url>
cd ai-rag-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Configure Backend URL(its already done in code)
Update src/api/axiosInstance.js

baseURL: "http://127.0.0.1:8000"

4️⃣ Run Development Server
npm run dev

Open in browser:
http://localhost:5173

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
✅ RAG integration  
✅ Token analytics dashboard  
✅ Clean enterprise layout  

---

## 🎯 Enterprise-Ready Frontend

✔ Production-level React architecture  
✔ Secure backend integration  
✔ Scalable modular structure  
✔ Modern UI design  
