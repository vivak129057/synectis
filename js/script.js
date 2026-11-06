/* ============================================================
   1. NAVBAR: menú móvil y enlaces
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.textContent = isOpen ? '✕' : '☰';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.textContent = '☰';
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ============================================================
   2. TABS: talleres por semestre
   ============================================================ */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    const target = document.getElementById(btn.dataset.tab);
    if(target) target.classList.add('active');
  });
});

/* ============================================================
   3. VALIDACIÓN BÁSICA DEL FORMULARIO DE CONTACTO
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');

    const setError = (input, hasError) => {
      if(!input) return;
      const wrapper = input.closest('.form-field');
      if(wrapper) wrapper.classList.toggle('error', hasError);
      if (hasError) valid = false;
    };

    if(nombre) setError(nombre, nombre.value.trim() === '');
    const emailOk = correo ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()) : false;
    if(correo) setError(correo, !emailOk);
    if(mensaje) setError(mensaje, mensaje.value.trim() === '');

    formStatus.classList.remove('show','ok');

    if (valid) {
      formStatus.textContent = '¡Gracias! Tu mensaje fue enviado.';
      formStatus.classList.add('show','ok');
      contactForm.reset();
    } else {
      formStatus.textContent = 'Por favor completa los campos marcados.';
      formStatus.classList.add('show');
    }
  });
}

/* ============================================================
   4. ELEMENTO FIRMA: red de nodos sinápticos animada (hero)
   ============================================================ */
(function buildSynapseGrid(){
  const svg = document.getElementById('synapseSvg');
  if(!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const W = 1200, H = 800;
  const cols = 8, rows = 6;
  const nodes = [];

  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      nodes.push({
        x: (i/(cols-1))*W + (Math.random()*60-30),
        y: (j/(rows-1))*H + (Math.random()*60-30)
      });
    }
  }

  const maxDist = 220;
  for(let a=0;a<nodes.length;a++){
    for(let b=a+1;b<nodes.length;b++){
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < maxDist && Math.random() > 0.55){
        const line = document.createElementNS(ns,'line');
        line.setAttribute('x1', nodes[a].x);
        line.setAttribute('y1', nodes[a].y);
        line.setAttribute('x2', nodes[b].x);
        line.setAttribute('y2', nodes[b].y);
        line.setAttribute('stroke', 'url(#synapseGradient)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', (0.15 + Math.random()*0.25).toFixed(2));
        svg.appendChild(line);
      }
    }
  }

  const defs = document.createElementNS(ns,'defs');
  defs.innerHTML = `<linearGradient id="synapseGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#22e5e5"/>
    </linearGradient>`;
  svg.appendChild(defs);

  nodes.forEach((n, idx) => {
    const circle = document.createElementNS(ns,'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', 2.4);
    circle.setAttribute('fill', idx % 5 === 0 ? '#f0399e' : '#a78bfa');
    circle.setAttribute('opacity', '0.75');

    const animDur = (3 + Math.random()*3).toFixed(2);
    const animate = document.createElementNS(ns,'animate');
    animate.setAttribute('attributeName','opacity');
    animate.setAttribute('values','0.2;0.9;0.2');
    animate.setAttribute('dur', animDur+'s');
    animate.setAttribute('repeatCount','indefinite');
    circle.appendChild(animate);

    svg.appendChild(circle);
  });
})();

/* ============================================================
   5. ANIMACIÓN DE REVELADO AL HACER SCROLL
   ============================================================ */
