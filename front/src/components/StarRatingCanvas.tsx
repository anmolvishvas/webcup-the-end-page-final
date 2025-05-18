import { useEffect, useRef } from 'react';

interface StarRatingCanvasProps {
  onRate: (rating: number) => void;
}

const StarRatingCanvas = ({ onRate }: StarRatingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<number[]>([0, 0, 0, 0, 0]);
  const selectedRatingRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>();

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    color = "#e94560"
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#e94560";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < starsRef.current.length; i++) {
      const x = canvas.width / starsRef.current.length - 50 + i * 100;
      const y = canvas.height / 2.7;
      drawStar(ctx, x, y, 5, 30, 15, starsRef.current[i] ? "#e94560" : "white");
    }
    drawEmojis(ctx, canvas);
    drawParticles(ctx);
  };

  const drawEmojis = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const emojis = ["😞", "😒", "😐", "😁", "🤩"];
    ctx.font = "40px Arial";
    for (let i = 0; i < starsRef.current.length; i++) {
      const x = 25 + i * 100;
      const y = canvas.height / 1.3;
      ctx.fillText(emojis[i], x, y);
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#e94560";
    particlesRef.current.forEach((particle) => {
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
  };

  const createParticle = (x: number, y: number) => {
    const particle = {
      x,
      y,
      size: Math.random() * 3 + 1,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      opacity: 1
    };
    particlesRef.current.push(particle);
  };

  const updateParticles = () => {
    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity -= 0.01;

      if (particle.opacity <= 0) {
        particlesRef.current.splice(index, 1);
      }
    });
  };

  const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, canvas);
    updateParticles();
    animationFrameRef.current = requestAnimationFrame(() => animate(ctx, canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const starHovered = Math.floor(x / 100);
      starsRef.current = starsRef.current.map((_, i) => (i <= starHovered ? 1 : 0));
      draw(ctx, canvas);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const selectedStarIndex = Math.floor(x / 100);
      selectedRatingRef.current = selectedStarIndex + 1;
      onRate(selectedRatingRef.current);
      
      const starX = canvas.width / starsRef.current.length - 50 + selectedStarIndex * 100;
      const starY = canvas.height / 2.7;
      
      for (let i = 0; i < 30; i++) {
        createParticle(starX, starY);
      }
    };

    const handleMouseOut = () => {
      starsRef.current = Array(5)
        .fill(0)
        .map((_, i) => (i < selectedRatingRef.current ? 1 : 0));
      draw(ctx, canvas);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseout', handleMouseOut);

    animate(ctx, canvas);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mouseout', handleMouseOut);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onRate]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={200}
      className="rounded-lg shadow-lg cursor-pointer bg-transparent"
    />
  );
};

export default StarRatingCanvas; 