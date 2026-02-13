import { useState } from "react";

const MessageBubble = ({ message }) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">

        {/* Main Reply */}
        <div>{message.text}</div>

        {/* Tokens */}
        {message.tokens && (
          <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>
            📊 Tokens: {message.tokens.total} <br />
            💰 Cost: ${message.tokens.cost?.toFixed(6)}
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => setShowSources(!showSources)}
              style={{
                background: "transparent",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                padding: 0,
                fontSize: "13px"
              }}
            >
              📚 Sources ({message.sources.length})
            </button>

            {showSources && (
              <ul style={{ marginTop: "8px", paddingLeft: "15px", fontSize: "12px" }}>
                {message.sources.map((src, index) => (
                  <li key={index}>
                    {src.source?.split("/").pop()} – Page {src.page_label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MessageBubble;
