import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      localStorage.setItem('admin-access', 'true');
      setShow(false);
    } else {
      setError('Неверный пароль');
    }
  };

  if (!show) {
    return <>{children}</>;
  }

  if (localStorage.getItem('admin-access') === 'true') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход для администратора</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 rounded"
          >
            Войти
          </button>
        </form>
        <p className="text-center mt-4">
          <button onClick={() => navigate('/')} className="text-indigo-400 hover:underline">
            На главную
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;