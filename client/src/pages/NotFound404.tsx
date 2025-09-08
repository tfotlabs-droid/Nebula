import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-purple-800 text-white p-6">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-xl mb-6">Ой! Похоже, эта звезда куда-то улетела.</p>
      <p className="mb-6">Но не переживай — вернёмся на космическую базу.</p>
      <Link to="/" className="px-6 py-3 bg-white text-purple-700 rounded-lg font-bold">Домой</Link>
    </div>
  );
};

export default NotFound;