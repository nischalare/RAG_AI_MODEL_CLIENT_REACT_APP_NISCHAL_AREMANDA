import { useState, useEffect, useRef } from "react";

const CONTENT_TYPE_ICON = {
  text: "📄",
  table: "📊",
  image: "🖼️",
};

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I assist you today?", sources: [] }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Which messages have their citations panel expanded, keyed by index.
  const [expandedSources, setExpandedSources] = useState(() => new Set());

  const messagesEndRef = useRef(null);
  const sessionId = "session1";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSources = (index) => {
    setExpandedSources((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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

      // Real citations -- which file/page backed the answer, whether it
      // was text/table/image, and (in hybrid_rerank mode) how relevant
      // it scored. See the citations panel rendered below each bot
      // bubble for how this is surfaced.
      const sources = Array.isArray(data.sources) ? data.sources : [];

      setMessages(prev => [
        ...prev,
        { role: "bot", text: botReply, sources }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong.", sources: [] }
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
        {messages.map((msg, index) => {
          const hasSources = msg.role === "bot" && msg.sources && msg.sources.length > 0;
          const isExpanded = expandedSources.has(index);

          return (
            <div key={index} className={`message ${msg.role}`}>
              <div className="bubble">{msg.text}</div>

              {hasSources && (
                <div className="citations">
                  <button
                    type="button"
                    className="citations-toggle"
                    onClick={() => toggleSources(index)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? "▾" : "▸"}</span>
                    Sources ({msg.sources.length})
                  </button>

                  {isExpanded && (
                    <div className="citations-list">
                      {msg.sources.map((source, sourceIndex) => {
                        const isAdmin = source.access_level === "admin";
                        const scorePercent =
                          typeof source.relevance_score === "number"
                            ? `${(source.relevance_score * 100).toFixed(1)}%`
                            : null;

                        return (
                          <div
                            key={sourceIndex}
                            className={`citation-card${isAdmin ? " citation-admin" : ""}`}
                          >
                            <div className="citation-header">
                              <span className={`citation-type-badge type-${source.content_type || "text"}`}>
                                {CONTENT_TYPE_ICON[source.content_type] || "📄"} {source.content_type || "text"}
                              </span>
                              <span className="citation-file">
                                {source.source_file}
                                {source.page ? ` · p.${source.page}` : ""}
                              </span>
                              {isAdmin && <span className="citation-admin-badge">admin-only</span>}
                              {scorePercent && <span className="citation-score">{scorePercent}</span>}
                            </div>

                            {source.snippet && (
                              <div className="citation-snippet">{source.snippet}</div>
                            )}

                            {source.content_type === "image" && source.image_path && (
                              <div className="citation-image-path">📎 {source.image_path}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
