import React from "react";
import { motion } from "framer-motion";
import Download from "./Download";

const Home: React.FC = () => {
  return (
  <div id="home" className="scroll-mt-28">
      {/* Hero */}
      <motion.section
        className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 min-h-[60vh] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white scroll-mt-28"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        style={{ marginTop: 0 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold leading-tight p-0"
          style={{ margin: 0 }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
        >
          🚀 Добро пожаловать в{" "}
          <span className="nebula-smoke inline-block">Nebula</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-sm md:text-lg pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4 }}
        >
          Инновационное спортивное приложение — трансляции, аналитика, комьюнити
          и персональные рекомендации на базе ИИ.
        </motion.p>
      </motion.section>
    </div>
  );
};

export default Home;