(function initScrollReveal(){
  const targets = document.querySelectorAll(
    '.card, .taller-card, .exp-item, .concept-col, .raffle-card, .sponsor-slot, .select-card, .section-title, .section-sub'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if(!('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });

  targets.forEach(el => io.observe(el));
})();

/* ============================================================
   6. HERO — parallax sutil con el mouse
   ============================================================ */
(function initHeroParallax(){
  const hero = document.querySelector('.hero');
  const content = document.querySelector('.hero-content');
  const grid = document.getElementById('synapseSvg');
  if(!hero || !content) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    content.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    if(grid) grid.style.transform = `translate(${x * -16}px, ${y * -12}px) scale(1.03)`;
  });
  hero.addEventListener('mouseleave', () => {
    content.style.transform = '';
    if(grid) grid.style.transform = '';
  });
})();

/* ============================================================
   7. MODAL DE REGISTRO
   ============================================================ */
const modal = document.getElementById('registroModal');
const modalClose = document.getElementById('modalClose');
const openModalBtns = document.querySelectorAll('[data-open-modal]');

function openModal(){
  if(!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  if(!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openModalBtns.forEach(btn => btn.addEventListener('click', openModal));

if (new URLSearchParams(window.location.search).get('acceso') === 'requerido') {
  openModal();
  const hint = document.getElementById('regFormStatus');
  if(hint) {
    hint.textContent = 'Primero completa tu registro para entrar a tu portal de asistente.';
    hint.classList.add('show');
  }
}
if(modalClose) modalClose.addEventListener('click', closeModal);

if(modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
});

const stepButtons = document.querySelectorAll('.modal-step-btn');
const stepPanels = document.querySelectorAll('.modal-step-panel');

stepButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    stepButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    stepPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    const panel = document.querySelector(`[data-step-panel="${btn.dataset.step}"]`);
    if(panel) panel.classList.add('active');
  });
});

const itinTabButtons = document.querySelectorAll('.itin-tab-btn');
const itinDayPanels = document.querySelectorAll('.itin-day');

itinTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    itinTabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    itinDayPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    const panel = document.querySelector(`[data-itin-panel="${btn.dataset.itinDay}"]`);
    if(panel) panel.classList.add('active');
  });
});

const staffCheckbox = document.getElementById('reg-staff');
const staffExtra = document.getElementById('staffExtra');

if(staffCheckbox && staffExtra) {
  staffCheckbox.addEventListener('change', () => {
    staffExtra.hidden = !staffCheckbox.checked;
  });
}

const registroForm = document.getElementById('registroForm');
const regFormStatus = document.getElementById('regFormStatus');

if(registroForm && regFormStatus) {
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nombre = document.getElementById('reg-nombre');
    const correo = document.getElementById('reg-correo');
    const talla  = document.getElementById('reg-talla');
    const areaStaff = document.getElementById('reg-area-staff');

    const setError = (input, hasError) => {
      if(!input) return;
      const wrapper = input.closest('.form-field');
      if(wrapper) wrapper.classList.toggle('error', hasError);
      if (hasError) valid = false;
    };

    if(nombre) setError(nombre, nombre.value.trim() === '');
    const emailOk = correo ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()) : false;
    if(correo) setError(correo, !emailOk);
    if(talla) setError(talla, talla.value === '');

    if (staffCheckbox && staffCheckbox.checked && areaStaff){
      setError(areaStaff, areaStaff.value === '');
    }

    regFormStatus.classList.remove('show','ok');

    if (valid) {
      const registro = {
        nombre: nombre ? nombre.value.trim() : '',
        correo: correo ? correo.value.trim() : '',
        carrera: document.getElementById('reg-carrera') ? document.getElementById('reg-carrera').value.trim() : '',
        semestre: document.getElementById('reg-semestre') ? document.getElementById('reg-semestre').value : '',
        talla: talla ? talla.value : '',
        esStaff: staffCheckbox ? staffCheckbox.checked : false,
        areaStaff: staffCheckbox && staffCheckbox.checked && areaStaff ? areaStaff.value : '',
        disponibilidad: staffCheckbox && staffCheckbox.checked && document.getElementById('reg-disponibilidad') ? document.getElementById('reg-disponibilidad').value.trim() : '',
        fechaRegistro: new Date().toISOString()
      };

      localStorage.setItem('synectisRegistro', JSON.stringify(registro));

      regFormStatus.textContent = '¡Registro confirmado! Redirigiendo a tu portal...';
      regFormStatus.classList.add('show','ok');

      setTimeout(() => {
        window.location.href = 'portal.html';
      }, 900);
    } else {
      const targetStep = (!nombre || !nombre.value.trim() || !emailOk) ? 'datos' : 'preferencias';
      const targetBtn = document.querySelector(`.modal-step-btn[data-step="${targetStep}"]`);
      if(targetBtn) targetBtn.click();

      regFormStatus.textContent = 'Revisa los campos marcados antes de continuar.';
      regFormStatus.classList.add('show');
    }
  });
}

