# Contexto del proyecto · mamifera Nadia

Este archivo lo lee Claude Code automáticamente al abrir el repo.
Contiene lo que no se deduce leyendo el código.

---

## Qué es esto

Sitio web de **Nadia Ávila Salazar** — naturópata con especialización en la salud de las
mujeres, consultorio en Guadalajara. La marca es *mamifera Nadia · Consultora Ginebotánica*.

El sitio es la puerta de entrada a su consulta: explica su trabajo, recibe a la paciente
con un formulario clínico y la lleva a agendar por WhatsApp.

Forma parte de un sistema más grande: **Emi**, un agente de WhatsApp que atiende las
primeras preguntas, agenda las sesiones y manda recordatorios. El sitio y Emi deben
decir siempre lo mismo.

---

## Stack y por qué

HTML, CSS y JavaScript sin dependencias, sin framework y sin paso de compilación.
**No agregar React, Tailwind, bundlers ni gestores de paquetes** sin platicarlo antes:
es un sitio de cinco páginas que debe poder abrirse y editarse veinte años después.

El JS usa módulos ES (`type="module"`), así que el sitio **necesita un servidor local**;
con `file://` el navegador bloquea los módulos.

```bash
python3 -m http.server 5500     # o la extensión Live Server de VS Code
```

### Decisiones que ya se tomaron

| Decisión | Por qué |
|---|---|
| Menú y pie escritos completos en cada página | Sin build step, sin parpadeo al cargar, HTML completo para buscadores. Si cambias un enlace, cámbialo en los cinco archivos. |
| Una sola hoja de estilos | El sitio es chico; partirla añade peticiones sin ganar nada. |
| Publicaciones de Instagram curadas a mano | El método sin token solo funciona de una publicación a la vez (ver README). |
| Formulario homologado | Decisión de Nadia: las mismas 27 preguntas para consulta presencial y virtual, sin campos condicionales. **No volver a proponer ramas por modalidad.** |

---

## Sistema de diseño

Todo sale del manual de marca. **No inventes colores ni tipografías.** Los tokens están
en `:root`, al inicio de `assets/css/estilos.css`.

```
--crema  #F0E8D2   fondo general        (Savia mamífera claro · PANTONE 7506C)
--rojo   #8B2F2E   títulos, botones     (Savia mamífera · PANTONE 663C)
--morado #722C69   banda de suscripción (Misterio · PANTONE 249C)
--agua   #94C2C3   acento puntual       (Fluir · PANTONE 564C)
--tinta  #211915   texto y pie          (Muerte / Renacimiento)
```

Tipografías, las tres de Google Fonts y especificadas por el manual:
**IM Fell English** para títulos, **Cedarville Cursive** para subtítulos a mano,
**Averia Serif Libre** para cuerpo de texto.

Los ornamentos (`assets/img/ornamentos/`) son PNG con transparencia, ya recoloreados
a rojo savia. Si hace falta otro color, recolorea el PNG conservando el canal alfa —
no uses filtros CSS, ensucian el tono.

> Pendiente con la diseñadora: los hex escritos en el manual no coinciden con los
> swatches dibujados en el PDF, y Pantone 663C aparece asignado a dos colores distintos.
> Aquí se usan los hex escritos.

---

## Reglas de datos — leer antes de tocar el formulario

El formulario recoge **datos personales sensibles** (salud, historia gestacional y
menstrual, tratamientos). La arquitectura acordada los separa en dos lugares:

- **Datos de contacto** (nombre, teléfono, correo, residencia, fechas de sesión) → base de datos
- **Respuestas clínicas** → Google Drive de Nadia, identificadas **solo con un código opaco**

Quien implemente el `submit` debe respetar esto. En concreto:

1. El componente que parte el payload ve las dos mitades: es la frontera de confianza.
   Si se hace con n8n, **apagar el guardado del historial de ejecuciones** en ese workflow,
   o el expediente completo con nombre y teléfono queda almacenado ahí.
