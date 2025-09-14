import React from "react";
import { FaTelegram, FaInstagram, FaVk, FaXTwitter, FaFacebook, FaWhatsapp, FaLinkedinIn, FaYoutube, FaBriefcase, FaCamera, FaGlobe, FaCommentDots, FaRss } from "react-icons/fa6";
import { RiLineFill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

const About: React.FC = () => {
  const { t, i18n } = useTranslation();

  const items = t('about.items', { returnObjects: true });

  return (
    <section
      id="about"
      className="min-h-screen pt-24 py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white scroll-mt-28"
    >
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          animate={{ scale: [1, 1.05, 1] }}
        >
          {t('about.title')} <span className="text-purple-300">Nebula</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {Object.values(items).map((item: any, i: number) => (
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