import { useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000/chat";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 🐶 I’m your Dog Assistant. Ask me anything about dogs!"
    }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("explain");
  const [loading, setLoading] = useState(false);

  const puppyQuestions = [
    "How do I train a puppy to sit?",
    "How do I stop my puppy from biting?",
    "How often should I train my puppy?",
    "What is the best way to potty train a puppy?",
    "How do I teach my puppy to come when called?"
  ];

  const behaviorQuestions = [
    "Why does my dog bark at strangers?",
    "Why does my dog chew everything?",
    "Why is my dog anxious when I leave?",
    "Why does my dog pull on the leash?",
    "Why does my dog jump on people?"
  ];

  const quizQuestions = [
    "Quiz me about dog training",
    "Ask me questions about puppy care",
    "Test my knowledge about dog behavior",
    "Give me a short dog training quiz"
  ];

  const getRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };

    // Lähetetään backendiin vain käyttäjän aiemmat viestit,
    // jotta botti ei ala matkia vanhoja assistant-vastauksia.
    const historyForBackend = messages.filter((msg) => msg.role === "user");

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: historyForBackend,
          mode: mode
        })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi 🐶 I’m your Dog Assistant. Ask me anything about dogs!"
      }
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🐾 Dog Assistant Chat 🐶</h1>

        <img
          src={`https://placedog.net/800/300?random=${Math.random()}`}
          alt="dog"
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "16px"
          }}
        />

        <p className="subtitle">
          React frontend + FastAPI backend + Gemini API
        </p>

        <div className="controls">
          <label>
            Mode:
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="explain">Explain mode</option>
              <option value="quiz">Quiz mode</option>
            </select>
          </label>

          <button onClick={clearChat}>Clear chat</button>

          <button onClick={() => setInput(getRandom(puppyQuestions))}>
            Puppy training 🐶
          </button>

          <button onClick={() => setInput(getRandom(behaviorQuestions))}>
            Dog behavior 🐾
          </button>

          <button onClick={() => setInput(getRandom(quizQuestions))}>
            Quiz me 🎓
          </button>
        </div>

        <div className="chatBox">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "user" ? "message user" : "message assistant"}
            >
              <strong>{msg.role === "user" ? "You" : "Dog Assistant"}:</strong>
              <div>{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <strong>Dog Assistant:</strong>
              <div>Thinking...</div>
            </div>
          )}
        </div>

        <div className="inputRow">
          <input
            type="text"
            placeholder="Ask something about dogs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}