2. El código de expediente debe ser **aleatorio y opaco**. Nunca secuencial (`paciente-001`
   filtra volumen y es adivinable) ni derivado del teléfono (el espacio de números es tan
   chico que un hash se revierte por fuerza bruta).
3. La tabla que une nombres con códigos **no puede vivir en la misma Drive** que los
   expedientes, o la separación se colapsa en un clic.
4. El consentimiento debe registrarse **con fecha y hora**, atado a la persona identificable.
5. El consentimiento de marketing (bitácora por correo) es **independiente** del clínico.
   No se puede usar el correo del formulario para la lista de difusión.

**Nunca** poner datos bancarios en el sitio. Emi los comparte por WhatsApp solo a quien
ya está agendando.

**Emi no toca datos clínicos.** Esa frontera es intencional y no se mueve.

---

## Datos del negocio

Tomados de la configuración de Emi del **25 de septiembre de 2026**. Si cambian ahí,
hay que actualizarlos aquí — el sitio y Emi deben coincidir.

| | |
|---|---|
| Primera consulta presencial | $1,300 MXN · 120 min · 4 formulaciones |
| Primera consulta virtual | $1,800 MXN · 120 min · 5 formulaciones + envío |
| Cierre de cadera | $2,300 MXN · 180 min · presencial |
| Horario virtual | Lunes 10–12, miércoles 16–18, jueves 10–12 |
| Horario presencial | Viernes 11–20 |
| Agenda | Mínimo 24 h de anticipación, máximo 30 días |
| Cancelación | 24 h antes · 50% queda como saldo a favor |
| Consultorio | Calle Vidrio #1987, Col. Americana, Guadalajara |
| Público | Mujeres desde los 13 años o la primera menstruación, hasta los 100. Embarazadas y lactantes bienvenidas. No atiende hombres ni infancias. |
| Contacto | 33 1671 3442 · @mamifera_nadia · nadia.avilasalazar@gmail.com |
| Dominio | mamiferanadia.com (aún sin registrar) |

---

## Pendientes, en orden de importancia

1. **Conectar el envío del formulario** respetando las reglas de datos de arriba.
2. **Captura de correos** — la suscripción a la bitácora, con su consentimiento propio.
3. **Fotografía real.** Las imágenes actuales son los prototipos del manual (tónico,
   bolsa, tarjetas). Faltan retrato de Nadia y fotos del consultorio.
4. **Unificar el nombre de marca.** El manual dice *mamifera Nadia · Consultora
   Ginebotánica*; Emi dice *Consultorio Ginebotánica*; el PDF viejo decía *Acompañamiento
   & Consultoría Ginebotánica*.
5. **Publicaciones de Instagram** — pegar URLs reales en `assets/js/instagram.js`.
6. **Plantilla de entrada de blog** y la página de confirmación tras enviar el formulario.
7. **Enlace de videollamada** — en Emi está como `http://pendiente`.
8. **Consultas de seguimiento** — confirmar con Nadia si las sigue ofreciendo; en Emi
   no están dadas de alta, aunque su PDF anterior sí las tenía.
9. **Revisión legal del aviso de privacidad.** El texto actual es estructura, no asesoría.
10. **Categorías del blog** — las de `blog.html` son tentativas.

---

## Convenciones

- **Todo en español**: nombres de archivo, clases CSS, variables, comentarios y commits.
- Clases CSS descriptivas y cortas (`.card`, `.framed`, `.paso-form`), sin metodología
  tipo BEM — el sitio es chico y la hoja está comentada por secciones.
- Commits en español, imperativo, explicando el **por qué** cuando no sea obvio.
- Antes de dar algo por terminado: abrir la página en el navegador, revisar en 390px
  de ancho y confirmar que no hay desbordamiento horizontal ni errores en consola.
- Si un cambio afecta a Nadia (precios, horarios, política, alcance), decirlo
  explícitamente en vez de asumir — varias de esas decisiones son suyas, no técnicas.
