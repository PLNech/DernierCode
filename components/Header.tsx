// components/Header.tsx
'use client'
import { useState, useEffect } from 'react';

export default function Header() {
  const [glitchedTitle, setGlitchedTitle] = useState("Le Dernier Code");
0
  useEffect(() => {
    const glitchText = () => {
      // Original text
      const originalText = "Le Dernier Code";

      // Randomly decide if we'll glitch this interval
      if (Math.random() < 0.3) {
        let newText = originalText;

        // Maybe glitch 'i' to '1'
        if (Math.random() < 0.5) {
          newText = newText.replace('i', '1');
        }

        // Maybe glitch 'o' to '0'
        if (Math.random() < 0.5) {
          newText = newText.replace('o', '0');
        }

        setGlitchedTitle(newText);
      } else {
        // Reset to original
        setGlitchedTitle(originalText);
      }
    };

    // Set up interval for glitching
    const glitchInterval = setInterval(glitchText, 2000 + Math.random() * 3000);

    // Clean up
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <header className="w-full py-4 bg-black border-b border-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 text-transparent bg-clip-text font-['Geist_Variable'] tracking-tight">
        {glitchedTitle}
      </h1>
    </header>
  );
}
