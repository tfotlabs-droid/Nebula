import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { FaApple, FaAndroid, FaWindows, FaLaptop } from "react-icons/fa";

const Download: React.FC = () => {
  const { t } = useTranslation();
  const [showSub, setShowSub] = useState(false);
  const [selectedOS, setSelectedOS] = useState('');
  return (
    <motion.div
      id="download"
      className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white py-24 px-8 mt-0 scroll-mt-28"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2, once: false }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2, once: false }}
        transition={{ duration: 0.5 }}
      >{t('downloadPage.title')}</motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <motion.button
          onClick={() => {
            console.log('Downloading iOS...');
            alert(t('downloadPage.alert.ios'));
          }}
          className="flex items-center justify-center gap-3 bg-white text-purple-600 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 1 }}
        >
          {/* @ts-ignore */}
          <FaApple size={28} /> {t('downloadPage.platforms.ios')}
        </motion.button>
        <motion.button
          onClick={() => {
            console.log('Downloading Android...');
            alert(t('downloadPage.alert.android'));
          }}
          className="flex items-center justify-center gap-3 bg-white text-green-600 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 1 }}
        >
          {/* @ts-ignore */}
          <FaAndroid size={28} /> {t('downloadPage.platforms.android')}
        </motion.button>
        <motion.button
          onClick={() => {
            setSelectedOS('windows');
            setShowSub(true);
          }}
          className="flex items-center justify-center gap-3 bg-white text-blue-600 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 1 }}
        >
          {/* @ts-ignore */}
          <FaWindows size={28} /> {t('downloadPage.platforms.windows')}
        </motion.button>
        <motion.button
          onClick={() => {
            setSelectedOS('macos');
            setShowSub(true);
          }}
          className="flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 1 }}
        >
          {/* @ts-ignore */}
          <FaLaptop size={28} /> {t('downloadPage.platforms.macos')}
        </motion.button>
      </div>
      {showSub && (
        <motion.div
          className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">
            {selectedOS === 'windows' ? t('downloadPage.windows.select') : t('downloadPage.macos.select')}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {selectedOS === 'windows' ? (
              <>
                <motion.button
                  onClick={() => {
                    console.log('Downloading Windows x86...');
                    alert(t('downloadPage.alert.windows.x86'));
                    setShowSub(false);
                  }}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  {t('downloadPage.windows.x86')}
                </motion.button>
                <motion.button
                  onClick={() => {
                    console.log('Downloading Windows x64...');
                    alert(t('downloadPage.alert.windows.x64'));
                    setShowSub(false);
                  }}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  {t('downloadPage.windows.x64')}
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => {
                    console.log('Downloading MacOS Intel...');
                    alert(t('downloadPage.alert.macos.intel'));
                    setShowSub(false);
                  }}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  {t('downloadPage.macos.intel')}
                </motion.button>
                <motion.button
                  onClick={() => {
                    console.log('Downloading MacOS Apple M...');
                    alert(t('downloadPage.alert.macos.appleM'));
                    setShowSub(false);
                  }}
                  className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  {t('downloadPage.macos.appleM')}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Download;