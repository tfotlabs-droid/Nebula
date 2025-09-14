import React, { useState } from "react";
import { FaTelegram, FaInstagram, FaVk, FaXTwitter, FaFacebook, FaWhatsapp, FaLinkedinIn, FaYoutube, FaBriefcase, FaCamera, FaGlobe, FaCommentDots, FaRss } from "react-icons/fa6";
import { RiWechat2Fill, RiWeiboFill, RiTiktokFill, RiBilibiliFill, RiLineFill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import type { IconType } from 'react-icons';
import logo from "../assets/nebula.png";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', emoji: '🇺🇸 / 🇬🇧' },
    { code: 'ru', name: 'Русский', emoji: '🇷🇺' },
    { code: 'es', name: 'Español', emoji: '🇪🇸' },
    { code: 'fr', name: 'Français', emoji: '🇫🇷' },
    { code: 'de', name: 'Deutsch', emoji: '🇩🇪' },
    { code: 'zh', name: '简体中文', emoji: '🇨🇳' },
    { code: 'ja', name: '日本語', emoji: '🇯🇵' },
    { code: 'ko', name: '한국어', emoji: '🇰🇷' },
    { code: 'ar', name: 'العربية', emoji: '🇸🇦' },
    { code: 'he', name: 'עברית', emoji: '🇮🇱' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Nebula Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold">Nebula</span>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 text-sm hover:text-gray-300"
              >
                <span>{languages.find(lang => lang.code === currentLang)?.emoji}</span>
                <span>{languages.find(lang => lang.code === currentLang)?.name}</span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 bg-gray-700 rounded-md shadow-lg py-1 w-48">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block px-4 py-2 text-left w-full text-sm ${
                        currentLang === lang.code ? 'bg-gray-600' : 'hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-2">{lang.emoji}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`flex items-center ${['ar', 'he'].includes(i18n.language) ? 'space-x-reverse space-x-8' : 'space-x-6'}`}>
            {/* Social Icons */}
            {(() => {
              type SocialPlatform = {
                Icon: IconType;
                href: string;
                key: string;
                color: string;
              };

              const socialPlatforms: Record<string, SocialPlatform[]> = {
                zh: [
                  { Icon: RiWechat2Fill, href: 'https://weixin.qq.com/', key: 'wechat', color: 'hover:text-green-400' },
                  { Icon: RiWeiboFill, href: 'https://weibo.com/', key: 'weibo', color: 'hover:text-red-400' },
                  { Icon: RiTiktokFill, href: 'https://www.douyin.com/', key: 'douyin', color: 'hover:text-black' },
                  { Icon: RiBilibiliFill, href: 'https://www.bilibili.com/', key: 'bilibili', color: 'hover:text-pink-400' }
                ],
                en: [
                  { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                  { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
                ],
                ru: [
                  { Icon: FaVk, href: 'https://vk.com/nebula', key: 'vk', color: 'hover:text-blue-600' },
                  { Icon: FaTelegram, href: 'https://t.me/nebula', key: 'telegram', color: 'hover:text-blue-400' },
                  { Icon: FaRss, href: 'https://zen.yandex.ru/nebula', key: 'yandexzen', color: 'hover:text-orange-400' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' }
                ],
                es: [
                  { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                  { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' }
                ],
                fr: [
                  { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                  { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
                ],
                de: [
                  { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaBriefcase, href: 'https://xing.com/nebula', key: 'xing', color: 'hover:text-green-400' },
                  { Icon: FaLinkedinIn, href: 'https://linkedin.com/company/nebula', key: 'linkedin', color: 'hover:text-blue-600' }
                ],
                ja: [
                  { Icon: RiLineFill, href: 'https://line.me/nebula', key: 'line', color: 'hover:text-green-400' },
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaYoutube, href: 'https://youtube.com/nebula', key: 'youtube', color: 'hover:text-red-400' }
                ],
                ko: [
                  { Icon: FaCommentDots, href: 'https://kakao.com/nebula', key: 'kakao', color: 'hover:text-yellow-400' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaGlobe, href: 'https://blog.naver.com/nebula', key: 'naver', color: 'hover:text-green-400' },
                  { Icon: FaYoutube, href: 'https://youtube.com/nebula', key: 'youtube', color: 'hover:text-red-400' }
                ],
                ar: [
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaCamera, href: 'https://snapchat.com/nebula', key: 'snapchat', color: 'hover:text-yellow-400' },
                  { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' }
                ],
                he: [
                  { Icon: FaFacebook, href: 'https://facebook.com/nebula', key: 'facebook', color: 'hover:text-blue-600' },
                  { Icon: FaInstagram, href: 'https://instagram.com/nebula', key: 'instagram', color: 'hover:text-pink-400' },
                  { Icon: FaWhatsapp, href: 'https://whatsapp.com/channel/nebula', key: 'whatsapp', color: 'hover:text-green-400' },
                  { Icon: FaXTwitter, href: 'https://twitter.com/nebula', key: 'twitter', color: 'hover:text-blue-400' }
                ]
              };

              const platforms = socialPlatforms[i18n.language as keyof typeof socialPlatforms] || socialPlatforms.en;

              return (
                <>
                  {platforms.map(({ Icon, href, key, color }) => (
                    <a key={key} href={href} aria-label={t(`social.${key}`)}>
                      {Icon({ className: `text-xl ${color}` })}
                    </a>
                  ))}
                </>
              );
            })()}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="mt-1">
            <a href="/privacy" className="hover:text-gray-300">{t('footer.privacy')}</a> |
            <a href="/terms" className="hover:text-gray-300 ml-2">{t('footer.terms')}</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;