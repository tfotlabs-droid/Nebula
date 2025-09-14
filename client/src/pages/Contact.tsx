import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { FaTelegram, FaInstagram, FaVk, FaXTwitter, FaFacebook, FaWhatsapp, FaLinkedinIn, FaYoutube, FaBriefcase, FaCamera, FaGlobe, FaCommentDots, FaRss } from "react-icons/fa6";
import { RiWechat2Fill, RiWeiboFill, RiTiktokFill, RiBilibiliFill, RiLineFill } from "react-icons/ri";

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const email = i18n.language === 'zh' ? 'tfotlabs@qq.com' : 'tfotlabs@gmail.com';
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
          {t('contact.title')} ✉️
        </motion.h2>

        {/* Подзаголовок */}
        <p className="mb-8 text-lg opacity-90">
          {t('contact.subtitle', { email })}
        </p>

        {/* Форма */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <form className="flex flex-col gap-4 text-left">
            <input
              type="text"
              placeholder={t('contact.namePlaceholder')}
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder={t('contact.emailPlaceholder')}
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              rows={4}
              placeholder={t('contact.messagePlaceholder')}
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 py-3 px-6 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold shadow-lg transition"
            >
              {t('contact.submit')}
            </motion.button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mt-10">
          {(() => {
            type SocialPlatform = {
              Icon: React.ComponentType<{ className?: string }>;
              href: string;
              key: string;
              color: string;
            };

            const socialPlatforms: Record<string, SocialPlatform[]> = {
              en: [
                { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
              ] as SocialPlatform[],
              ru: [
                { Icon: FaVk, href: 'https://vk.com/nebula', key: 'vk', color: 'hover:text-blue-600' },
                { Icon: FaTelegram, href: 'https://t.me/nebula', key: 'telegram', color: 'hover:text-blue-400' },
                { Icon: FaRss, href: 'https://zen.yandex.ru/nebula', key: 'yandexzen', color: 'hover:text-orange-400' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' }
              ] as SocialPlatform[],
              es: [
                { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' }
              ] as SocialPlatform[],
              fr: [
                { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
              ] as SocialPlatform[],
              de: [
                { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaBriefcase, href: 'https://xing.com/nebula', key: 'xing', color: 'hover:text-green-400' },
                { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
              ] as SocialPlatform[],
              ja: [
                { Icon: RiLineFill, href: 'https://line.me/nebula', key: 'line', color: 'hover:text-green-400' },
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaYoutube, href: 'https://youtube.com/nebula', key: 'youtube', color: 'hover:text-red-400' }
              ] as SocialPlatform[],
              ko: [
                { Icon: FaCommentDots, href: 'https://kakao.com/nebula', key: 'kakao', color: 'hover:text-yellow-400' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaGlobe, href: 'https://blog.naver.com/nebula', key: 'naver', color: 'hover:text-green-400' },
                { Icon: FaYoutube, href: 'https://youtube.com/nebula', key: 'youtube', color: 'hover:text-red-400' }
              ] as SocialPlatform[],
              ar: [
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaCamera, href: 'https://snapchat.com/nebula', key: 'snapchat', color: 'hover:text-yellow-400' },
                { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' }
              ] as SocialPlatform[],
              he: [
                { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' },
                { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' }
              ] as SocialPlatform[],
              zh: [
                { Icon: RiWechat2Fill, href: 'https://weixin.qq.com/', key: 'wechat', color: 'hover:text-green-500' },
                { Icon: RiWeiboFill, href: 'https://weibo.com/', key: 'weibo', color: 'hover:text-red-500' },
                { Icon: RiTiktokFill, href: 'https://www.douyin.com/', key: 'douyin', color: 'hover:text-orange-500' },
                { Icon: RiBilibiliFill, href: 'https://www.bilibili.com/', key: 'bilibili', color: 'hover:text-purple-500' }
              ] as SocialPlatform[]
            };

            const platforms = socialPlatforms[i18n.language as keyof typeof socialPlatforms] || socialPlatforms.en;

            const isRTL = ['ar', 'he'].includes(i18n.language);
            const spaceClass = isRTL ? 'space-x-reverse space-x-8' : 'space-x-6';

            return (
              <div className={`flex items-center ${spaceClass} text-3xl`}>
                {platforms.map(({ Icon, href, key, color }) => (
                  <a
                    key={key}
                    href={href}
                    aria-label={t(`social.${key}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition"
                  >
                    <Icon className={color} />
                  </a>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default Contact;