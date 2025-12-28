// Simple confetti effect using canvas
export const triggerConfetti = () => {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
        rotation: number;
        rotationSpeed: number;
    }> = [];

    const colors = ['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#45B7D1', '#96CEB4'];

    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
        });
    }

    let animationFrame: number;

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // Gravity
            p.rotation += p.rotationSpeed;

            if (p.y < canvas.height + 20) {
                activeParticles++;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    };

    animate();

    // Cleanup after 5 seconds max
    setTimeout(() => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
        }
    }, 5000);
};
