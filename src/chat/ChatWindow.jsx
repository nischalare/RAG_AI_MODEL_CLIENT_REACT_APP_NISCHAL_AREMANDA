import { useState, useEffect, useRef } from "react";

const CONTENT_TYPE_ICON = {
  text: "📄",
  ocr_text: "🔎",
  table: "📊",
  image: "🖼️",
  audio: "🎧",
  graph_edge: "🔗",
};

// Every retrieval_mode the backend accepts -- see rag/retrievers.py,
// rag/graph_rag.py, rag/agentic_rag.py -- with a short label + hint so
// picking one in the UI explains what it actually does.
const MODE_OPTIONS = [
  { value: "dense", label: "Dense", hint: "Vector similarity search only." },
  { value: "hybrid", label: "Hybrid", hint: "Vector + BM25 lexical search, combined." },
  { value: "hybrid_rerank", label: "Hybrid + Rerank", hint: "Hybrid, then reranked with a cross-encoder. Default." },
  { value: "multi_query", label: "Multi-Query", hint: "Hybrid + rerank, fanned out across paraphrased query variants." },
  { value: "graph", label: "Graph", hint: "Answers via knowledge-graph traversal, not vector search -- best for \"who teaches/owns/reports to\" questions." },
  { value: "agentic", label: "Agentic", hint: "Routes each query to graph or vector search, and retries the other tool if the first finds nothing." },
];

const DEFAULT_MODE = "hybrid_rerank";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I assist you today?", sources: [], modeInfo: {} }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(DEFAULT_MODE);

  // Which messages have their citations panel expanded, keyed by index.
  const [expandedSources, setExpandedSources] = useState(() => new Set());
  // Which messages have their agent-trace / matched-entities panel
  // expanded, keyed by index.
  const [expandedTrace, setExpandedTrace] = useState(() => new Set());

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

  const toggleTrace = (index) => {
    setExpandedTrace((prev) => {
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
          memory_type: "buffer",
          retrieval_mode: mode
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
      // was text/table/image/audio/graph_edge, and (in hybrid_rerank
      // mode) how relevant it scored. See the citations panel rendered
      // below each bot bubble for how this is surfaced.
      const sources = Array.isArray(data.sources) ? data.sources : [];

      // graph/agentic modes return extra routing/traversal info (see
      // app.py's mode_info: agent_trace for agentic, graph_matched_entities
      // for graph) -- empty object for every other mode.
      const modeInfo = data.mode_info && typeof data.mode_info === "object" ? data.mode_info : {};

      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: botReply,
          sources,
          modeInfo,
          retrievalMode: data.retrieval_mode || mode,
        }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong.", sources: [], modeInfo: {} }
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

  const activeModeOption = MODE_OPTIONS.find((m) => m.value === mode);

  return (
    <div className="chat-wrapper">
      <div className="chat-toolbar">
        <label htmlFor="retrieval-mode-select" className="chat-toolbar-label">
          Retrieval mode
        </label>
        <select
          id="retrieval-mode-select"
          className="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {MODE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {activeModeOption && (
          <span className="chat-toolbar-hint">{activeModeOption.hint}</span>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const hasSources = msg.role === "bot" && msg.sources && msg.sources.length > 0;
          const isExpanded = expandedSources.has(index);

          const agentTrace = msg.role === "bot" ? msg.modeInfo?.agent_trace : null;
          const matchedEntities = msg.role === "bot" ? msg.modeInfo?.graph_matched_entities : null;
          const hasTrace = Boolean((agentTrace && agentTrace.length) || (matchedEntities && matchedEntities.length));
          const isTraceExpanded = expandedTrace.has(index);

          return (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === "bot" && msg.retrievalMode && (
                <div className="message-mode-badge">{msg.retrievalMode}</div>
              )}
              <div className="bubble">{msg.text}</div>

              {hasTrace && (
                <div className="agent-trace">
                  <button
                    type="button"
                    className="agent-trace-toggle"
                    onClick={() => toggleTrace(index)}
                    aria-expanded={isTraceExpanded}
                  >
                    <span>{isTraceExpanded ? "▾" : "▸"}</span>
                    {agentTrace ? "Agent trace" : "Matched entities"}
                  </button>

                  {isTraceExpanded && (
                    <div className="agent-trace-list">
                      {matchedEntities && matchedEntities.length > 0 && (
                        <div className="agent-trace-entities">
                          {matchedEntities.map((entity, i) => (
                            <span key={i} className="entity-chip">{entity}</span>
                          ))}
                        </div>
                      )}
                      {agentTrace && agentTrace.map((step, i) => (
                        <div key={i} className="agent-trace-step">
                          <span className="agent-trace-index">{i + 1}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
