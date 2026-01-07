/**
 * CHE·NU™ — Communication Hub
 * Nova chat, notifications, meetings
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export function CommunicationHub() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "nova"; text: string }>>([
    { role: "nova", text: "Bonjour! Comment puis-je vous aider aujourd'hui?" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: message }]);

    // Simulate Nova response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "nova",
          text: "Je comprends. Laissez-moi vous aider avec cela...",
        },
      ]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="communication-hub">
      <header className="hub-header">
        <h3>💬 Communication</h3>
      </header>

      {/* Nova Section */}
      <div className="nova-section">
        <div className="nova-header">
          <span className="nova-avatar">✦</span>
          <span className="nova-name">Nova</span>
          <span className="nova-status online">En ligne</span>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`message ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.role === "nova" && <span className="msg-avatar">✦</span>}
              <span className="msg-text">{msg.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Demandez à Nova..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>↑</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-section">
        <h4>🔔 Notifications</h4>
        <div className="notification-list">
          <div className="notification-item">
            <span className="notif-icon">📹</span>
            <span className="notif-text">Réunion dans 30 min</span>
          </div>
          <div className="notification-item">
            <span className="notif-icon">✅</span>
            <span className="notif-text">3 tâches dues aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Voice Button */}
      <div className="voice-section">
        <button className="voice-btn">
          🎤 Appuyer pour parler
        </button>
      </div>
    </div>
  );
}
