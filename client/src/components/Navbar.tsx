import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRunning } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/nebula.png";

const navLinks = [
  { id: "about", label: "О проекте" },
  { id: "contact", label: "Контакты" },
  { id: "jobs", label: "Вакансии" },
  { id: "download", label: "Скачать" },
];


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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


      {/* КНОПКА-ИКОНКА СПРАВА (меню) */}
      <div className="flex items-center">
        <motion.button
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
          className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          whileTap={{ scale: 1.2, rotate: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
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