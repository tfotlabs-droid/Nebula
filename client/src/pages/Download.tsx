import React from "react";
import { motion } from "framer-motion";
import { FaApple, FaAndroid, FaWindows, FaLaptop } from "react-icons/fa";

const Download: React.FC = () => {
  return (
    <motion.div
      id="download"
      className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white py-16 px-8 scroll-mt-28"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
      >📲 Скачай Nebula</motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <motion.a
          href="#"
          className="flex items-center justify-center gap-3 bg-white text-purple-600 px-6 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          whileHover={{ scale: 1.07 }}
        >
          <FaApple size={28} /> Скачать для iOS
        </motion.a>
        <motion.a
          href="#"
          className="flex items-center justify-center gap-3 bg-white text-green-600 px-6 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          whileHover={{ scale: 1.07 }}
        >
          <FaAndroid size={28} /> Скачать для Android
        </motion.a>
        <motion.a
          href="#"
          className="flex items-center justify-center gap-3 bg-white text-blue-600 px-6 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          whileHover={{ scale: 1.07 }}
        >
          <FaWindows size={28} /> Скачать для Windows
        </motion.a>
        <motion.a
          href="#"
          className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          whileHover={{ scale: 1.07 }}
        >
          <FaLaptop size={28} /> Скачать для MacOS
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Download;