/* ============================================================
   8. EVENTOS INTERACTIVOS (Galería de Actividades - CORREGIDO)
   ============================================================ */
const eventsData = {
  1: {
    badge: "Torneo de videojuegos",
    title: "Torneo de super smash",
    desc: "Demuestra tus habilidades en el torneo relámpago de la semana. Competencias con enfrentamientos directos y sorpresas para los finalistas.",
    date: "Viernes 13 de Noviembre",
    time: "12:00 hrs",
    location: "Edificio rojo"
  },
  2: {
    badge: "Entretenimiento & Comedia",
    title: "Sistemas tiene talento",
    desc: "Un espacio de distensión, risas, y diversión para los asistentes, con presentaciones de comedia, sketches y talentos ocultos de la comunidad estudiantil.",
    date: "Miércoles 11 de Noviembre",
    time: "12:00 hrs",
    location: "Explanada de sistemas"
  },
  3: {
    badge: "100 mexicanos versión sistemas",
    title: "100 sistemáticos",
    desc: "Un evento de preguntas y respuestas con temática de cultura general, sistemas, maestros, alumnos donde los asistentes podrán demostrar sus conocimientos y ganar premios.",
    date: "Lunes 09 de Noviembre",
    time: "13:00 hrs",
    location: "Edificio de sistemas"
  },
  4: {
    badge: "Tecnología & Concurso",
    title: "Buscando a Linux",
    desc: "Demuestra tu dominio encontrando archivos ocultos, configurando servicios y resolviendo retos en distribuciones Linux en el menor tiempo posible.",
    date: "Martes 10 de Noviembre",
    time: "11:00 hrs",
    location: "Laboratorio de Redes"
  },
  5: {
    badge: "Dinámica & Premios",
    title: "Lotería sistemática",
    desc: "Diviértete con la tradicional lotería adaptada con conceptos de ingeniería en sistemas. ¡Gana premios instantáneos completando tu tabla!",
    date: "Jueves 12 de Noviembre",
    time: "14:00 hrs",
    location: "Vestíbulo Principal"
  }
};

function showEventDetails(eventId) {
  document.querySelectorAll('.event-card-thumb').forEach(thumb => {
    thumb.classList.remove('active');
  });
  
  const activeThumb = document.querySelector(`.event-card-thumb[data-event="${eventId}"]`);
  if (activeThumb) {
    activeThumb.classList.add('active');
  }

  const panel = document.getElementById('eventDetailsPanel');
  if (!panel) return;

  panel.style.opacity = '0';
  panel.style.transform = 'translateY(10px)';

  setTimeout(() => {
    const data = eventsData[eventId];
    if (data) {
      const badge = document.getElementById('eventBadge');
      const title = document.getElementById('eventTitle');
      const desc = document.getElementById('eventDesc');
      const date = document.getElementById('eventDate');
      const time = document.getElementById('eventTime');
      const location = document.getElementById('eventLocation');

      if(badge) badge.innerText = data.badge;
      if(title) title.innerText = data.title;
      if(desc) desc.innerText = data.desc;
      if(date) date.innerText = data.date;
      if(time) time.innerText = data.time;
      if(location) location.innerText = data.location;
    }

    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 150);
}

// Inicialización segura con verificación de estado del documento
function initEventCards() {
  const cards = document.querySelectorAll('.event-card-thumb');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const eventId = card.getAttribute('data-event');
      showEventDetails(eventId);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEventCards);
} else {
  initEventCards();
}