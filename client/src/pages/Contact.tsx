import React from "react";
import { motion } from "framer-motion";
import { FaTelegramPlane, FaVk, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="min-h-screen py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white scroll-mt-28"
    >
      <div className="container mx-auto px-6 text-center">
        {/* Заголовок */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          Свяжись с нами ✉️
        </motion.h2>

        {/* Подзаголовок */}
        <p className="mb-8 text-lg opacity-90">
          У тебя есть вопросы или идеи? Мы всегда открыты для общения!
          Напиши нам на{" "}
          <a
            href="mailto:tfotlabs@gmail.com"
            className="text-purple-300 underline hover:text-purple-400 transition"
          >
            tfotlabs@gmail.com
          </a>
        </p>

        {/* Форма */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <form className="flex flex-col gap-4 text-left">
            <input
              type="text"
              placeholder="Ваше имя"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="Ваша почта"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              rows={4}
              placeholder="Ваше сообщение"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 py-3 px-6 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold shadow-lg transition"
            >
              Отправить
            </motion.button>
          </form>
        </div>

        {/* Соцсети */}
        <div className="flex justify-center gap-6 text-3xl mt-10">
          <a
            aria-label="Telegram"
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-300 transition"
          >
            <FaTelegramPlane />
          </a>
          <a
            aria-label="VK"
            href="https://vk.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-300 transition"
          >
            <FaVk />
          </a>
          <a
            aria-label="Instagram"
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-300 transition"
          >
            <FaInstagram />
          </a>
          <a
            aria-label="X"
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-300 transition"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;