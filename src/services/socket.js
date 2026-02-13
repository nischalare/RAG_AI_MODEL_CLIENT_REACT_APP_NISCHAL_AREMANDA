/*
==========================================
AI RAG FRONTEND - WEBSOCKET SERVICE
Handles streaming chat responses
==========================================
*/

const WS_BASE_URL = "ws://127.0.0.1:8000/ws/chat";

class ChatSocket {
  constructor() {
    this.socket = null;
    this.onMessageCallback = null;
    this.onOpenCallback = null;
    this.onCloseCallback = null;
  }

  /* ==========================================
     CONNECT SOCKET
  ========================================== */

  connect() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Cannot connect WebSocket.");
      return;
    }

    this.socket = new WebSocket(`${WS_BASE_URL}?token=${token}`);

    this.socket.onopen = () => {
      console.log("✅ WebSocket connected");
      if (this.onOpenCallback) this.onOpenCallback();
    };

    this.socket.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };

    this.socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      if (this.onCloseCallback) this.onCloseCallback();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  /* ==========================================
     SEND MESSAGE (Streaming)
  ========================================== */

  sendMessage(payload) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected.");
      return;
    }

    this.socket.send(JSON.stringify(payload));
  }

  /* ==========================================
     EVENT HANDLERS
  ========================================== */

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onOpen(callback) {
    this.onOpenCallback = callback;
  }

  onClose(callback) {
    this.onCloseCallback = callback;
  }

  /* ==========================================
     DISCONNECT
  ========================================== */

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

/* ==========================================
   EXPORT SINGLETON INSTANCE
========================================== */

export default new ChatSocket();
