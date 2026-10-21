# itsp-gadgets

Gadgets para el **escritorio de Workspace ITSP** — las tarjetas que los estudiantes
pueden prender sobre el fondo (Mi progreso, Post-it, Comando del día, etc.).

Este repo es el **lugar donde cualquier estudiante puede aportar un gadget nuevo**. Un
aporte es **un solo archivo** en `gadgets/`. Si pasa la revisión, un docente lo copia al
entorno real y queda disponible para todos.

```
┌──────────────────────┐
│  🏆 Mi progreso      │   ← cada tarjeta es un gadget
│  ████████░░  8/12    │
└──────────────────────┘
```

## ¿Qué es un gadget?

Un archivo JS que se registra con una función y pinta una tarjeta:

```js
registrarGadget('reloj', {
  name: 'Reloj',
  icon: 'clock',
  every: 1000,                 // opcional: re-dibuja cada N ms
  render(body, ctx) {
    body.innerHTML = '<div class="gd-sum">' + new Date().toLocaleTimeString() + '</div>';
  }
});
```

- **Empezá por acá:** [`CONTRATO.md`](CONTRATO.md) — qué podés usar y cómo.
- **Qué datos podés traer de la plataforma:** [`DATOS.md`](DATOS.md).
- **Cómo aportar (paso a paso):** [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **Ejemplos** (copiá el que más se parezca a tu idea):
  - [`gadgets/reloj.js`](gadgets/reloj.js) — simple, sin datos externos.
  - [`gadgets/clima.js`](gadgets/clima.js) — trae datos de **internet** (`fetch` a un dominio permitido).
  - [`gadgets/medallas.js`](gadgets/medallas.js) — trae **tus datos** de la plataforma (`ctx.apiFetch`).
  - [`gadgets/ranking.js`](gadgets/ranking.js) — trae datos de la **institución** (`ctx.apiFetch`).

## Probarlo sin la plataforma

Abrí **`preview.html`** en tu navegador (doble clic). Es un banco de pruebas que carga
tus gadgets con datos de ejemplo, así ves cómo quedan antes de mandar el PR.

## Validar tu gadget

```bash
node validar.js
```

Revisa que tu archivo esté bien escrito y cumpla las reglas. **El mismo chequeo corre
solo en cada Pull Request** — si pasa en verde, está listo para revisión.
