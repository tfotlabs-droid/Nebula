// backend/server.js
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const YandexStrategy = require('passport-yandex').Strategy;

const axios = require('axios');

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// ---------- CONFIG ----------
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://tfotlabs_db_user:<Ferger123456>@nebula.m3rudui.mongodb.net/?retryWrites=true&w=majority&appName=Nebula";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000"], methods: ["GET", "POST"] },
});
const PORT = process.env.PORT || 5000;

// ---------- SCHEMAS ----------
const ChatMessageSchema = new mongoose.Schema({
  from: { type: String, default: "user" },
  text: String,
  at: { type: Date, default: Date.now },
  chatId: String,
  ai: Boolean,
  type: { type: String, default: "text" },
  url: String,
});
const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  userId: String,
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,
});
const Chat = mongoose.model("Chat", ChatSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_country: { type: String, default: '' },
  language: { type: String, default: 'en' },
  payment_method: { type: String, default: 'stripe' },
  currency: { type: String, default: 'USD' },
  subscription: {
    type: String, // e.g. 'basic', 'premium', etc.
    default: 'none'
  },
  subscription_status: { type: String, default: 'free' },
  subscriptionEnd: Date,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const SubscriptionSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  description: String,
});
const Subscription = mongoose.model("Subscription", SubscriptionSchema);

const getCountryConfig = (country) => {
  const upper = country.toUpperCase();
  const map = {
    'RU': { currency: 'RUB', payment_method: 'robokassa', language: 'ru' },
    'US': { currency: 'USD', payment_method: 'stripe', language: 'en' },
    'GB': { currency: 'GBP', payment_method: 'stripe', language: 'en' },
    'FR': { currency: 'EUR', payment_method: 'stripe', language: 'fr' },
    'DE': { currency: 'EUR', payment_method: 'stripe', language: 'de' },
    'ES': { currency: 'EUR', payment_method: 'stripe', language: 'es' },
    'CN': { currency: 'CNY', payment_method: 'stripe', language: 'zh' },
    'CA': { currency: 'CAD', payment_method: 'stripe', language: 'en' },
    'MX': { currency: 'MXN', payment_method: 'stripe', language: 'es' },
  };
  const base = map[upper] || { currency: 'USD', payment_method: 'stripe', language: 'en' };
  return { country: upper, ...base };
};

// Seed tariffs if not exist
const tariffs = [
  { id: 'basic', name: 'Basic', price: 990, description: 'Базовый доступ' },
  { id: 'standard', name: 'Standard', price: 2990, description: 'Расширенный доступ' },
  { id: 'premium', name: 'Premium', price: 3990, description: 'Премиум функции' },
  { id: 'pro', name: 'Pro', price: 5990, description: 'Профессиональный план' },
  { id: 'elite', name: 'Elite', price: 7990, description: 'Элитный план' },
  { id: 'ultimate', name: 'Ultimate', price: 16990, description: 'Полный доступ' },
];
Subscription.findOne().then((doc) => {
  if (!doc) {
    Subscription.insertMany(tariffs);
  }
});

