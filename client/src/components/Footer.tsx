import React from "react";
import { FaInstagram, FaTelegramPlane, FaVk, FaYoutube, FaGithub } from "react-icons/fa";

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com", Icon: FaInstagram, hoverColor: "hover:text-pink-400" },
  { name: "VK", url: "https://vk.com", Icon: FaVk, hoverColor: "hover:text-blue-400" },
  { name: "Telegram", url: "https://t.me", Icon: FaTelegramPlane, hoverColor: "hover:text-cyan-400" },
  { name: "YouTube", url: "https://youtube.com", Icon: FaYoutube, hoverColor: "hover:text-red-500" },
  { name: "GitHub", url: "https://github.com", Icon: FaGithub, hoverColor: "hover:text-gray-400" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col items-center">
        <p className="mb-4 text-gray-400">© 2025 Nebula. Все права защищены.</p>
        <div className="flex space-x-6">
          {socialLinks.map(({ name, url, Icon, hoverColor }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={`transition-colors duration-300 ${hoverColor}`}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
