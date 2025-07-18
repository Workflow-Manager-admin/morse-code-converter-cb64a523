import React, { useState, useEffect } from 'react';
import './App.css';
import MorseConverter from './MorseConverter';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ position: "fixed", zIndex: 3, top: 10, right: 18 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      {/* Morse Converter Main UI */}
      <MorseConverter />
    </div>
  );
}

export default App;
