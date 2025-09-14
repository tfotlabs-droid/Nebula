import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRunning } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/nebula.png";
const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
 
  const profileIcon = (
    <svg
      className="w-8 h-8 text-current"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
 
  const navLinks = [
    { id: "home", label: t('home') },
    { id: "about", label: t('about.title') },
    { id: "download", label: t('download') },
    { id: "contact", label: t('contact.nav') },
    { id: "jobs", label: t('jobs.title') },
  ];

  const handleAnchorClick = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
  <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-black/80 backdrop-blur-md text-white z-50 flex justify-between items-center px-6 py-3 border-b border-white/20">
      {/* ЛОГО СЛЕВА */}
      <Link to="/" className="flex items-center group">
        <motion.img
          src={logo}
          alt="Nebula Logo"
          className="h-24 md:h-28 w-auto"
          whileHover={{ scale: 1.13 }}
        />
      </Link>


      {/* ЦЕНТР - АВТОРИЗАЦИЯ (скрыто на мобильных) */}
      <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
        {user ? (
          <Link to="/profile" className="flex items-center p-1 rounded hover:bg-white/10">
            {profileIcon}
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-indigo-300">{t('login')}</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{t('register')}</Link>
          </>
        )}
      </div>

      {/* КНОПКА-ИКОНКА СПРАВА (меню) */}
      <div className="flex items-center">
        <motion.button
          aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
          className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          whileTap={{ scale: 1.2, rotate: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          {/* @ts-ignore */}
          <FaRunning size={36} />
        </motion.button>
      </div>

      {/* ВЫПАДАЮЩЕЕ МЕНЮ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-full right-0 w-full bg-black/90 shadow-2xl rounded-b-2xl z-50"
          >
            <div className="flex flex-col gap-3 px-4 py-6">
              {navLinks.map((l, idx) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={handleAnchorClick(l.id)}
                  className="py-3 px-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition cursor-pointer text-white text-center"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx }}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;