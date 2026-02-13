const MessageBubble = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        {message.text}

        {message.sources && message.sources.length > 0 && (
          <div className="sources">
            <hr />
            <strong>Sources:</strong>
            <ul>
              {message.sources.map((src, index) => (
                <li key={index}>
                  {src.title} (Page {src.page_label})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
