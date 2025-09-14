import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa';

const FaUserIcon = FaUser as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `mx-3 text-white hover:text-pink-400 ${isActive ? "font-bold underline" : ""}`;

  const profileIcon = (
    <FaUserIcon className="w-8 h-8 text-white hover:text-pink-400 transition-colors duration-300 cursor-pointer rounded-full p-1 bg-gray-700 hover:bg-pink-600/20" />
  );

  return (
    <header className="bg-[#0a0a23] text-white p-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Nebula</h1>
      <nav className="flex items-center space-x-6">
        <NavLink to="/" className={linkClasses}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/about" className={linkClasses}>
          {t('about.title')}
        </NavLink>
        <NavLink to="/contact" className={linkClasses}>
          {t('contact.nav')}
        </NavLink>
        {user ? (
          <div className="flex items-center space-x-4">
            <NavLink to="/profile" title={t('myProfile')}>
              {profileIcon}
            </NavLink>
            <button
              onClick={logout}
              className="text-white hover:text-pink-400 transition-colors duration-300"
            >
              {t('logout')}
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <NavLink to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors font-semibold">
              {t('login')}
            </NavLink>
            <NavLink to="/register" className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded transition-colors font-semibold">
              {t('register')}
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
