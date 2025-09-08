import React from "react";
import { FaTelegram, FaInstagram, FaVk, FaXTwitter } from "react-icons/fa6"; 
import logo from "../assets/nebula.png"; // путь к твоему лого

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 text-white py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* ЛОГОТИП + название */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Nebula Logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold">Nebula</span>
        </div>

        {/* Ссылки на соцсети */}
        <div className="flex gap-6 text-2xl">
          <a href="https://vk.com" target="_blank" rel="noreferrer" className="hover:text-purple-400">
            <FaVk />
          </a>
          <a href="https://t.me" target="_blank" rel="noreferrer" className="hover:text-purple-400">
            <FaTelegram />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-purple-400">
            <FaInstagram />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-purple-400">
            <FaXTwitter />
          </a>
        </div>

        {/* Копирайт */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Nebula. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;