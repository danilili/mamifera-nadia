/* =============================================================
   instagram.js · Galería de publicaciones de Instagram
   -------------------------------------------------------------
   CÓMO FUNCIONA

   Desde el 15 de junio de 2026 Meta volvió a permitir incrustar
   publicaciones públicas sin token de acceso ni revisión de app:
   basta el <blockquote class="instagram-media"> más el script
   oficial embed.js. Eso es lo que usa este módulo.

   Límite importante: el método sin token es de UNA publicación a
   la vez. No existe forma de traer el feed completo de la cuenta
   sin autenticación. Por eso aquí se curan las publicaciones a
   mano — que además deja elegir cuáles representan mejor a Nadia.

   Si algún día se quiere feed automático hace falta la
   "Instagram API con Instagram Login", cuenta profesional, app en
   Meta y un proceso que refresque el token cada 60 días.

   -------------------------------------------------------------
   CÓMO ACTUALIZAR LAS PUBLICACIONES

   1. Abre la publicación en instagram.com
   2. Menú "..." → "Insertar" → copia la URL, o simplemente
      copia la del navegador: https://www.instagram.com/p/ABC123/
   3. Pégala en el arreglo PUBLICACIONES de abajo
   4. Guarda. No hay nada más que hacer.

   Deben ser publicaciones PÚBLICAS. Reels funcionan igual.
   ============================================================= */

const PUBLICACIONES = [
  'https://www.instagram.com/reel/C6KQhVRu2CW/',
  'https://www.instagram.com/p/DdANL_gqXo8/',
  'https://www.instagram.com/p/DbwXtLHqSeo/',
];

const PERFIL = 'https://www.instagram.com/mamifera_nadia/';
const SLOTS_VACIOS = 3;          // cuántos huecos mostrar mientras no hay URLs
const SCRIPT_IG = 'https://www.instagram.com/embed.js';

/* ------------------------------------------------------------- */

let scriptPedido = false;

function cargarScriptInstagram() {
  return new Promise((resolve, reject) => {
    if (window.instgrm) return resolve();
    if (scriptPedido) {
      // Ya se está cargando: esperamos a que aparezca
      const t = setInterval(() => {
        if (window.instgrm) { clearInterval(t); resolve(); }
      }, 150);
      setTimeout(() => { clearInterval(t); reject(new Error('timeout')); }, 8000);
      return;
    }
    scriptPedido = true;
    const s = document.createElement('script');
    s.src = SCRIPT_IG;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('no se pudo cargar embed.js'));
    document.head.appendChild(s);
  });
}

function blockquote(url) {
  const bq = document.createElement('blockquote');
  bq.className = 'instagram-media';
  bq.setAttribute('data-instgrm-permalink', url);
  bq.setAttribute('data-instgrm-version', '14');
  // Sin data-instgrm-captioned: con el texto completo cada embed pasaba
  // de 1,400 px de alto. El texto sigue a un clic, en Instagram.
  // Contenido de respaldo: si embed.js no carga, al menos queda el enlace
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = 'Ver esta publicación en Instagram';
  bq.appendChild(a);
  return bq;
}

function tarjetaRespaldo(url) {
  const div = document.createElement('div');
  div.className = 'ig-fallback';
  div.innerHTML =
    '<p class="mano-sm">Instagram</p>' +
    '<p class="muted" style="font-size:.92rem">No pudimos cargar la vista previa.</p>' +
    '<a class="btn btn-ghost" href="' + url + '" target="_blank" rel="noopener">Ver publicación</a>';
  return div;
}

function slotVacio() {
  const div = document.createElement('div');
  div.className = 'ig-slot';
  div.innerHTML =
    '<img src="assets/img/logos/sello-rojo.png" alt="">' +
    '<span>Pega aquí la URL de una publicación<br><code>assets/js/instagram.js</code></span>';
  return div;
}

function pintar(contenedor) {
  contenedor.innerHTML = '';

  if (!PUBLICACIONES.length) {
    for (let i = 0; i < SLOTS_VACIOS; i++) contenedor.appendChild(slotVacio());
    return;
  }

  PUBLICACIONES.forEach(url => contenedor.appendChild(blockquote(url)));

  cargarScriptInstagram()
    .then(() => {
      window.instgrm.Embeds.process();
      // Si a los 6 s algún blockquote sigue sin convertirse en iframe,
      // lo cambiamos por una tarjeta con enlace para no dejar huecos rotos.
      setTimeout(() => {
        contenedor.querySelectorAll('blockquote.instagram-media').forEach(bq => {
          if (!bq.querySelector('iframe')) {
            const url = bq.getAttribute('data-instgrm-permalink');
            bq.replaceWith(tarjetaRespaldo(url));
          }
        });
      }, 6000);
    })
    .catch(() => {
      contenedor.innerHTML = '';
      PUBLICACIONES.forEach(url => contenedor.appendChild(tarjetaRespaldo(url)));
    });
}

export function iniciarInstagram() {
  const contenedor = document.querySelector('[data-instagram]');
  if (!contenedor) return;

  const enlace = document.querySelector('[data-instagram-perfil]');
  if (enlace) enlace.href = PERFIL;

  // Los iframes de Instagram pesan: los cargamos solo cuando la
  // sección está por entrar en pantalla.
  if (!('IntersectionObserver' in window)) { pintar(contenedor); return; }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => {
      if (e.isIntersecting) { pintar(contenedor); o.disconnect(); }
    });
  }, { rootMargin: '300px' });

  obs.observe(contenedor);
}
