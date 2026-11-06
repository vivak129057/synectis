/* ============================================================
   PORTAL.JS — Lógica del portal privado del asistente
   ============================================================ */

/* ------------------------------------------------------------
   0. "ACCESO SECRETO": solo entra quien tiene un registro guardado.
   Si no existe, lo regresamos a la landing page.
   NOTA: esto es solo una simulación en el navegador (localStorage).
   En un proyecto real, esta verificación la haría tu backend con
   un token de sesión o un inicio de sesión real.
   ------------------------------------------------------------ */
const accessGate = document.getElementById('accessGate');
let registro = null;

try {
  registro = JSON.parse(localStorage.getItem('synectisRegistro'));
} catch (err) {
  registro = null;
}

if (!registro) {
  // Sin registro guardado -> no hay acceso al portal
  window.location.href = 'index.html?acceso=requerido';
} else {
  // Acceso concedido: quitamos el candado
  accessGate.style.display = 'none';
}

/* ------------------------------------------------------------
   1. NAVBAR / MENÚ MÓVIL
   ------------------------------------------------------------ */
const portalNavToggle = document.getElementById('portalNavToggle');
const portalMobileMenu = document.getElementById('portalMobileMenu');

portalNavToggle.addEventListener('click', () => {
  const isOpen = portalMobileMenu.classList.toggle('open');
  portalNavToggle.setAttribute('aria-expanded', isOpen);
  portalNavToggle.textContent = isOpen ? '✕' : '☰';
});
portalMobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    portalMobileMenu.classList.remove('open');
    portalNavToggle.textContent = '☰';
  });
});

/* ------------------------------------------------------------
   2. CERRAR SESIÓN
   ------------------------------------------------------------ */
function logout(){
  localStorage.removeItem('synectisRegistro');
  localStorage.removeItem('synectisActividades');
  localStorage.removeItem('synectisTalleres');
  window.location.href = 'index.html';
}
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('logoutBtnMobile').addEventListener('click', logout);

/* ------------------------------------------------------------
   3. BIENVENIDA + RESUMEN DE REGISTRO
   ------------------------------------------------------------ */
function renderSummary(){
  if (!registro) return;

  document.getElementById('welcomeTitle').textContent = `Hola, ${registro.nombre || 'asistente'} 👋`;

  const summary = document.getElementById('profileSummary');
  summary.innerHTML = `
    <span class="chip">${registro.correo || 'sin correo'}</span>
    <span class="chip">${registro.carrera || 'Carrera no especificada'}</span>
    <span class="chip">${registro.semestre || 'Semestre no especificado'}</span>
    <span class="chip chip-accent">Talla: ${registro.talla || 'sin definir'}</span>
    <span class="chip ${registro.esStaff ? 'chip-cyan' : ''}">
      ${registro.esStaff ? 'Postulado como staff' : 'No postulado como staff'}
    </span>
  `;
}
renderSummary();

/* ------------------------------------------------------------
   4. FORMULARIO "MI PERFIL" (talla + staff)
   ------------------------------------------------------------ */
const profileForm = document.getElementById('profileForm');
const pTalla = document.getElementById('p-talla');
const pSemestre = document.getElementById('p-semestre');
const pStaff = document.getElementById('p-staff');
const pStaffExtra = document.getElementById('pStaffExtra');
const pAreaStaff = document.getElementById('p-area-staff');
const pDisponibilidad = document.getElementById('p-disponibilidad');
const profileStatus = document.getElementById('profileStatus');

// precargar los valores guardados del registro
if (registro){
  pTalla.value = registro.talla || '';
  pSemestre.value = registro.semestre || '';
  pStaff.checked = !!registro.esStaff;
  pStaffExtra.hidden = !registro.esStaff;
  pAreaStaff.value = registro.areaStaff || '';
  pDisponibilidad.value = registro.disponibilidad || '';
}

pStaff.addEventListener('change', () => {
  pStaffExtra.hidden = !pStaff.checked;
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  registro.talla = pTalla.value;
  registro.semestre = pSemestre.value;
  registro.esStaff = pStaff.checked;
  registro.areaStaff = pStaff.checked ? pAreaStaff.value : '';
  registro.disponibilidad = pStaff.checked ? pDisponibilidad.value.trim() : '';

  localStorage.setItem('synectisRegistro', JSON.stringify(registro));
  renderSummary();

  profileStatus.textContent = 'Cambios guardados correctamente.';
  profileStatus.classList.add('show','ok');
  setTimeout(() => profileStatus.classList.remove('show','ok'), 2200);

  // AQUÍ VA LA LÓGICA REAL DE ACTUALIZACIÓN (fetch/PUT a tu backend)
});

/* ------------------------------------------------------------
   5. ACTIVIDADES SELECCIONABLES
   ------------------------------------------------------------ */
const actividadesGrid = document.getElementById('actividadesGrid');
const saveActividadesBtn = document.getElementById('saveActividades');
const actividadesStatus = document.getElementById('actividadesStatus');

// precargar selección guardada
try {
  const savedActividades = JSON.parse(localStorage.getItem('synectisActividades')) || [];
  actividadesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = savedActividades.includes(cb.value);
  });
} catch (err) { /* sin selección previa */ }

saveActividadesBtn.addEventListener('click', () => {
  const seleccion = Array.from(actividadesGrid.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  localStorage.setItem('synectisActividades', JSON.stringify(seleccion));

  actividadesStatus.textContent = seleccion.length
    ? `Guardado: ${seleccion.length} actividad(es) seleccionada(s).`
    : 'No seleccionaste ninguna actividad todavía.';
  actividadesStatus.classList.add('show','ok');
  setTimeout(() => actividadesStatus.classList.remove('show','ok'), 2200);

  // AQUÍ VA LA LÓGICA REAL DE GUARDADO (fetch/POST a tu backend)
});

/* ------------------------------------------------------------
   6. TALLERES — TABS POR SEMESTRE + SELECCIÓN
   ------------------------------------------------------------ */
const portalTabButtons = document.querySelectorAll('#portalTabsBar .tab-btn');
const portalTabPanels = document.querySelectorAll('#talleres-portal .tab-panel');

portalTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    portalTabButtons.forEach(b => b.classList.remove('active'));
    portalTabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

const saveTalleresBtn = document.getElementById('saveTalleres');
const talleresStatus = document.getElementById('talleresStatus');

// precargar selección guardada de talleres
try {
  const savedTalleres = JSON.parse(localStorage.getItem('synectisTalleres')) || [];
  document.querySelectorAll('#talleres-portal input[name="taller"]').forEach(cb => {
    cb.checked = savedTalleres.includes(cb.value);
  });
} catch (err) { /* sin selección previa */ }

saveTalleresBtn.addEventListener('click', () => {
  const seleccion = Array.from(document.querySelectorAll('#talleres-portal input[name="taller"]:checked'))
    .map(cb => cb.value);

  localStorage.setItem('synectisTalleres', JSON.stringify(seleccion));

  talleresStatus.textContent = seleccion.length
    ? `Guardado: ${seleccion.length} taller(es) seleccionado(s).`
    : 'No seleccionaste ningún taller todavía.';
  talleresStatus.classList.add('show','ok');
  setTimeout(() => talleresStatus.classList.remove('show','ok'), 2200);

  // AQUÍ VA LA LÓGICA REAL DE GUARDADO (fetch/POST a tu backend)
});

/* ------------------------------------------------------------
   7. ITINERARIO — TABS POR DÍA
   ------------------------------------------------------------ */
const portalItinButtons = document.querySelectorAll('#portalItinTabs .itin-tab-btn');
const portalItinPanels = document.querySelectorAll('#itinerario-portal .itin-day');

portalItinButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    portalItinButtons.forEach(b => b.classList.remove('active'));
    portalItinPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.querySelector(`[data-itin-panel="${btn.dataset.itinDay}"]`).classList.add('active');
  });
});
