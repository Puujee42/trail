"use client";
import { useEffect, useState } from "react";

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 snowflakes
    const flakes = Array.from({ length: 50 }).map((_, i) => i);
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10; // Random speed between 5s and 15s
        const opacity = 0.3 + Math.random() * 0.5;
        const size = 2 + Math.random() * 4; // Size between 2px and 6px

        return (
          <div
            key={i}
            className="absolute top-[-10px] bg-white rounded-full animate-fall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animation: `fall ${animationDuration}s linear infinite`,
              animationDelay: `-${Math.random() * 10}s`, // Start at different times
            }}
          />
        );
      })}
      
      {/* Add required global styles for animation if using Tailwind without config */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(100vh) translateX(20px); }
        }
        .animate-fall {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default SnowEffect;