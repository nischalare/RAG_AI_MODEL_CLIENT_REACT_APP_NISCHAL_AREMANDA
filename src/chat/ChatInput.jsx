import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input-wrapper">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <SendIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

