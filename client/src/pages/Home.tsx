import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "📊 Трекинг прогресса",
    text: "Следи за своими тренировками и результатами в удобном интерфейсе.",
  },
  {
    title: "🔥 Мотивация",
    text: "Получай достижения, бей рекорды и делись успехами с друзьями.",
  },
  {
    title: "🤝 Сообщество",
    text: "Присоединяйся к комьюнити спортсменов и тренеров, обменивайся опытом.",
  },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-center p-8">
      {/* Hero */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🚀 Добро пожаловать в <span className="text-yellow-300">Nebula</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Спортивное приложение будущего. Твой прогресс. Твоя мотивация. Твоя
        победа.
      </motion.p>

      <motion.div
        className="flex gap-6 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Link
          to="/contact"
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition"
        >
          Связаться с нами
        </Link>
        <a
          href="#features"
          className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          Узнать больше
        </a>
      </motion.div>

      {/* Features */}
      <section
        id="features"
        className="w-full max-w-5xl bg-white text-gray-900 rounded-2xl shadow-2xl p-10"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          🌟 Возможности Nebula
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;