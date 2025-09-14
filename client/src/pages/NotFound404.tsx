import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation('common');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let shipX = 50;
    let shipY = canvas.height / 2;
    let stars: { x: number; y: number; size: number }[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'white';
      stars.forEach((star: { x: number; y: number; size: number }) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Ship
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(shipX, shipY);
      ctx.lineTo(shipX + 30, shipY);
      ctx.lineTo(shipX + 15, shipY - 20);
      ctx.closePath();
      ctx.fill();

      shipX += 2;
      if (shipX > canvas.width + 30) {
        shipX = -30;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-purple-800 text-white p-6">
      <h1 className="text-6xl font-black mb-4">{t('notFoundTitle')}</h1>
      <p className="text-xl mb-6">{t('notFoundMessage')}</p>
      <p className="mb-6">{t('notFoundDescription')}</p>
      <canvas ref={canvasRef} width={400} height={200} className="mb-4 border rounded" />
      <Link to="/" className="px-6 py-3 bg-white text-purple-700 rounded-lg font-bold">
        {t('returnHome')}
      </Link>
    </div>
  );
};

export default NotFound;