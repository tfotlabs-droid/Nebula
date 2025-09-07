import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `mx-3 text-white hover:text-pink-400 ${isActive ? "font-bold underline" : ""}`;

  return (
    <header className="bg-[#0a0a23] text-white p-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Nebula</h1>
      <nav>
        <NavLink to="/" className={linkClasses}>
          Главная
        </NavLink>
        <NavLink to="/about" className={linkClasses}>
          О нас
        </NavLink>
        <NavLink to="/contact" className={linkClasses}>
          Контакты
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
