// client/src/pages/AdminChat.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaPaperPlane, FaGlobe } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:5000";

type Chat = {
  id: string;
  chatId: string;
  status?: string;
  createdAt?: string;
};

type Msg = {
  id?: string;
  from: string;
  text: string;
  chatId: string;
  at?: string;
  tempId?: string; // temporary ID for instant display
};

const AdminChat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<Chat | null>(null);
  const selectedRef = useRef<Chat | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const translateMessage = async (text: string, targetLang: string = 'en') => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, toLang: targetLang }),
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      return data.translatedText || text;
    } catch (err) {
      console.error('Translation error:', err);
      return text; // Fallback to original
    }
  };

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chats");
      if (!res.ok) throw new Error("Failed to fetch chats");
      const data: Chat[] = await res.json();
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(t("adminChat.error.fetchChats") || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Socket connection and event handling
  useEffect(() => {
    const newSocket = io(WS_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Admin connected to chat server");
      fetchChats();
    });

    newSocket.on("chat:new", (newChat: Chat) => {
      setChats(prev => [...prev, newChat]);
    });

    newSocket.on("chat:message", (msg: Msg) => {
      if (selectedRef.current && msg.chatId === selectedRef.current.chatId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Admin disconnected from chat server");
    });

    return () => {
      newSocket.close();
    };
  }, [fetchChats]);


  // Select a chat and fetch its messages
  const selectChat = async (chat: Chat) => {
    setSelected(chat);
    if (socket) {
      socket.emit("chat:join", chat.chatId);
    }
    setMessages([]);
    try {
      const res = await fetch(`/api/chats/${chat.chatId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data: Msg[] = await res.json();
      // Translate non-English messages if needed
      const translatedMessages = await Promise.all(
        data.map(async (msg) => ({
          ...msg,
          text: await translateMessage(msg.text, "en"),
        }))
      );
      setMessages(translatedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(t("adminChat.error.fetchMessages") || "Failed to load messages");
    }
  };

  // Send message
  const sendMessage = () => {
    if (!text.trim() || !socket || !selected) return;
    const msg: Msg = {
      from: "admin",
      text: text.trim(),
      chatId: selected.chatId,
      at: new Date().toISOString(),
      tempId: Date.now().toString(),
    };
    socket.emit("chat:message", msg);
    setMessages(prev => [...prev, msg]);
    setText("");
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter chats by search term
  const filteredChats = chats.filter(
    (chat) =>
      chat.chatId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.status && chat.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="p-4">{t("adminChat.loading") || "Loading chats..."}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        {/* @ts-ignore */}
        <FaUser className="mr-2" />
        {t("adminChat.title") || "Admin Chat Dashboard"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex h-screen">
        {/* Chats List */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex mb-4">
            {/* @ts-ignore */}
            <FaSearch className="mt-1 mr-2 text-gray-500" />
            <input
              type="text"
              placeholder={t("adminChat.searchPlaceholder") || "Search chats..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2 max-h-full overflow-y-auto">
            {filteredChats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {t("adminChat.noChats") || "No chats found"}
              </p>
            ) : (
              filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selected?.id === chat.id
                      ? "bg-blue-100 border-blue-300 border"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="font-semibold text-sm truncate">{chat.chatId}</div>
                  <div className="text-xs text-gray-500">
                    {chat.status || (t("adminChat.active") || "Active")}
                  </div>
                  {chat.createdAt && (
                    <div className="text-xs text-gray-400">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="w-2/3 flex flex-col">
          {selected ? (
            <>
              <div className="p-4 bg-white border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                  Chat: {selected.chatId}
                </h2>
                <div className="text-sm text-gray-500">
                  Status: {selected.status || "Active"}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {t("adminChat.noMessages") || "No messages yet"}
                  </p>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={msg.id || msg.tempId || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.from === "admin"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <div className="font-medium text-sm">{msg.from}</div>
                        <div className="text-sm break-words">{msg.text}</div>
                        {msg.at && (
                          <div className="text-xs opacity-75 mt-1">
                            {new Date(msg.at).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={t("adminChat.messagePlaceholder") || "Type a message..."}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim() || !socket}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    {/* @ts-ignore */}
                    <FaPaperPlane className="mr-1" />
                    {t("adminChat.send") || "Send"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div>
                {/* @ts-ignore */}
                <FaGlobe className="mx-auto text-4xl mb-4" />
                <p>{t("adminChat.selectChat") || "Select a chat to begin"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminChat;