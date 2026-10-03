# mamifera Nadia · Consultora Ginebotánica

Sitio web de [Nadia Ávila Salazar](https://www.instagram.com/mamifera_nadia/) — naturópata con
especialización en la salud de las mujeres, Guadalajara.

Sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación.
Se abre dando doble clic en `index.html`.

---

## Correrlo en local

El sitio usa módulos de JavaScript (`type="module"`), y los navegadores los bloquean cuando
el archivo se abre con `file://`. Necesitas un servidor local — cualquiera sirve:

```bash
# Opción 1 · Python (ya viene en macOS)
python3 -m http.server 5500

# Opción 2 · Node
npx serve .
```

En VS Code, lo más cómodo es la extensión **Live Server**: clic derecho sobre `index.html`
→ *Open with Live Server*.

---

## Estructura

```
mamifera-nadia/
├── index.html           Home
├── servicios.html       Primera consulta y Cierre de cadera
├── blog.html            Listado de la bitácora
├── formulario.html      Cuerpo de Revelaciones (27 preguntas en 6 pasos)
├── privacidad.html      Aviso de privacidad y política de cancelación
└── assets/
    ├── css/estilos.css  Hoja de estilos única, comentada por secciones
    ├── js/
    │   ├── main.js      Menú móvil, formulario por pasos, arranque
    │   └── instagram.js Galería de publicaciones de Instagram
    └── img/
        ├── logos/       Logotipos y sellos del manual de marca
        ├── ornamentos/  Marcos florales y flourishes, recoloreados a rojo savia
        └── fotos/       Fotografías de los prototipos del manual
```

El menú y el pie están escritos completos en cada página, a propósito: sin build step,
sin parpadeo al cargar y con el HTML completo para los buscadores. Si cambias un enlace
del menú, recuerda cambiarlo en los cinco archivos.

---

## Sistema de diseño

Todo sale del manual de marca. Los tokens viven en `:root`, al inicio de `estilos.css`.

### Paleta

| Nombre en el manual | Variable CSS | Hex | Pantone | Uso en el sitio |
|---|---|---|---|---|
| Savia mamífera claro | `--crema` | `#F0E8D2` | 7506C | Fondo general |
| Savia mamífera | `--rojo` | `#8B2F2E` | 663C | Títulos, botones, ornamentos |
| Misterio | `--morado` | `#722C69` | 249C | Banda de suscripción |
| Fluir | `--agua` | `#94C2C3` | 564C | Acento puntual sobre fondo oscuro |
| Muerte / Renacimiento | `--tinta` | `#211915` | 663C | Texto y pie |

> **Dos cosas que verificar con la diseñadora.** Los hex escritos en el manual no coinciden
> con los swatches dibujados en el PDF (el morado impreso dice `#722C69` pero el rectángulo
> está en `#81237E`; el rojo dice `#8B2F2E` y está en `#A3262D`) — es el desfase típico de
> CMYK a RGB. Aquí se usan los hex escritos. Además, **Pantone 663C aparece asignado a dos
> colores distintos**, el casi-negro y el rojo; uno de los dos está mal.

### Tipografía

Las tres son de Google Fonts y se cargan por CDN. Son exactamente las que el manual
especifica en su sección *Tipografía en web*.

| Rol | Fuente | Variable |
|---|---|---|
| Títulos | IM Fell English | `--titulo` |
| Subtítulo o contraste | Cedarville Cursive | `--mano` |
| Cuerpo de texto | Averia Serif Libre | `--sans` |

Las fuentes de redes sociales del manual (Nadira Pro, Curly Blush, Whimney Catcher)
**no** se usan en el sitio.

### Ornamentos

Los marcos y flourishes del *universo gráfico* vienen en PNG con transparencia. En el manual
son de línea negra; aquí están recoloreados a rojo savia para que pertenezcan a la paleta.
Si necesitas otro color, recolorea el PNG conservando el canal alfa — no uses filtros CSS,
que ensucian el tono.

---

## Instagram

`assets/js/instagram.js` arma la galería de publicaciones del Home.

### Cómo agregar publicaciones

Abre el archivo y pega las URLs en el arreglo `PUBLICACIONES`:

```js
const PUBLICACIONES = [
  'https://www.instagram.com/p/ABC123xyz/',
  'https://www.instagram.com/p/DEF456uvw/',
  'https://www.instagram.com/reel/GHI789rst/',
];
```

Guarda y listo. Mientras el arreglo esté vacío, la sección muestra huecos punteados
indicando dónde van.

### Por qué está curado y no es un feed automático

Desde el **15 de junio de 2026** Meta volvió a permitir incrustar publicaciones públicas
sin token de acceso ni revisión de app — basta el `<blockquote class="instagram-media">`
más el `embed.js` oficial. Eso es lo que usa este módulo: cero costo, cero backend,
cero mantenimiento.

El límite es que el método sin token funciona **de una publicación a la vez**. No hay forma
de traer el feed completo de la cuenta sin autenticarse.

Si algún día se quiere feed automático hacen falta tres cosas: que la cuenta sea
**profesional** (creador o empresa), una app registrada en Meta usando la
**Instagram API con Instagram Login** (la que reemplazó a la Basic Display API el
4 de diciembre de 2024), y un proceso que **refresque el token cada 60 días** — es decir,
un backend pequeño que mantener. La alternativa es un widget de pago tipo LightWidget,
Behold o Smash Balloon, que resuelven el token a cambio de una suscripción.

### Detalles de la implementación

- Los iframes de Instagram pesan, así que el script se carga con `IntersectionObserver`,
  solo cuando la sección está por entrar en pantalla.
- Si `embed.js` no carga (bloqueador, sin red), cada publicación cae a una tarjeta
  con enlace en lugar de dejar un hueco roto.
- Instagram inyecta iframes con ancho mínimo propio; `estilos.css` lo neutraliza en
  la sección `.ig-grid` para que no desborden en móvil.

---

## Formulario

`formulario.html` son las 27 preguntas del *Cuerpo de Revelaciones*, homologadas:
las mismas para consulta presencial y virtual. El reparto en 6 pasos lo maneja
`main.js`, validando solo el paso visible antes de avanzar.

**El envío todavía no está conectado.** Según lo acordado, la arquitectura separa
los datos en dos lugares:

- **Datos de contacto** (nombre, teléfono, correo, residencia) → base de datos
- **Respuestas clínicas** → Google Drive de Nadia, identificadas solo con un código opaco

Quien implemente el `submit` debe respetar esa separación y registrar el consentimiento
con fecha y hora. Notas importantes:

- El componente que parte el payload ve ambas mitades: es la frontera de confianza.
  Si se hace con n8n, hay que **apagar el guardado del historial de ejecuciones** en
  ese workflow, o el expediente completo queda almacenado ahí.
- El código de expediente debe ser **aleatorio y opaco** — nunca secuencial ni derivado
  del teléfono (el espacio de números telefónicos es tan chico que un hash se revierte
  por fuerza bruta).
- La tabla que une nombres con códigos **no puede vivir en la misma Drive** que los
  expedientes, o la separación se colapsa.

---

## Pendientes

- [x] **Retrato y fotos de la práctica.** Portada y servicios ya usan fotos de Nadia.
- [ ] **Fotos del consultorio.** Las tarjetas del blog y la primera consulta de servicios
      siguen con prototipos del manual (tónico, bolsa, tarjetas).
- [x] **Publicaciones de Instagram.** Tres reels en `assets/js/instagram.js`.
- [ ] **Nombre de marca.** El manual dice *mamifera Nadia · Consultora Ginebotánica*; su
      configuración de Emi dice *Consultorio Ginebotánica*; el PDF viejo decía *Acompañamiento
      & Consultoría Ginebotánica*. Hay que unificarlo.
- [ ] **Enlace de videollamada.** En la configuración de Emi está como `http://pendiente`.
- [ ] **Consultas de seguimiento.** El PDF anterior las tenía ($800, $1,200, $700) pero no
      están dadas de alta en Emi. Confirmar si siguen ofreciéndose.
- [ ] **Categorías del blog.** Las de `blog.html` son tentativas.
- [ ] **Aviso de privacidad.** El texto de `privacidad.html` es una estructura base, no
      asesoría legal. Debe revisarlo un abogado antes de publicar.
- [ ] **Conectar el envío del formulario** y la captura de correos.
- [ ] **Dominio.** `mamiferanadia.com` ya aparece en las tarjetas del manual.

---

## Datos del negocio en el sitio

Tomados de la configuración de Emi del 25 de septiembre de 2026. Si cambian ahí,
hay que actualizarlos aquí también.

| | |
|---|---|
| Primera consulta presencial | $1,300 MXN · 120 min · 4 formulaciones |
| Primera consulta virtual | $1,800 MXN · 120 min · 5 formulaciones + envío |
| Cierre de cadera | $2,300 MXN · 180 min · presencial |
| Horario virtual | Lunes 10–12, miércoles 16–18, jueves 10–12 |
| Horario presencial | Viernes 11–20 |
| Agenda | Mínimo 24 h de anticipación, máximo 30 días |
| Cancelación | 24 h antes · 50% queda como saldo a favor |
| Acompañamiento | 24/7 por WhatsApp durante el protocolo (30 días), directo con Nadia. Emi solo agenda citas |
| Consultorio | Calle Vidrio #1987, Col. Americana, Guadalajara |

Los **datos bancarios no están en el sitio** y no deben agregarse: Emi los comparte por
WhatsApp solo a quien ya está agendando.
