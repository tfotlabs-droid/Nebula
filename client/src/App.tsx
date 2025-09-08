import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Download from "./pages/Download"; // ✅ добавили
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import SupportChat from "./components/SupportChat";
import TestApi from "./TestApi"; // ✅ тест API

// 😅 Страница 404 с API статусом
const NotFound: React.FC = () => {
  const [apiMessage, setApiMessage] = useState<string>("Загрузка...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка ответа сервера");
        return res.json();
      })
      .then((data) => {
        setApiMessage(`✅ API ответило: ok=${data.ok ? "Да" : "Нет"}, ts=${data.ts}`);
      })
      .catch((e) => {
        setApiMessage("❌ Ошибка запроса к API: " + (e?.message || e));
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <h1 className="text-7xl font-extrabold mb-6">404</h1>
      <p className="text-xl mb-4">Ой! Ты заблудился во вселенной Nebula 🚀</p>
      <p className="mb-6">Такой страницы нет… наверное, её украли инопланетяне 👽</p>
      <p className="mb-4 text-sm text-indigo-300">{apiMessage}</p>
      <a
        href="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
      >
        Вернуться домой 🏠
      </a>
    </div>
  );
};

// ✅ Главная лэндинг-страница (всё склеено в один скролл)
const Landing: React.FC = () => {
  return (
    <>
      <Home />
      <Download /> {/* сразу после приветствия */}
      <About />
      <Contact />
      <Jobs />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
  <main className="flex-grow pt-28">
          <Routes>
            {/* ⬅️ Главная теперь включает все секции подряд */}
            <Route path="/" element={<Landing />} />

            {/* Тест API отдельным роутом */}
            <Route path="/test" element={<TestApi />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <SupportChat /> {/* ✅ чат поддержки всегда на экране */}
      </div>
    </Router>
  );
};

export default App;