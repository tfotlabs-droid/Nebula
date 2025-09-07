import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";

const About: React.FC = () => {
  const cards = [
    {
      icon: <FaRocket size={40} className="text-purple-400 mb-4 mx-auto" />,
      title: "Миссия",
      text: "Мы стремимся вдохновлять и создавать инновационные решения для мира.",
      delay: 0.2,
    },
    {
      icon: <FaUsers size={40} className="text-blue-400 mb-4 mx-auto" />,
      title: "Команда",
      text: "Наша команда объединяет энтузиастов, специалистов и мечтателей.",
      delay: 0.4,
    },
    {
      icon: <FaLightbulb size={40} className="text-yellow-400 mb-4 mx-auto" />,
      title: "Идеи",
      text: "Мы верим, что каждая идея может изменить мир, если воплотить её в жизнь.",
      delay: 0.6,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.h2
        className="text-4xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        О нас
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: card.delay }}
            whileHover={{ scale: 1.05 }}
          >
            {card.icon}
            <h3 className="text-xl font-semibold mb-2 text-center">{card.title}</h3>
            <p className="text-gray-400 text-center">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