// Passport strategies
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({ email: profile.emails[0].value });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID,
  teamID: process.env.APPLE_TEAM_ID,
  clientSecret: process.env.APPLE_CLIENT_SECRET,
  callbackURL: "/auth/apple/callback",
  scope: 'email'
}, async (accessToken, refreshToken, id, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({ email: profile.email });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new VKontakteStrategy({
  clientID: process.env.VK_CLIENT_ID,
  clientSecret: process.env.VK_CLIENT_SECRET,
  callbackURL: "/auth/vk/callback",
  profileFields: ['email']
}, async (accessToken, refreshToken, params, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails ? profile.emails[0].value : params.email });
    if (!user) {
      user = new User({ email: profile.emails ? profile.emails[0].value : params.email });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new YandexStrategy({
  clientID: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  callbackURL: "/auth/yandex/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({ email: profile.emails[0].value });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// ---------- SOCKET.IO ----------
io.on("connection", (socket) => {
  console.log("🟢 Новый клиент:", socket.id);

  // оператор подключился
  socket.on("operator:join", () => {
    socket.join("operators");
    console.log("👨‍💻 оператор:", socket.id);
  });

  // пользователь/оператор подключается к чату
  socket.on("chat:join", async (chatId) => {
    try {
      socket.join(`chat:${chatId}`);
      const msgs = await ChatMessage.find({ chatId }).sort({ at: 1 }).limit(500);
      socket.emit("chat:history", msgs);

      // Если история пуста, отправляем приветствие ИИ
      if (msgs.length === 0) {
        const welcomeMsg = await ChatMessage.create({
          from: "ai",
          text: "Привет! Я ИИ-помощник Nebula. Как могу помочь?\n\nВозможные темы:\n• Подписка и оплата\n• Скачивание приложения\n• Вакансии\n• Проблемы со стримами\n• Общие вопросы\n\nОпишите вашу проблему!",
          chatId: chatId,
          ai: true,
        });
        io.to(`chat:${chatId}`).emit("chat:message", welcomeMsg);
        console.log(`[${chatId}] AI: Приветствие отправлено`);
      }
    } catch (err) {
      console.error("Ошибка chat:join", err);
    }
  });

  // новое сообщение
  socket.on("chat:message", async (msg) => {
    try {
      if (!msg || !msg.text) return;
 
      let chat = await Chat.findOne({ chatId: msg.chatId });
      if (!chat) {
        chat = await Chat.create({ chatId: msg.chatId });
      }
 
      const wasClosed = chat.status === "closed";
 
      const item = await ChatMessage.create({
        from: msg.from || "user",
        text: msg.text,
        chatId: msg.chatId,
        at: msg.at ? new Date(msg.at) : new Date(),
        ai: !!msg.ai,
        type: msg.type || "text",
        url: msg.url || null,
      });
 
      // Если чат был закрыт, переоткрываем его и отправляем AI-приветствие
      if (wasClosed) {
        chat.status = "open";
        await chat.save();
 
        const aiWelcomeMsg = await ChatMessage.create({
          from: "ai",
          text: "Привет! Диалог был закрыт оператором, но я готов помочь снова. Что вас беспокоит?\n\nВозможные темы:\n• Подписка и оплата (доступно в РФ, скоро международный запуск)\n• Скачивание приложения\n• Вакансии и резюме\n• Проблемы со стримами\n• Общие вопросы о Nebula\n\nОпишите проблему подробнее!",
          chatId: msg.chatId,
          ai: true,
        });
 
        io.to(`chat:${msg.chatId}`).emit("chat:message", aiWelcomeMsg);
      }
 
      // отправляем только в комнату чата (юзер + оператор, подключённые к этому чату)
      io.to(`chat:${msg.chatId}`).emit("chat:message", item);

      // Если сообщение от пользователя, генерируем ответ ИИ
      if (item.from === "user") {
        const userText = item.text.toLowerCase();
        let aiResponse = "Спасибо за сообщение! Я передам его оператору. Если у вас есть срочный вопрос, опишите подробнее.";
    
        // Сначала проверяем на отмену передачи оператору
        if (userText.includes("вернись") || userText.includes("отмена") || userText.includes("cancel") || userText.includes("отменить") || userText.includes("back") || userText.includes("к боту") || userText.includes("ai only") || userText.includes("отменить оператора")) {
          aiResponse = "Хорошо, я снова с вами! Диалог с оператором отменён. Чем могу помочь дальше?";
        } else if (userText.includes("привет") || userText.includes("здравствуй") || userText.includes("hello") || userText.includes("hi")) {
          aiResponse = "Привет! Рад вас видеть в Nebula. Чем могу помочь с приложением?";
        } else if (userText.includes("скачать") || userText.includes("скачивание") || userText.includes("download") || userText.includes("где найти") || userText.includes("установить") || userText.includes("app") || userText.includes("приложение") || userText.includes("ios") || userText.includes("android") || userText.includes("windows") || userText.includes("macos") || userText.includes("intel") || userText.includes("apple m") || userText.includes("установка") || userText.includes("инсталл") || userText.includes("загрузить") || userText.includes("get app") || userText.includes("mobile app") || userText.includes("desktop app") || userText.includes("программа") || userText.includes("software") || userText.includes("apk") || userText.includes("ipa") || userText.includes("exe") || userText.includes("dmg") || userText.includes("где скачать") || userText.includes("link to download") || userText.includes("install guide") || userText.includes("how to install") || userText.includes("app store") || userText.includes("play store") || userText.includes("microsoft store") || userText.includes("mac app store") || userText.includes("nebula app") || userText.includes("nebula download") || userText.includes("version") || userText.includes("update app") || userText.includes("latest version") || userText.includes("beta") || userText.includes("release") || userText.includes("setup") || userText.includes("run") || userText.includes("launch") || userText.includes("mobile") || userText.includes("desktop") || userText.includes("pc") || userText.includes("mac") || userText.includes("phone") || userText.includes("tablet")) {
          const linkMsg = {
            from: "ai",
            type: "link",
            text: "Перейдите в раздел Скачать",
            url: "/download",
            chatId: msg.chatId,
            at: new Date().toISOString(),
            ai: true,
          };
          const item = await ChatMessage.create(linkMsg);
          io.to(`chat:${msg.chatId}`).emit("chat:message", item);
          console.log(`[${msg.chatId}] AI: Link to download`);
          return;
        } else if (userText.includes("подписка") || userText.includes("оплата") || userText.includes("buy") || userText.includes("покупка") || userText.includes("цен") || userText.includes("стоимость")) {
          aiResponse = "Подписка Nebula: 499₽/мес (РФ, скоро международно). Включает стримы, AI, премиум. Оплатить картой в приложении. Проблемы с оплатой? Укажите детали.";
        } else if (userText.includes("вакансия") || userText.includes("работа") || userText.includes("job") || userText.includes("резюме") || userText.includes("карьера") || userText.includes("найм") || userText.includes("работа в nebula") || userText.includes("employment") || userText.includes("hire") || userText.includes("career") || userText.includes("positions") || userText.includes("openings") || userText.includes("vacancy") || userText.includes("job opening") || userText.includes("apply") || userText.includes("отклик") || userText.includes("соискатель") || userText.includes("hr") || userText.includes("recruitment") || userText.includes("staff") || userText.includes("team") || userText.includes("join team") || userText.includes("работать") || userText.includes("зарплата") || userText.includes("условия") || userText.includes("интервью") || userText.includes("frontend") || userText.includes("backend") || userText.includes("devops") || userText.includes("designer") || userText.includes("engineer") || userText.includes("developer") || userText.includes("programmer") || userText.includes("software engineer") || userText.includes("ml") || userText.includes("ai") || userText.includes("data scientist") || userText.includes("mobile dev") || userText.includes("react") || userText.includes("node") || userText.includes("python") || userText.includes("fullstack") || userText.includes("internship") || userText.includes("стажировка") || userText.includes("junior") || userText.includes("senior") || userText.includes("lead") || userText.includes("manager") || userText.includes("community")) {
          const linkMsg = {
            from: "ai",
            type: "link",
            text: "Перейдите в раздел Вакансии",
            url: "/jobs",
            chatId: msg.chatId,
            at: new Date().toISOString(),
            ai: true,
          };
          const item = await ChatMessage.create(linkMsg);
          io.to(`chat:${msg.chatId}`).emit("chat:message", item);
          console.log(`[${msg.chatId}] AI: Link to jobs`);
          return;
        } else if (userText.includes("стрим") || userText.includes("трансляция") || userText.includes("stream") || userText.includes("watch") || userText.includes("матч") || userText.includes("футбол") || userText.includes("баскетбол")) {
          aiResponse = "Стримы в Nebula: футбол, баскетбол, live. Проблемы? Проверьте интернет (минимум 5Mbps), обновите app. Укажите матч или ошибку для помощи.";
        } else if (userText.includes("помощь") || userText.includes("проблема") || userText.includes("help") || userText.includes("issue") || userText.includes("ошибка") || userText.includes("не работает")) {
          aiResponse = "Опишите проблему подробнее: что не работает (скачивание, стрим, подписка)? Я помогу или подключу оператора.";
        } else if (userText.includes("о нас") || userText.includes("о вас") || userText.includes("about") || userText.includes("компания") || userText.includes("nebula что") || userText.includes("о nebula") || userText.includes("что nebula") || userText.includes("who we are") || userText.includes("кто мы") || userText.includes("информация") || userText.includes("info") || userText.includes("history") || userText.includes("история") || userText.includes("mission") || userText.includes("миссия") || userText.includes("vision") || userText.includes("team") || userText.includes("команда") || userText.includes("founders") || userText.includes("основатели") || userText.includes("product") || userText.includes("продукт") || userText.includes("services") || userText.includes("услуги") || userText.includes("features") || userText.includes("функции") || userText.includes("what is nebula") || userText.includes("что такое nebula") || userText.includes("nebula app") || userText.includes("о проекте") || userText.includes("project") || userText.includes("startup") || userText.includes("company info") || userText.includes("profile") || userText.includes("официальный сайт") || userText.includes("official") || userText.includes("overview") || userText.includes("обзор") || userText.includes("description") || userText.includes("описание") || userText.includes("background") || userText.includes("фон") || userText.includes("story") || userText.includes("история компании") || userText.includes("corporate") || userText.includes("бизнес") || userText.includes("enterprise") || userText.includes("brand") || userText.includes("о компании") || userText.includes("компания nebula") || userText.includes("nebula company") || userText.includes("что за nebula") || userText.includes("зачем nebula") || userText.includes("для чего nebula") || userText.includes("инфо nebula") || userText.includes("nebula info") || userText.includes("о небула") || userText.includes("небула") || userText.includes("about us") || userText.includes("us") || userText.includes("мы") || userText.includes("developers") || userText.includes("разработчики") || userText.includes("creator") || userText.includes("создатель") || userText.includes("origin") || userText.includes("происхождение")) {
          const linkMsg = {
            from: "ai",
            type: "link",
            text: "Перейдите в раздел О нас",
            url: "/about",
            chatId: msg.chatId,
            at: new Date().toISOString(),
            ai: true,
          };
          const item = await ChatMessage.create(linkMsg);
          io.to(`chat:${msg.chatId}`).emit("chat:message", item);
          console.log(`[${msg.chatId}] AI: Link to about`);
          return;
        } else if (userText.includes("контакты") || userText.includes("contact") || userText.includes("email") || userText.includes("поддержка") || userText.includes("support") || userText.includes("help") || userText.includes("помощь") || userText.includes("feedback") || userText.includes("обратная связь") || userText.includes("пишите") || userText.includes("write") || userText.includes("address") || userText.includes("адрес") || userText.includes("phone") || userText.includes("телефон") || userText.includes("call") || userText.includes("звонок") || userText.includes("social") || userText.includes("социальные сети") || userText.includes("telegram") || userText.includes("twitter") || userText.includes("instagram") || userText.includes("vk") || userText.includes("youtube") || userText.includes("location") || userText.includes("где мы") || userText.includes("office") || userText.includes("офис") || userText.includes("map") || userText.includes("карта") || userText.includes("faq") || userText.includes("вопросы") || userText.includes("answers") || userText.includes("report") || userText.includes("жалоба") || userText.includes("bug") || userText.includes("issue") || userText.includes("problem") || userText.includes("complaint") || userText.includes("suggestion") || userText.includes("предложение") || userText.includes("idea") || userText.includes("идея") || userText.includes("reach out") || userText.includes("get in touch") || userText.includes("connect") || userText.includes("communication") || userText.includes("channel") || userText.includes("канал")) {
          const linkMsg = {
            from: "ai",
            type: "link",
            text: "Перейдите в раздел Контакты",
            url: "/contact",
            chatId: msg.chatId,
            at: new Date().toISOString(),
            ai: true,
          };
          const item = await ChatMessage.create(linkMsg);
          io.to(`chat:${msg.chatId}`).emit("chat:message", item);
          console.log(`[${msg.chatId}] AI: Link to contact`);
          return;
        } else if (userText.includes("домой") || userText.includes("главная") || userText.includes("home") || userText.includes("начало") || userText.includes("main") || userText.includes("start") || userText.includes("welcome") || userText.includes("приветствие") || userText.includes("landing") || userText.includes("overview") || userText.includes("обзор") || userText.includes("index") || userText.includes("root") || userText.includes("front page") || userText.includes("homepage") || userText.includes("начало работы") || userText.includes("get started") || userText.includes("demo") || userText.includes("показать") || userText.includes("show me") || userText.includes("what is this") || userText.includes("что это") || userText.includes("tour") || userText.includes("экскурсия") || userText.includes("intro") || userText.includes("introduction") || userText.includes("dashboard") || userText.includes("панель") || userText.includes("main menu") || userText.includes("меню") || userText.includes("navigate") || userText.includes("навигация") || userText.includes("back to home") || userText.includes("вернуться") || userText.includes("reset") || userText.includes("очистить") || userText.includes("fresh start") || userText.includes("новый") || userText.includes("first page") || userText.includes("первая страница") || userText.includes("site map") || userText.includes("карта сайта") || userText.includes("browse") || userText.includes("просмотр") || userText.includes("explore") || userText.includes("исследовать") || userText.includes("main site") || userText.includes("сайт") || userText.includes("web") || userText.includes("веб")) {
          const linkMsg = {
            from: "ai",
            type: "link",
            text: "Перейдите на главную страницу",
            url: "/",
            chatId: msg.chatId,
            at: new Date().toISOString(),
            ai: true,
          };
          const item = await ChatMessage.create(linkMsg);
          io.to(`chat:${msg.chatId}`).emit("chat:message", item);
          console.log(`[${msg.chatId}] AI: Link to home`);
          return;
        }

        const aiMsg = await ChatMessage.create({
          from: "ai",
          text: aiResponse,
          chatId: msg.chatId,
          ai: true,
        });

        io.to(`chat:${msg.chatId}`).emit("chat:message", aiMsg);
        console.log(`[${msg.chatId}] AI: ${aiResponse.substring(0, 50)}...`);
      }

      // логируем
      console.log(`[${msg.chatId}] ${item.from}: ${item.text}`);
    } catch (err) {
      console.error("Ошибка chat:message", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 клиент отключён:", socket.id);
  });
});

// ---------- MIDDLEWARES ----------
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// ---------- FILE STORAGE ----------
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
// health
app.get("/", (_req, res) => res.send("💫 Nebula API работает"));
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ts: Date.now() })
);

// список чатов
app.get("/api/chats", async (_req, res) => {
  const list = await Chat.find().sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

// сообщения чата
app.get("/api/chats/:chatId/messages", async (req, res) => {
  const msgs = await ChatMessage.find({ chatId: req.params.chatId })
    .sort({ at: 1 })
    .limit(1000);
  res.json(msgs);
});

// закрыть чат
app.post("/api/chats/:chatId/close", async (req, res) => {
  const chat = await Chat.findOne({ chatId: req.params.chatId });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  chat.status = "closed";
  const chatId = req.params.chatId;
  io.to(`chat:${chatId}`).emit("chat:closed", { chatId });
  io.to("operators").emit("chat:closed", { chatId });
  chat.closedAt = new Date();
  await chat.save();
  res.json({ message: "Closed" });
});

// вакансии
app.get("/api/jobs", (_req, res) => res.json(readJSON(JOBS_FILE)));
app.post("/api/jobs", (req, res) => {
  const { name, email, phone, telegram, resume } = req.body || {};
  if (!name || !email || !phone || !telegram || !resume) {
    return res.status(400).json({ message: "Заполни все поля." });
  }
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

// fallback чат (файловый)
app.get("/api/support", (_req, res) => {
  const msgs = readJSON(SUPPORT_FILE);
  res.json(msgs.slice(-200));
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

// Country detection endpoint
app.get("/api/detect-country", async (req, res) => {
  try {
    let ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip === '::1' || ip === '127.0.0.1') ip = '8.8.8.8'; // test IP
    const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    const country = geoResponse.data.country_code;
    const config = getCountryConfig(country);
    res.json({ country, ...config });
  } catch (err) {
    console.error('Geolocation error:', err);
    res.status(500).json({ error: 'Unable to detect country' });
  }
});

// Payment config by country
app.get("/api/payment-config/:country", (req, res) => {
  const config = getCountryConfig(req.params.country);
  res.json(config);
});

// Update user language
app.post("/api/user/language", authenticateToken, async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: 'Language required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.language = language;
    await user.save();
    res.json({ message: 'Language updated', user: { language: user.language } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Translation endpoint for AdminChat
app.post('/api/translate', async (req, res) => {
  try {
    const { text, fromLang = 'auto', toLang = 'en' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    // Mock translation for demo (replace with real API like Google Translate)
    const mockTranslations = {
      'ru': {
        'привет': 'Hello',
        'спасибо': 'Thank you',
        'помощь': 'Help',
        'скачать': 'Download',
        'подписка': 'Subscription',
        'вакансия': 'Job',
        default: text // No translation if no key
      },
      'ja': {
        'こんにちは': 'Hello',
        'ありがとう': 'Thank you',
        default: text
      },
      // Add more languages as needed
    };

    let detectedLang = fromLang;
    let translatedText = text;

    if (fromLang === 'auto') {
      // Simple lang detection based on text (mock)
      if (text.includes('привет') || text.includes('спасибо')) detectedLang = 'ru';
      else if (text.includes('こんにちは')) detectedLang = 'ja';
      else detectedLang = 'en';
    }

    // Mock translation
    if (detectedLang !== 'en') {
      translatedText = mockTranslations[detectedLang]?.[text.toLowerCase()] || text;
    }

    res.json({ translatedText, detectedLang });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Serve i18n JSON for dynamic loading if needed (optional, since static in frontend)
app.get("/api/i18n/:lang", (req, res) => {
  const lang = req.params.lang;
  const filePath = path.join(__dirname, '../client/src/locales', lang, 'common.json');
  try {
    if (fs.existsSync(filePath)) {
      res.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    } else {
      res.status(404).json({ error: 'Language not found' });
    }
  } catch (err) {
    console.error('i18n serve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// For existing users without language field (Mongoose auto-adds, but to set default):
// User.updateMany({}, { $setOnInsert: { language: 'en' } }); // Run once if needed

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, user_country, language, payment_method, currency } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    let config;
    if (!user_country) {
      // Auto detect
      let ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (ip === '::1' || ip === '127.0.0.1') ip = '8.8.8.8';
      const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
      const country = geoResponse.data.country_code;
      config = getCountryConfig(country);
    } else {
      config = getCountryConfig(user_country);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      user_country: config.country,
      language: language || config.language,
      payment_method: payment_method || config.payment_method,
      currency: currency || config.currency
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email,
        user_country: user.user_country,
        language: user.language,
        payment_method: user.payment_method,
        currency: user.currency
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверные данные" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверные данные" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  res.redirect(`http://localhost:3000/auth/success?token=${token}&email=${req.user.email}`);
});

app.get('/auth/apple', passport.authenticate('apple', { scope: 'email' }));
app.get('/auth/apple/callback', passport.authenticate('apple', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  res.redirect(`http://localhost:3000/auth/success?token=${token}&email=${req.user.email}`);
});

app.get('/auth/vk', passport.authenticate('vkontakte', { scope: ['email'] }));
app.get('/auth/vk/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  res.redirect(`http://localhost:3000/auth/success?token=${token}&email=${req.user.email}`);
});

app.get('/auth/yandex', passport.authenticate('yandex', { scope: ['login:email'] }));
app.get('/auth/yandex/callback', passport.authenticate('yandex', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  res.redirect(`http://localhost:3000/auth/success?token=${token}&email=${req.user.email}`);
});

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  req.session.destroy();
  res.redirect('http://localhost:3000');
});

// 404 для API
app.post('/api/create-robokassa-payment', authenticateToken, async (req, res) => {
  try {
    const { subId } = req.body;
    if (!subId) {
      return res.status(400).json({ error: 'subId required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.subscription === subId) {
      return res.status(400).json({ error: 'Already subscribed to this plan' });
    }

    const prices = {
      basic: 990,
      pro: 2990,
      premium: 3990,
      elite: 5990,
      vip: 7990,
      ultimate: 16990
    };

    const outSum = prices[subId];
    const invId = Date.now().toString(); // Simple unique ID
    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN || '';
    const password1 = process.env.ROBOKASSA_PASSWORD1 || '';

    const signatureString = `${merchantLogin}:${outSum}:${invId}:${password1}`;
    const signatureValue = crypto.createHash('md5').update(signatureString).digest('hex').toUpperCase();

    const formHtml = `
      <html>
        <body>
          <form method="POST" action="https://auth.robokassa.ru/Merchant/Index.aspx">
            <input type="hidden" name="MrchLogin" value="${merchantLogin}">
            <input type="hidden" name="OutSum" value="${outSum}">
            <input type="hidden" name="InvId" value="${invId}">
            <input type="hidden" name="Desc" value="Подписка Nebula ${subId}">
            <input type="hidden" name="SignatureValue" value="${signatureValue}">
            <input type="hidden" name="Shp_userId" value="${user._id}">
            <input type="hidden" name="Shp_subId" value="${subId}">
            <input type="hidden" name="IsTest" value="1">
            <input type="submit" value="Перейти к оплате">
          </form>
          <script>document.forms[0].submit();</script>
        </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    res.send(formHtml);
  } catch (error) {
    console.error('Robokassa error:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
});

// Create Stripe payment (test mode)
app.post('/api/create-stripe-payment', authenticateToken, async (req, res) => {
  try {
    const { subId } = req.body;
    if (!subId) {
      return res.status(400).json({ error: 'subId required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.subscription === subId) {
      return res.status(400).json({ error: 'Already subscribed to this plan' });
    }

    // Test prices in cents (adjust for currency)
    const prices = {
      basic: 1000, // ~10 USD/EUR etc.
      standard: 3000,
      premium: 4000,
      pro: 6000,
      elite: 8000,
      ultimate: 17000
    };
    const amount = prices[subId] || 1000;

    // Use user currency if supported by Stripe (no RUB)
    const currency = user.currency === 'RUB' ? 'usd' : user.currency.toLowerCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: `Nebula ${subId} Subscription (Test)`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment', // Test one-time payment; for real subscriptions, use 'subscription' and price_id
      success_url: 'http://localhost:3000/profile?success=true',
      cancel_url: 'http://localhost:3000/profile?cancel=true',
      metadata: {
        userId: user._id.toString(),
        subId,
      },
    });

    // Comment: For real payments, implement Stripe webhooks to update user.subscription and subscription_status to 'active'
    // Webhook endpoint: POST /api/stripe-webhook, verify signature, handle 'checkout.session.completed'

    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
});

app.get('/payment/result', async (req, res) => {
  try {
    const { OutSum, InvId, SignatureValue, Shp_userId, Shp_subId, Status } = req.query;
    if (!OutSum || !InvId || !SignatureValue || !Shp_userId || !Shp_subId || Status !== 'Success') {
      return res.redirect('http://localhost:3000/profile?cancel=true');
    }

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN || '';
    const password2 = process.env.ROBOKASSA_PASSWORD2 || '';
    const signatureString = `${merchantLogin}:${OutSum}:${InvId}:${Status}:${password2}`;
    const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex').toUpperCase();

    if (SignatureValue !== expectedSignature) {
      console.error('Invalid signature');
      return res.redirect('http://localhost:3000/profile?cancel=true');
    }

    const user = await User.findById(Shp_userId);
    if (user) {
      user.subscription = Shp_subId;
      await user.save();
    }

    res.redirect('http://localhost:3000/profile?success=true');
  } catch (error) {
    console.error('Result handling error:', error);
    res.redirect('http://localhost:3000/profile?cancel=true');
  }
});

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

// ---------- FRONTEND ----------
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));
app.get("*", (_req, res) =>
  res.sendFile(path.join(clientBuildPath, "index.html"))
);

// ---------- START ----------
server.listen(PORT, () => {
  console.log(`🚀 Nebula API слушает http://localhost:${PORT}`);
  console.log(`🛰 WebSocket на ws://localhost:${PORT}`);
});