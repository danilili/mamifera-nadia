/* =============================================================
   main.js · Comportamiento común del sitio
   Se carga como módulo: <script type="module" src="assets/js/main.js">
   ============================================================= */

import { iniciarInstagram } from './instagram.js';

/* ---------- 1. Menú móvil ---------- */
function menuMovil() {
  const btn = document.querySelector('.menu-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const abierto = document.body.classList.toggle('menu-abierto');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  // Al tocar un enlace, cerrar
  document.querySelectorAll('.nav nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('menu-abierto'))
  );
}

/* ---------- 2. Marcar el enlace de la página actual ---------- */
function enlaceActivo() {
  const actual = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav nav a').forEach(a => {
    if (a.getAttribute('href') === actual) a.setAttribute('aria-current', 'page');
  });
}

/* ---------- 3. Año del pie ---------- */
function anio() {
  document.querySelectorAll('[data-anio]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- 4. Formulario por pasos ---------- */
/* El formulario clínico son 27 preguntas. Mostrarlas todas de golpe
   desanima; se reparten en 6 pasos con el avance visible.
   El envío real todavía no está conectado — ver README. */
function formularioPasos() {
  const form = document.querySelector('[data-form-pasos]');
  if (!form) return;

  const pasos  = [...form.querySelectorAll('.paso-form')];
  const barra  = form.querySelector('.barra');
  const btnAnt = form.querySelector('[data-anterior]');
  const btnSig = form.querySelector('[data-siguiente]');
  const btnEnv = form.querySelector('[data-enviar]');
  let i = 0;

  // Construir la barra de avance
  pasos.forEach(() => barra.appendChild(document.createElement('span')));
  const tramos = [...barra.children];

  function mostrar(n) {
    i = Math.max(0, Math.min(n, pasos.length - 1));
    pasos.forEach((p, k) => p.classList.toggle('activo', k === i));
    tramos.forEach((t, k) => t.classList.toggle('ok', k <= i));
    btnAnt.style.visibility = i === 0 ? 'hidden' : 'visible';
    btnSig.hidden = i === pasos.length - 1;
    btnEnv.hidden = i !== pasos.length - 1;
    form.querySelector('[data-paso-actual]').textContent = i + 1;
    window.scrollTo({ top: form.offsetTop - 90, behavior: 'smooth' });
  }

  btnSig.addEventListener('click', () => {
    // Validación nativa solo del paso visible
    const invalido = pasos[i].querySelector(':invalid');
    if (invalido) { invalido.reportValidity(); return; }
    mostrar(i + 1);
  });
  btnAnt.addEventListener('click', () => mostrar(i - 1));

  form.querySelector('[data-total-pasos]').textContent = pasos.length;
  mostrar(0);
}

/* ---------- 5. Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  menuMovil();
  enlaceActivo();
  anio();
  formularioPasos();
  iniciarInstagram();
});
