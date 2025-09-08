// server.js
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
require("dotenv").config();


const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tfotlabs_db_user:Ferger123456@nebula.m3rudui.mongodb.net/nebula?retryWrites=true&w=majority&appName=Nebula";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Mongoose Schemas ---
const ChatMessageSchema = new mongoose.Schema({
  from: { type: String, default: "user" },
  text: String,
  at: { type: Date, default: Date.now },
  chatId: String, // для поддержки нескольких чатов
  ai: Boolean, // true если ответил ИИ
});
const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

const JobApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  telegram: String,
  resume: String,
  createdAt: { type: Date, default: Date.now },
});
const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);


const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// --- WebSocket (socket.io) ---
io.on("connection", (socket) => {
  // Получение истории чата
  socket.on("chat:history", async (chatId) => {
    const msgs = await ChatMessage.find({ chatId }).sort({ at: 1 }).limit(200);
    socket.emit("chat:history", msgs);
  });

  // Получение нового сообщения
  socket.on("chat:message", async (msg) => {
    // msg: { from, text, chatId }
    if (!msg || !msg.text) return;
    const item = await ChatMessage.create({ ...msg, ai: false });
    io.to(socket.id).emit("chat:message", item); // echo to sender
    socket.broadcast.emit("chat:message", item); // send to others (for оператор)

    // --- AI обработка (заглушка) ---
    // Здесь можно интегрировать ИИ-ответ
    if (msg.text.toLowerCase().includes("подписка")) {
      const aiMsg = await ChatMessage.create({
        from: "ai",
        text: "Для подключения подписки открой профиль → Подписки → выбери тариф и оплати картой.",
        chatId: msg.chatId,
        ai: true
      });
      io.to(socket.id).emit("chat:message", aiMsg);
    } else if (msg.text.toLowerCase().includes("оператор")) {
      const aiMsg = await ChatMessage.create({
        from: "ai",
        text: "Сейчас вас соединю с оператором поддержки! Ожидайте ответа.",
        chatId: msg.chatId,
        ai: true
      });
      io.to(socket.id).emit("chat:message", aiMsg);
      // Здесь можно уведомить оператора (например, через отдельный канал)
    } else {
      // Если не знает — предложить эскалацию
      const aiMsg = await ChatMessage.create({
        from: "ai",
        text: "Я не уверен, как ответить. Хотите связаться с оператором? Напишите 'оператор'.",
        chatId: msg.chatId,
        ai: true
      });
      io.to(socket.id).emit("chat:message", aiMsg);
    }
  });
});

// ---------- MIDDLEWARES ----------
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000"], // локально фронт
  })
);

// ---------- PERSISTENCE (файлы) ----------
const DATA_DIR = path.join(__dirname, "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const SUPPORT_FILE = path.join(DATA_DIR, "support.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(JOBS_FILE)) fs.writeFileSync(JOBS_FILE, "[]");
if (!fs.existsSync(SUPPORT_FILE)) fs.writeFileSync(SUPPORT_FILE, "[]");

const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ---------- ROUTES ----------
// healthcheck
app.get("/", (_req, res) => {
  res.send("💫 Nebula API работает");
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// ---- заявки на вакансии ----
app.get("/api/jobs", (_req, res) => {
  const list = readJSON(JOBS_FILE);
  res.json(list);
});

app.post("/api/jobs", (req, res) => {
  const { name, email, phone, telegram, resume } = req.body || {};

  // проверка обязательных полей
  if (!name || !email || !phone || !telegram || !resume) {
    return res.status(400).json({ message: "Заполни все поля." });
  }

  // простая валидация email
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return res.status(400).json({ message: "Некорректный email." });

  const jobs = readJSON(JOBS_FILE);
  const item = {
    id: Date.now(),
    name,
    email,
    phone,
    telegram,
    resume,
    createdAt: new Date().toISOString(),
  };
  jobs.push(item);
  writeJSON(JOBS_FILE, jobs);

  res.status(201).json({ message: "Заявка отправлена!", application: item });
});

// ---- чат поддержки ----
app.get("/api/support", (_req, res) => {
  const msgs = readJSON(SUPPORT_FILE);
  res.json(msgs.slice(-200)); // последние 200 сообщений
});

app.post("/api/support", (req, res) => {
  const { from = "user", text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Пустое сообщение нельзя отправить." });
  }
  const msgs = readJSON(SUPPORT_FILE);
  const item = { id: Date.now(), from, text, at: new Date().toISOString() };
  msgs.push(item);
  writeJSON(SUPPORT_FILE, msgs);
  res.status(201).json({ message: "Принято", item });
});

// ---- 404 для API ----
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Маршрут не найден",
      method: req.method,
      path: req.originalUrl,
    });
  }
  next();
});

// ---- FRONTEND (React build) ----
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// если запрос не совпал с API — отдаём index.html (React Router SPA)
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ---------- START ----------
server.listen(PORT, () => {
  console.log(`🚀 Nebula API слушает http://localhost:${PORT}`);
  console.log(`🛰  WebSocket (socket.io) на ws://localhost:${PORT}`);
});