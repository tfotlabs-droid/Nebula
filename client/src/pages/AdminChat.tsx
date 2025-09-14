// client/src/pages/AdminChat.tsx
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaClock, FaPaperPlane, FaTimes, FaGlobe } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:5000";

type Chat = {
  _id: string;
  chatId: string;
  status?: string;
  createdAt?: string;
};

type Msg = {
  _id?: string;
  from: string;
  text: string;
  chatId: string;
  at?: string;
  tempId?: string; // временный ID для мгновенного отображения
};

const AdminChat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quickReply, setQuickReply] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Загружаем список чатов
    fetch("/api/chats")
      .then((r) => r.json())
      .then(setChats)
      .catch(console.error);

    const s = io(WS_URL, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Admin connected", s.id);
      s.emit("operator:join");
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (m: Msg) => {
      if (!selected || m.chatId !== selected.chatId) return;

      setMessages((prev) => {
        // если это ответ на временное сообщение админа → заменяем
        if (m.from === "operator") {
          const idx = prev.findIndex((p) => p.tempId && p.text === m.text);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = m;
            return copy;
          }
        }
        return [...prev, m];
      });
    };

    const handleHistory = (msgs: Msg[]) => {
      setMessages(msgs);
    };

    socket.on("chat:message", handleMessage);
    socket.on("chat:history", handleHistory);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("chat:history", handleHistory);
    };
  }, [socket, selected?.chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleClosed = (data: { chatId: string }) => {
      if (data.chatId !== selected?.chatId) return;

      const systemMsg = {
        from: "system",
        text: "Диалог завершён оператором.",
        chatId: selected.chatId,
        at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, systemMsg]);

      setTimeout(() => {
        setSelected(null);
        setMessages([]);
      }, 2000);
    };

    socket.on("chat:closed", handleClosed);

    return () => {
      socket.off("chat:closed", handleClosed);
    };
  }, [socket, selected?.chatId]);

  const openChat = async (c: Chat) => {
    setSelected(c);
const translateMessage = async (text: string) => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, fromLang: 'auto', toLang: 'en' }),
    });
    if (!response.ok) throw new Error('Translation failed');
    const data = await response.json();
    console.log('Original lang:', data.detectedLang, 'Translated:', data.translatedText);
    // To show in UI, could add translatedText to message state or separate div
  } catch (err) {
    console.error('Translation error:', err);
  }
};
// Translation function already defined above
    const r = await fetch(`/api/chats/${encodeURIComponent(c.chatId)}/messages`);
    const msgs = await r.json();
    setMessages(msgs);
    socket?.emit("chat:join", c.chatId);
  };

  const send = () => {
    if (!text.trim() || !selected || !socket) return;

    const tempMsg: Msg = {
      tempId: Date.now().toString(),
      from: "operator",
      text: text.trim(),
      chatId: selected.chatId,
      at: new Date().toISOString(),
    };

    // локально сразу показываем
    setMessages((prev) => [...prev, tempMsg]);

    // отсылаем на сервер
    socket.emit("chat:message", tempMsg);

    setText("");
 
    // Filter chats based on search
    const filteredChats = chats.filter(c => c.chatId.toLowerCase().includes(searchTerm.toLowerCase()));
 
    // Quick replies
    const quickReplies = [
      "Спасибо за сообщение! Я передам его оператору.",
      "Проверьте интернет-соединение и обновите приложение.",
      "Для скачивания перейдите на страницу Download.",
      "Подписка оформлена успешно! Проверьте статус в профиле.",
      "Если проблема не решена, опишите подробнее.",
      "Диалог завершён. Если нужны вопросы, начните новый чат."
    ];
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 flex gap-4">
      {/* Список чатов */}
      <div style={{ width: 320 }} className="bg-white rounded-lg shadow p-3">
        <h3 className="font-bold mb-2">Чаты</h3>
        <div className="flex flex-col gap-2 max-h-[70vh] overflow-auto">
          {chats.map((c) => (
            <button
              key={c.chatId}
              onClick={() => openChat(c)}
              className={`text-left p-2 rounded ${
                selected?.chatId === c.chatId
                  ? "bg-indigo-50"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">{c.chatId}</div>
              <div className="text-xs text-gray-500">
                Статус: {c.status || "open"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Окно сообщений */}
      <div className="flex-1 bg-white rounded-lg shadow p-3 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h3 className="text-lg font-bold">
            {selected ? `Чат: ${selected.chatId}` : "Выберите чат"}
          </h3>
          {selected && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/chats/${encodeURIComponent(selected.chatId)}/close`, { method: "POST" });
                  if (res.ok) {
                    setChats((prev) => prev.filter((c) => c.chatId !== selected.chatId));
                    setSelected(null);
                    setMessages([]);
                  } else {
                    console.error("Failed to close chat");
                  }
                } catch (error) {
                  console.error("Error closing chat:", error);
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Завершить чат
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-2">
          {messages.map((m, i) => (
            <div
              key={m._id || m.tempId || i}
              className={`mb-2 ${
                m.from === "operator" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-3 py-2 rounded ${
                  m.from === "operator"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400">
                  {m.from} • {m.at ? new Date(m.at).toLocaleTimeString() : ""}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>


        {/* Ввод сообщения */}
        {selected && (
          <div className="mt-3 border-t pt-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Ответить..."
              />
              <button
                onClick={send}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Отправить
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t">
              <button
                onClick={() => {
                  const linkMsg = {
                    from: "operator",
                    type: "link",
                    text: "Перейдите в раздел Скачать",
                    url: "/download",
                    chatId: selected.chatId,
                    at: new Date().toISOString(),
                  };
                  socket?.emit("chat:message", linkMsg);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Скачать
              </button>
              <button
                onClick={() => {
                  const linkMsg = {
                    from: "operator",
                    type: "link",
                    text: "Перейдите в раздел Вакансии",
                    url: "/jobs",
                    chatId: selected.chatId,
                    at: new Date().toISOString(),
                  };
                  socket?.emit("chat:message", linkMsg);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Вакансии
              </button>
              <button
                onClick={() => {
                  const linkMsg = {
                    from: "operator",
                    type: "link",
                    text: "Перейдите на главную страницу",
                    url: "/",
                    chatId: selected.chatId,
                    at: new Date().toISOString(),
                  };
                  socket?.emit("chat:message", linkMsg);
                }}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                Главная
              </button>
              <button
                onClick={() => {
                  const linkMsg = {
                    from: "operator",
                    type: "link",
                    text: "Перейдите в раздел О нас",
                    url: "/about",
                    chatId: selected.chatId,
                    at: new Date().toISOString(),
                  };
                  socket?.emit("chat:message", linkMsg);
                }}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
              >
                О нас
              </button>
              <button
                onClick={() => {
                  const linkMsg = {
                    from: "operator",
                    type: "link",
                    text: "Перейдите в раздел Контакты",
                    url: "/contact",
                    chatId: selected.chatId,
                    at: new Date().toISOString(),
                  };
                  socket?.emit("chat:message", linkMsg);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Контакты
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;