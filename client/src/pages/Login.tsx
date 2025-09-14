import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        navigate('/profile');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `/auth/${provider}?lang=${i18n.language}`;
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/* @ts-ignore */}
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="relative">
            {/* @ts-ignore */}
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>
        <div className="mt-6">
          <h3 className="text-center mb-4">{t('orLoginWith')}</h3>
          <div className="space-y-2">
            {i18n.language === 'zh' ? (
              <>
                <button onClick={() => handleOAuth('wechat')} className="w-full p-2 bg-green-500 rounded">{t('social.wechat')}</button>
                <button onClick={() => handleOAuth('qq')} className="w-full p-2 bg-blue-500 rounded">{t('social.qq')}</button>
              </>
            ) : i18n.language === 'ja' ? (
              <>
                <button onClick={() => handleOAuth('google')} className="w-full p-2 bg-red-500 rounded">{t('google')}</button>
                <button onClick={() => handleOAuth('apple')} className="w-full p-2 bg-black rounded">{t('apple')}</button>
                <button onClick={() => handleOAuth('line')} className="w-full p-2 bg-green-500 rounded">{t('social.line')}</button>
              </>
            ) : i18n.language === 'ko' ? (
              <>
                <button onClick={() => handleOAuth('google')} className="w-full p-2 bg-red-500 rounded">{t('google')}</button>
                <button onClick={() => handleOAuth('apple')} className="w-full p-2 bg-black rounded">{t('apple')}</button>
                <button onClick={() => handleOAuth('kakao')} className="w-full p-2 bg-yellow-500 rounded">{t('social.kakao')}</button>
              </>
            ) : ['en', 'de', 'es', 'fr', 'ar', 'he'].includes(i18n.language) ? (
              <>
                <button onClick={() => handleOAuth('google')} className="w-full p-2 bg-red-500 rounded">{t('google')}</button>
                <button onClick={() => handleOAuth('apple')} className="w-full p-2 bg-black rounded">{t('apple')}</button>
              </>
            ) : (
              <>
                <button onClick={() => handleOAuth('google')} className="w-full p-2 bg-red-500 rounded">{t('google')}</button>
                <button onClick={() => handleOAuth('apple')} className="w-full p-2 bg-black rounded">{t('apple')}</button>
                <button onClick={() => handleOAuth('yandex')} className="w-full p-2 bg-blue-500 rounded">{t('yandex')}</button>
                <button onClick={() => handleOAuth('vk')} className="w-full p-2 bg-blue-800 rounded">{t('vk')}</button>
              </>
            )}
          </div>
        </div>
        <p className="text-center mt-4">
          {t('noAccount')} <Link to="/register" className="text-indigo-400">{t('register')}</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;