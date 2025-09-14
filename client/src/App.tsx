// client/src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import i18n from "./i18n";
import { useTranslation } from 'react-i18next';
import Navbar from "./components/Navbar";
import PasswordGate from "./components/PasswordGate";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Download from "./pages/Download";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SupportChat from "./components/SupportChat";
import TestApi from "./TestApi";
import AdminChat from "./pages/AdminChat";

const AuthSuccess: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { login } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');
  useEffect(() => {
    if (token && email) {
      login(token, { id: 'from-oauth', email });
      navigate('/profile');
    } else {
      navigate('/login');
    }
  }, [token, email, login, navigate]);
  return <div>{t('processingAuth')}</div>;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  return <>{children}</>;
};

// --- Лэндинг (все секции подряд) ---
const Landing: React.FC = () => {
  return (
    <>
      <Home />
      <About />
      <Download />
      <Contact />
      <Jobs />
    </>
  );
};

// --- Страница 404 с API статусом ---
const NotFound: React.FC = () => {
  const { t } = useTranslation('common');
  const [apiMessage, setApiMessage] = useState<string>(t('apiLoading'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(t('serverError'));
        return res.json();
      })
      .then((data) => {
        setApiMessage(t('apiSuccess', { ok: data.ok ? "Yes" : "No", ts: data.ts }));
      })
      .catch((e) => {
        setApiMessage(t('apiError', { error: e?.message || e }));
      });
  }, [t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <h1 className="text-7xl font-extrabold mb-6">{t('notFoundTitle')}</h1>
      <p className="text-xl mb-4">{t('notFoundMessage')}</p>
      <p className="mb-6">{t('notFoundDescription')}</p>
      <p className="mb-4 text-sm text-indigo-300">{apiMessage}</p>
      <a
        href="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
      >
        {t('returnHome')}
      </a>
    </div>
  );
};


const App: React.FC = () => {

  useEffect(() => {
    i18n.changeLanguage('ru');
  }, []);


  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-32">
            <Routes>
              {/* Главная (все секции) */}
              <Route path="/" element={<Landing />} />
              <Route path="/download" element={<Download />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/jobs" element={<Jobs />} />
            
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
            
              {/* Protected */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
              {/* Админ-чат */}
              <Route path="/admin-chat" element={<PasswordGate><AdminChat /></PasswordGate>} />
            
              {/* Тест API */}
              <Route path="/test" element={<TestApi />} />
            
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <SupportChat />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;