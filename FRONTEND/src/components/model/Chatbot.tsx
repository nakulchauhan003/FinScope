import React, { useState } from "react";
import axios from "axios";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await axios.post("https://your-api-endpoint.com/chat", {
        message: input,
      });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong. Please try again later." }]);
    }
    setLoading(false);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">💬 AI Chatbot Assistant</h2>
      <div className="h-64 overflow-y-auto border rounded-md p-3 bg-gray-50 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-md max-w-xs ${
              msg.sender === "user" ? "bg-blue-100 self-end ml-auto" : "bg-gray-200"
            }`}
          >
            <span className="text-sm">{msg.text}</span>
          </div>
        ))}
        {loading && <p className="text-sm italic text-gray-400">Bot is typing...</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
