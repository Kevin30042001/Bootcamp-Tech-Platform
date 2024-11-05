// src/App.tsx
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { BootcampApp } from './components/BootcampApp';
import './index.css';

const PUBLIC_KEY = "yqXWOTT_ASE0Psx89";

function App() {
  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BootcampApp />
    </div>
  );
}

export default App;