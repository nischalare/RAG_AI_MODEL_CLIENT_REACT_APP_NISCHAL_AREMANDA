const MessageBubble = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      {!isUser && (
        <div className="avatar bot-avatar">🤖</div>
      )}

      <div className="bubble-container">
        <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
          {text}
        </div>
      </div>

      {isUser && (
        <div className="avatar user-avatar">👤</div>
      )}
    </div>
  );
};

export default MessageBubble;
