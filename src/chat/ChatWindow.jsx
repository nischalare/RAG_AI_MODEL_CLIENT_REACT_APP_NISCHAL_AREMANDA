import { useState, useEffect, useRef } from "react";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I assist you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const sessionId = "session1";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // Add user message immediately
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          memory_type: "buffer"
        })
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      // ✅ IMPORTANT: Only use data.reply
      const botReply = data.reply || "No response received.";

      setMessages(prev => [
        ...prev,
        { role: "bot", text: botReply }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
        />
        <button onClick={sendMessage} disabled={loading}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
