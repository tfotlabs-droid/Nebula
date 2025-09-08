import React from "react";
import { motion } from "framer-motion";

const mockStreams = [
  {
    title: "⚽ Лига Чемпионов: Реал Мадрид vs Барселона",
    viewers: "24.5K зрителей",
    thumbnail:
      "https://source.unsplash.com/800x450/?football,stadium",
  },
  {
    title: "🏀 NBA: Lakers vs Celtics",
    viewers: "18.2K зрителей",
    thumbnail:
      "https://source.unsplash.com/800x450/?basketball,court",
  },
  {
    title: "🏒 Хоккей: Россия vs Канада",
    viewers: "15.7K зрителей",
    thumbnail:
      "https://source.unsplash.com/800x450/?hockey,ice",
  },
];

const Streams: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🔴 Прямые трансляции
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockStreams.map((stream, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
          >
            <img
              src={stream.thumbnail}
              alt={stream.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{stream.title}</h2>
              <p className="text-sm text-gray-400">{stream.viewers}</p>
              <button className="mt-4 w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-300 transition">
                Смотреть
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Streams;