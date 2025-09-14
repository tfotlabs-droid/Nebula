import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:5000";
const CHAT_ID = "nebula-support";

const SupportChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Загружаем историю из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem("nebula-chat-history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        console.warn("Ошибка парсинга истории чата");
      }
    }
  }, []);

  // Инициализация сокета
  useEffect(() => {
    if (!open) return;

    if (!socketRef.current) {
      const socket = io(WS_URL, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected to chat server");
        socket.emit("chat:join", CHAT_ID);      // 🔑 подписка на комнату (backend emits history on join)
      });

      socket.on("chat:history", (msgs: any[]) => {
        setMessages(msgs);
      });

      socket.on("chat:message", (msg: any) => {
        setMessages((m) => [...m, msg]);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected from chat server");
      });
    } else {
      // No need for separate history emit; it's sent on join
    }
  }, [open]);

  // Автоскролл вниз
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Сохраняем историю в localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const limited = messages.slice(-50); // последние 50 сообщений
      localStorage.setItem("nebula-chat-history", JSON.stringify(limited));
    }
  }, [messages]);

  const send = () => {
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit("chat:message", {
      from: "user",
      text: text.trim(),
      chatId: CHAT_ID,
    });
    setText("");
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4"
          >
            {/* Хедер */}
            <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
              <div className="font-semibold">Поддержка Nebula</div>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Сообщения */}
            <div className="p-3 max-h-64 overflow-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 ${m.from === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      m.from === "user"
                        ? "bg-indigo-600 text-white"
                        : m.from === "ai"
                        ? "bg-purple-100 text-purple-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {m.type === "link" ? (
                      <button
                        onClick={() => window.location.href = window.location.origin + m.url}
                        className="w-full text-left bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                      >
                        {m.text}
                      </button>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Инпут */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  placeholder="Опиши проблему..."
                />
                <button
                  onClick={send}
                  className="bg-indigo-600 text-white px-4 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Отправить
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Если бот не поможет — нажми <strong>Escalate</strong>
              </div>
              <div className="mt-1">
                <a
                  className="text-xs text-indigo-600 cursor-pointer hover:underline"
                  onClick={() =>
                    (window.location.href =
                      "mailto:tfotlabs@gmail.com?subject=Escalate%20from%20chat")
                  }
                >
                  Escalate — связаться с оператором
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопка открытия */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]"
        >
          💬
        </motion.button>
      )}
    </div>
  );
};

export default SupportChat;