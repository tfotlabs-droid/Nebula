import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
  <div id="home" className="scroll-mt-28">
      {/* Hero */}
      <motion.section
        className="flex flex-col items-center justify-center text-center px-6 h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white scroll-mt-28"
        initial={{ opacity: 1, y: 40 }}
        whileInView={{ y: 0 }}
        viewport={{ amount: 0.2, once: false }}
        transition={{ duration: 0.5 }}
        style={{ marginTop: 0 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold leading-tight p-0"
          style={{ margin: 0 }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ duration: 0.5 }}
        >
          🚀 {t('welcome')} <span className="nebula-smoke inline-block">Nebula</span>
        </motion.h1>

        {/* Features */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 mt-6 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="text-lg md:text-xl p-4 bg-white/10 rounded-xl backdrop-blur-sm text-center min-w-[140px] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            📺 {t('streams')}
          </motion.div>
          <motion.div
            className="text-lg md:text-xl p-4 bg-white/10 rounded-xl backdrop-blur-sm text-center min-w-[140px] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            📊 {t('analytics')}
          </motion.div>
          <motion.div
            className="text-lg md:text-xl p-4 bg-white/10 rounded-xl backdrop-blur-sm text-center min-w-[140px] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            👥 {t('community')}
          </motion.div>
          <motion.div
            className="text-lg md:text-xl p-4 bg-white/10 rounded-xl backdrop-blur-sm text-center min-w-[140px] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            🤖 {t('ai_recommendations')}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;