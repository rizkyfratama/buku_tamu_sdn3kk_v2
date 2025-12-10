
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
    
    // Posisi mouse/sentuhan
    let mouse = { x: -9999, y: -9999 };

    // Deteksi apakah Mobile (Layar < 768px)
    const isMobile = window.innerWidth < 768;

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
        // Kecepatan: Mobile lebih lambat sedikit agar tidak pusing
        const speedFactor = isMobile ? 0.5 : 0.8;
        this.dx = (Math.random() - 0.5) * speedFactor; 
        this.dy = (Math.random() - 0.5) * speedFactor;
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
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // OPTIMASI KHUSUS ANDROID/MOBILE
      // Mengurangi kepadatan partikel secara signifikan di layar kecil
      // Desktop: ~100 partikel, Mobile: Max 35 partikel (Sangat Ringan)
      const maxParticles = width < 768 ? 35 : 100; 
      
      let numberOfParticles = (width * height) / 15000;
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // OPTIMASI JARAK KONEKSI
      // Mobile: Jarak 80px (6400 sq) - Lebih pendek agar tidak kebanyakan garis
      // Desktop: Jarak 120px (14400 sq)
      const connectDist = isMobile ? 80 : 120;
      const connectDistanceSq = connectDist * connectDist;
      
      const mouseDist = 150;
      const mouseDistanceSq = mouseDist * mouseDist;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Loop untuk garis penghubung
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < connectDistanceSq) {
            ctx.beginPath();
            const opacity = 1 - (distSq / connectDistanceSq);
            // Garis lebih tipis (0.3) agar rendering lebih cepat
            ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`; 
            ctx.lineWidth = 0.3; 
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Interaksi Mouse/Sentuhan
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < mouseDistanceSq) {
          ctx.beginPath();
          const opacity = 1 - (distMouseSq / mouseDistanceSq);
          ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`; 
          ctx.lineWidth = 0.8;
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
