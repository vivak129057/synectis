/* ============================================================
   1. NAVBAR: cambia de fondo al hacer scroll
   ============================================================ 
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});*/

/* Menú móvil */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
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
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* ============================================================
   3. VALIDACIÓN BÁSICA DEL FORMULARIO DE CONTACTO
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('mensaje');

  const setError = (input, hasError) => {
    const wrapper = input.closest('.form-field');
    wrapper.classList.toggle('error', hasError);
    if (hasError) valid = false;
  };

  setError(nombre, nombre.value.trim() === '');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  setError(correo, !emailOk);

  setError(mensaje, mensaje.value.trim() === '');

  formStatus.classList.remove('show','ok');

  if (valid) {
    formStatus.textContent = '¡Gracias! Tu mensaje fue enviado.';
    formStatus.classList.add('show','ok');
    contactForm.reset();
    // AQUÍ VA LA LÓGICA REAL DE ENVÍO (fetch a tu backend, EmailJS, etc.)
  } else {
    formStatus.textContent = 'Por favor completa los campos marcados.';
    formStatus.classList.add('show');
  }
});

/* ============================================================
   4. ELEMENTO FIRMA: red de nodos sinápticos animada (hero)
   Representa la síntesis de elementos distintos — el concepto
   central de "Synectis".
   ============================================================ */
(function buildSynapseGrid(){
  const svg = document.getElementById('synapseSvg');
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

  // líneas entre nodos cercanos
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
   Le da "vida" a todas las secciones (no solo el hero): las
   tarjetas y títulos entran suavemente cuando aparecen en pantalla.
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
   Mueve el contenido y la red de nodos en direcciones opuestas
   al mover el mouse, para dar sensación de profundidad "gamer".
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
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openModalBtns.forEach(btn => btn.addEventListener('click', openModal));

/* Si alguien intentó entrar directo a portal.html sin haberse
   registrado, lo regresamos aquí con ?acceso=requerido y le
   abrimos el modal de registro automáticamente. */
if (new URLSearchParams(window.location.search).get('acceso') === 'requerido') {
  openModal();
  const hint = document.getElementById('regFormStatus');
  hint.textContent = 'Primero completa tu registro para entrar a tu portal de asistente.';
  hint.classList.add('show');
}
modalClose.addEventListener('click', closeModal);

// cerrar al hacer clic fuera del cuadro del modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

/* ---- pestañas internas del modal: Datos / Preferencias / Itinerario ---- */
const stepButtons = document.querySelectorAll('.modal-step-btn');
const stepPanels = document.querySelectorAll('.modal-step-panel');

stepButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    stepButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    stepPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    document.querySelector(`[data-step-panel="${btn.dataset.step}"]`).classList.add('active');
  });
});

/* ---- pestañas de días dentro del itinerario ---- */
const itinTabButtons = document.querySelectorAll('.itin-tab-btn');
const itinDayPanels = document.querySelectorAll('.itin-day');

itinTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    itinTabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    itinDayPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    document.querySelector(`[data-itin-panel="${btn.dataset.itinDay}"]`).classList.add('active');
  });
});

/* ---- casilla "postularme como staff": muestra campos extra ---- */
const staffCheckbox = document.getElementById('reg-staff');
const staffExtra = document.getElementById('staffExtra');

staffCheckbox.addEventListener('change', () => {
  staffExtra.hidden = !staffCheckbox.checked;
});

/* ---- validación del formulario de registro ---- */
const registroForm = document.getElementById('registroForm');
const regFormStatus = document.getElementById('regFormStatus');

registroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const nombre = document.getElementById('reg-nombre');
  const correo = document.getElementById('reg-correo');
  const talla  = document.getElementById('reg-talla');
  const areaStaff = document.getElementById('reg-area-staff');

  const setError = (input, hasError) => {
    const wrapper = input.closest('.form-field');
    wrapper.classList.toggle('error', hasError);
    if (hasError) valid = false;
  };

  setError(nombre, nombre.value.trim() === '');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  setError(correo, !emailOk);

  setError(talla, talla.value === '');

  // si la persona quiere ser staff, el área es obligatoria
  if (staffCheckbox.checked){
    setError(areaStaff, areaStaff.value === '');
  }

  regFormStatus.classList.remove('show','ok');

  if (valid) {
    // Construimos el objeto con los datos del asistente.
    // AQUÍ, en un proyecto real, en vez de guardar en localStorage
    // enviarías estos datos a tu backend (fetch/POST) y el backend
    // te devolvería un token o ID de sesión para el portal.
    const registro = {
      nombre: nombre.value.trim(),
      correo: correo.value.trim(),
      carrera: document.getElementById('reg-carrera').value.trim(),
      semestre: document.getElementById('reg-semestre').value,
      talla: talla.value,
      esStaff: staffCheckbox.checked,
      areaStaff: staffCheckbox.checked ? areaStaff.value : '',
      disponibilidad: staffCheckbox.checked ? document.getElementById('reg-disponibilidad').value.trim() : '',
      fechaRegistro: new Date().toISOString()
    };

    localStorage.setItem('synectisRegistro', JSON.stringify(registro));

    regFormStatus.textContent = '¡Registro confirmado! Redirigiendo a tu portal...';
    regFormStatus.classList.add('show','ok');

    // Pequeña pausa para que la persona alcance a leer el mensaje
    // antes de mandarla al "acceso secreto" (portal.html).
    setTimeout(() => {
      window.location.href = 'portal.html';
    }, 900);
  } else {
    // si hay error, siempre regresa a la pestaña de Datos o Preferencias según corresponda
    const targetStep = (!nombre.value.trim() || !emailOk) ? 'datos' : 'preferencias';
    document.querySelector(`.modal-step-btn[data-step="${targetStep}"]`).click();

    regFormStatus.textContent = 'Revisa los campos marcados antes de continuar.';
    regFormStatus.classList.add('show');
  }
});

const eventsData = {
  1: {
    badge: "Competencia E-Sports",
    title: "Torneo de super smash",
    desc: "Demuestra tus habilidades en el torneo relámpago de la semana. Competencias en títulos multijugador con enfrentamientos directos y sorpresas para los finalistas.",
    date: "Viernes 13 de Noviembre",
    time: "12:00 hrs",
    location: "pendiente de confirmación"
  },
  2: {
    badge: "Entretenimiento & Comedia",
    title: "Sistemas tiene talento",
    desc: "Un espacio de distensión, risas, y diversión para los asistentes, con presentaciones de comedia, sketches y talentos ocultos de la comunidad estudiantil.",
    date: " Miercoles 11 de Noviembre",
    time: "12:00 hrs",
    location: "Explanada de sistemas"
  },
  3: {
    badge: "La nostalgia de 100 mexicanos",
    title: "100 sistematicos",
    desc: "Un evento de preguntas y respuestas con temática de cultura general, sistemas, maestros, alumnos donde los asistentes podrán demostrar sus conocimientos y ganar premios.",
    date: "Lunes 09 de Noviembre",
    time: "13:00 hrs",
    location: "Edificio de sistemas"
  },
  4: {
    badge: "Gran Sorteo Anual",
    title: "Rifa de Premios Synectis 2026",
    desc: "Participa con tu registro al simposio en la rifa de los equipos tecnológicos principales al finalizar el evento del cierre oficial.",
    date: "Viernes 13 de Noviembre (Clausura)",
    time: "12:30 hrs",
    location: "Gimnasio Auditorio"
  }
};

function showEventDetails(eventId) {
  // Cambiar clases activas en las miniaturas
  document.querySelectorAll('.event-card-thumb').forEach(thumb => {
    thumb.classList.remove('active');
  });
  document.querySelector(`[data-event="${eventId}"]`).classList.add('active');

  // Actualizar contenido de la tarjeta de detalles con animación sutil
  const panel = document.getElementById('eventDetailsPanel');
  panel.style.opacity = '0';
  panel.style.transform = 'translateY(10px)';

  setTimeout(() => {
    const data = eventsData[eventId];
    document.getElementById('eventBadge').innerText = data.badge;
    document.getElementById('eventTitle').innerText = data.title;
    document.getElementById('eventDesc').innerText = data.desc;
    document.getElementById('eventDate').innerText = data.date;
    document.getElementById('eventTime').innerText = data.time;
    document.getElementById('eventLocation').innerText = data.location;

    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 150);
}


