
import React, { useState, useEffect, useCallback, useRef, ChangeEvent, SyntheticEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user, token, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentSub, setCurrentSub] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedInfo, setEditedInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [success, setSuccess] = useState(false);

  const currencyMap = {
    ar: 'USD',
    de: 'EUR',
    en: 'USD',
    es: 'EUR',
    fr: 'EUR',
    he: 'ILS',
    ja: 'JPY',
    ko: 'KRW',
    ru: 'RUB',
    zh: 'CNY'
  };

  const priceMap = {
    basic: {
      RUB: 990,
      USD: 10,
      GBP: 8,
      EUR: 9,
      ILS: 37,
      JPY: 1500,
      KRW: 13000,
      CNY: 70
    },
    pro: {
      RUB: 2990,
      USD: 30,
      GBP: 24,
      EUR: 27,
      ILS: 111,
      JPY: 4500,
      KRW: 39000,
      CNY: 210
    },
    premium: {
      RUB: 3990,
      USD: 40,
      GBP: 32,
      EUR: 36,
      ILS: 148,
      JPY: 6000,
      KRW: 52000,
      CNY: 280
    },
    elite: {
      RUB: 5990,
      USD: 60,
      GBP: 48,
      EUR: 54,
      ILS: 222,
      JPY: 9000,
      KRW: 78000,
      CNY: 420
    },
    vip: {
      RUB: 7990,
      USD: 80,
      GBP: 64,
      EUR: 72,
      ILS: 296,
      JPY: 12000,
      KRW: 104000,
      CNY: 560
    },
    ultimate: {
      RUB: 16990,
      USD: 170,
      GBP: 136,
      EUR: 153,
      ILS: 629,
      JPY: 25500,
      KRW: 221000,
      CNY: 1190
    }
  };

  const symbolMap = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    RUB: '₽',
    ILS: '₪',
    JPY: '¥',
    KRW: '₩',
    CNY: '¥'
  };

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    if (lang === 'en') {
      return localStorage.getItem('enCurrency') || 'USD';
    }
    return '';
  });

  useEffect(() => {
    if (lang === 'en') {
      localStorage.setItem('enCurrency', selectedCurrency);
    }
  }, [selectedCurrency, lang]);

  const currency = lang === 'en' ? selectedCurrency : currencyMap[lang as keyof typeof currencyMap] || 'USD';

  const subIds = ['basic', 'pro', 'premium', 'elite', 'vip', 'ultimate'];

  const fetchUserSubscription = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCurrentSub(data.subscription || 'none');
    } catch (err) {
      console.error('Fetch user subscription error:', err);
      setCurrentSub('none');
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserSubscription();

    // Load additional info from localStorage if not in user
    const storedInfo = localStorage.getItem('profileInfo');
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      setEditedInfo(prev => ({ ...prev, ...info }));
    }

    // Check for payment success
    if (location.search.includes('success=true')) {
      setSuccess(true);
      setError('');
    } else if (location.search.includes('cancel=true')) {
      setError(t('profile.paymentCancelled'));
      setSuccess(false);
    }
  }, [user, navigate, fetchUserSubscription, location.search, t]);

  const getPrice = (subId: string) => priceMap[subId as keyof typeof priceMap][currency as keyof typeof priceMap.basic];

  const handlePurchase = async (subId: string) => {
    const paymentEndpoint = lang === 'ru' ? '/api/create-sberpay-payment' :
      ['en', 'de', 'fr', 'es', 'ar', 'he'].includes(lang) ? '/api/create-stripe-payment' :
      lang === 'ja' ? '/api/create-linepay-payment' :
      lang === 'ko' ? '/api/create-kakaopay-payment' :
      lang === 'zh' ? '/api/create-alipay-payment' :
      '/api/create-stripe-payment';

    setLoading(true);
    try {
      const response = await fetch(paymentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subId, currency }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.error'));
      }

      // Get the form HTML and submit it
      const formHtml = await response.text();
      const form = document.createElement('div');
      form.innerHTML = formHtml;
      document.body.appendChild(form);
      const submitForm = form.querySelector('form');
      if (submitForm) {
        submitForm.submit();
      }
      document.body.removeChild(form);
    } catch (err: any) {
      setError(err.message || t('profile.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const displayAvatar = editedInfo.avatar || user?.avatar;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await updateProfile({
        name: editedInfo.name,
        phone: editedInfo.phone,
        bio: editedInfo.bio,
        avatar: editedInfo.avatar
      });
      localStorage.setItem('profileInfo', JSON.stringify({
        name: editedInfo.name,
        phone: editedInfo.phone,
        bio: editedInfo.bio
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || t('profile.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditedInfo(prev => ({ ...prev, avatar: ev.target?.result as string || '' }));
      };
      reader.readAsDataURL(file);
    }
    // Reset the input
    e.target.value = '';
  };

  return (
    <motion.div
      className="min-h-screen pt-28 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {displayAvatar ? (
              <motion.img
                src={displayAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {user.email.charAt(0).toUpperCase()}
              </motion.div>
            )}
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            ></motion.div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <motion.h1
            className="ml-6 text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            {t('profile.title')}
          </motion.h1>
          {success && (
            <motion.div
              className="bg-green-500/20 border border-green-400 text-green-100 p-4 rounded-xl mb-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {t('profile.success')}
            </motion.div>
          )}
          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-400 text-red-100 p-4 rounded-xl mb-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
          <motion.button
            onClick={() => navigate('/')}
            className="ml-6 text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
        
        <motion.div
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl mb-12 shadow-2xl border border-indigo-500/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white flex items-center justify-center">
            <svg className="w-8 h-8 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('profile.userInfo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-400/30">
              <p className="text-xl font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <strong>{t('profile.emailLabel')}</strong>
              </p>
              <p className="text-lg text-gray-300">{user.email}</p>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl border border-blue-400/30">
              <h3 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('profile.additionalInfo')}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('profile.namePlaceholder')}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                />
                <input
                  type="tel"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t('profile.phonePlaceholder')}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                />
                <textarea
                  value={editedInfo.bio}
                  onChange={(e) => setEditedInfo(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={t('profile.bioPlaceholder')}
                  rows={4}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 resize-none"
                />
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all"
                >
                  {loading ? t('profile.processing') : t('profile.saveInfo')}
                </button>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-400/30">
              <p className="text-xl font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <strong>{t('profile.phoneLabel')}</strong>
              </p>
              <p className="text-lg text-gray-300">{editedInfo.phone || ''}</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-400/30">
              <p className="text-xl font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 .402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>{t('profile.currentSub')}</strong>
              </p>
              <p className="text-lg text-gray-300">{currentSub === 'none' ? t('profile.noSub') : t(`subscriptions.${currentSub}.name`)}</p>
            </div>
          </div>
        </motion.div>

        {/* Subscriptions Section */}
        <motion.div
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-8 rounded-3xl mb-12 shadow-2xl border border-indigo-500/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white flex items-center justify-center gap-2">
            <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t('profile.chooseSub')}
          </h2>
          {lang === 'en' && (
            <div className="flex justify-center mb-6 gap-2">
              <motion.button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg ${
                  selectedCurrency === 'USD'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">$</span> USD
              </motion.button>
              <motion.button
                onClick={() => setSelectedCurrency('GBP')}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg ${
                  selectedCurrency === 'GBP'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">£</span> GBP
              </motion.button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subIds.map((subId) => {
              const isActive = currentSub === subId;
              const price = getPrice(subId);
              const symbol = symbolMap[currency as keyof typeof symbolMap];
              const subData = t(`subscriptions.${subId}`, { returnObjects: true }) as { name: string; description: string; features: string[] };
              return (
                <motion.div
                  key={subId}
                  className={`p-6 rounded-2xl border transition-all ${isActive ? 'border-green-400 bg-green-900/20' : 'border-indigo-400/30 bg-indigo-900/20'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">{subData.name}</h3>
                  <p className="text-gray-300 mb-4">{subData.description}</p>
                  <ul className="space-y-2 mb-6">
                    {subData.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-3xl font-bold text-white mb-4">{symbol}{price}</div>
                  <button
                    onClick={() => !isActive && handlePurchase(subId)}
                    disabled={isActive || loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                      isActive
                        ? 'bg-gray-600 cursor-not-allowed'
                        : loading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500'
                    }`}
                  >
                    {isActive ? t('profile.active') : loading ? t('profile.processing') : t('profile.purchase')}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
