import React from 'react';
import './App.css';
import nebulaLogo from './nebula-logo.svg';

function App() {
  return (
    <div className="App">
      <img 
        src={nebulaLogo} 
        alt="Nebula Logo" 
        style={{ width: '120px', marginTop: '20px' }} 
      />
      <h1>Nebula App</h1>
      <p>Добро пожаловать в спортивное приложение будущего 🚀</p>
    </div>
  );
}


export default App;
