import React from "react";
import { motion } from "framer-motion";

const aboutItems = [
  {
    title: "📊 Трансляции & Аналитика",
    text: "Лайв-скоры, пред- и пост-матчевая аналитика ИИ, интересные факты и озвучка для слабослышащих и слабовидящих.",
  },
  {
    title: "🤝 Комьюнити",
    text: "Комнаты просмотра, чаты, голосовые сообщения, ивенты и локальные сходки фанатов.",
  },
  {
    title: "🛎️ Сервисы",
    text: "Заказ еды, такси и билетов — ИИ подберёт оптимальные варианты под матч и место.",
  },
  {
    title: "💡 Персонализация",
    text: "ИИ формирует рекомендации по тренировкам и питанию на основе твоих целей.",
  },
  {
    title: "🎧 Поддержка доступности",
    text: "Озвучка событий и адаптация интерфейса для слабослышащих и слабовидящих.",
  },
  {
    title: "🌍 Социальные функции",
    text: "Создание сообществ, локальные встречи фанатов и интеграция с соцсетями.",
  },
];

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="min-h-screen pt-24 py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white scroll-mt-28"
    >
      <div className="container mx-auto px-6">
        {/* Заголовок с анимацией */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          animate={{ scale: [1, 1.05, 1] }}
        >
          О <span className="text-purple-300">Nebula</span>
        </motion.h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto text-center mb-12 opacity-90">
          <span className="font-semibold text-purple-300">Nebula</span> — это
          инновационный спортивный хаб 🚀 Мы объединяем трансляции, умную
          аналитику на базе ИИ, персональные тренировки, подбор питания и
          социальные функции. Всё в одном приложении.
        </p>

        {/* Карточки */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {aboutItems.map((item, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white/10 rounded-xl shadow-lg border border-white/10 hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.15 }}
            >
              <h3 className="font-semibold text-lg mb-3 text-purple-300">
                {item.title}
              </h3>
              <p className="text-sm md:text-base opacity-90">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;