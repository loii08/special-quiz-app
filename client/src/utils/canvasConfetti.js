let canvas;
let ctx;
let particles = [];
let animating = false;

const colors = [
    '#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6', '#ff2d55'
];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 6) + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = (Math.random() * 8) + 6;
        this.rotation = Math.random() * Math.PI * 2;
        this.vr = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.ttl = 80 + Math.floor(Math.random() * 40);
        this.age = 0;
        this.shape = Math.random() < 0.5 ? 'rect' : 'circle';
    }
    update() {
        this.age++;
        this.vy += 0.15;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.vr;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const progress = this.age / this.ttl;
        ctx.globalAlpha = Math.max(1 - progress, 0);
        if (this.shape === 'rect') {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size / 2, this.size * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    isDead() {
        return this.age >= this.ttl || this.y - this.size > window.innerHeight + 50;
    }
}

function animate() {
    animating = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.isDead()) particles.splice(i, 1);
    }
    if (particles.length) {
        requestAnimationFrame(animate);
    } else {
        animating = false;
    }
}

export function spawn(x, y, count = 150) {
    if (!ctx) return;
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
    if (!animating) animate();
}

function resize() {
    if (!canvas || !ctx) return;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.ceil(window.innerWidth * DPR);
    canvas.height = Math.ceil(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

export function init(canvasElement) {
    if (!canvasElement) return;
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize, { passive: true });
}