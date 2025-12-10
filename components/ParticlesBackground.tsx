
import React, { useRef, useEffect } from 'react';

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ['#800080', '#FFC0CB', '#87CEEB']; 
    
    // Posisi mouse/sentuhan (dimulai di luar layar)
    let mouse = { x: -9999, y: -9999 };

    class Particle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        // Kecepatan gerak (sedikit diperlambat agar lebih tenang di mata)
        this.dx = (Math.random() - 0.5) * 0.8; 
        this.dy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas!.height || this.y < 0) this.dy = -this.dy;
        this.x += this.dx;
        this.y += this.dy;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // OPTIMASI 1: Kurangi kepadatan partikel.
      // Semakin besar pembaginya (20000), semakin sedikit partikelnya.
      let numberOfParticles = (window.innerWidth * window.innerHeight) / 20000;
      
      // OPTIMASI 2: Batasi maksimal partikel agar HP tidak berat
      const maxParticles = window.innerWidth < 768 ? 50 : 100; // Max 50 di HP, 100 di Desktop
      numberOfParticles = Math.min(numberOfParticles, maxParticles);

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Support sentuhan jari di HP
    const handleTouchMove = (e: TouchEvent) => {
      if(e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
       mouse.x = -9999;
       mouse.y = -9999;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    handleResize();

    // Loop Animasi Utama
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Jarak koneksi (dikuadratkan untuk menghindari Math.sqrt)
      // Jarak partikel: 120px -> 14400
      // Jarak mouse: 150px -> 22500
      const connectDistanceSq = 120 * 120;
      const mouseDistanceSq = 150 * 150;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // 1. Hubungkan antar partikel
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          // OPTIMASI 3: Menggunakan jarak kuadrat (dx*dx + dy*dy) tanpa Math.sqrt
          const distSq = dx * dx + dy * dy;
          
          if (distSq < connectDistanceSq) {
            ctx.beginPath();
            // Kalkulasi opacity berdasarkan jarak kuadrat
            const opacity = 1 - (distSq / connectDistanceSq);
            ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`; 
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // 2. Hubungkan ke Mouse/Jari
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < mouseDistanceSq) {
          ctx.beginPath();
          const opacity = 1 - (distMouseSq / mouseDistanceSq);
          ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`; 
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none" 
      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
    />
  );
};

export default ParticlesBackground;
