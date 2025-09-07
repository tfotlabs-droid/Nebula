import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        {/* Навигация */}
        <nav className="bg-black bg-opacity-40 backdrop-blur-md shadow-lg p-4 flex gap-6 justify-center sticky top-0 z-50">
          <Link to="/" className="hover:text-purple-400 font-medium transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-purple-400 font-medium transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-purple-400 font-medium transition-colors">
            Contact
          </Link>
        </nav>

        {/* Контент */}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Футер */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;