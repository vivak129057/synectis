/* ============================================================
   FONDO INTERACTIVO GLOBAL — SYNECTIS 2026
   Grid tipo "piso synthwave" + red de partículas que reaccionan
   al mouse/touch. Usa la misma paleta morado/cian/rosa del sitio
   y el mismo lenguaje visual que la red de nodos del hero.
   Se usa en TODAS las páginas (index.html y portal.html).
   ============================================================ 
(function initInteractiveBackground(){
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Misma paleta que --purple, --neon-cyan, --neon-pink, --violet
  const colors = ['#7c3aed', '#22e5e5', '#f0399e', '#a78bfa'];

  const density = reduceMotion ? 0 : Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 16000));
  const particles = [];
  for(let i = 0; i < density; i++){
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1 + Math.random() * 1.8,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  const mouse = { x: W / 2, y: H / 2, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('touchmove', (e) => {
    if(e.touches && e.touches[0]){
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  const GRID = 64;
  let gridOffset = 0;

  function drawGrid(){
    gridOffset = (gridOffset + 0.12) % GRID;
    ctx.strokeStyle = 'rgba(124,58,237,0.07)';
    ctx.lineWidth = 1;
    for(let x = -GRID; x < W + GRID; x += GRID){
      ctx.beginPath();
      ctx.moveTo(x + gridOffset, 0);
      ctx.lineTo(x + gridOffset, H);
      ctx.stroke();
    }
    for(let y = -GRID; y < H + GRID; y += GRID){
      ctx.beginPath();
      ctx.moveTo(0, y + gridOffset);
      ctx.lineTo(W, y + gridOffset);
      ctx.stroke();
    }
  }

  function drawParticles(){
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if(mouse.active){
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < 150 && dist > 0.01){
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 0.55;
          p.y -= (dy / dist) * force * 0.55;
        }
      }

      if(p.x < -10) p.x = W + 10;
      if(p.x > W + 10) p.x = -10;
      if(p.y < -10) p.y = H + 10;
      if(p.y > H + 10) p.y = -10;
    });

    // líneas de conexión entre partículas cercanas (mismo concepto "synapse" del hero)
    for(let i = 0; i < particles.length; i++){
      for(let j = i + 1; j < particles.length; j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < 130){
          ctx.strokeStyle = `rgba(167,139,250,${(1 - dist / 130) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.85;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function loop(){
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawParticles();
    requestAnimationFrame(loop);
  }

  if(reduceMotion){
    // Con "reducir movimiento" activado, solo dibujamos el grid una vez, estático.
    drawGrid();
  } else {
    loop();
  }
})();*/
