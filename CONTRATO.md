# Contrato de un gadget

Un gadget es un archivo `gadgets/<id>.js` que llama una sola vez a `registrarGadget`:

```js
registrarGadget('<id>', {
  name: 'Nombre visible',     // texto que ve el usuario
  icon: 'clock',              // nombre de ícono Lucide (https://lucide.dev/icons)
  every: 60000,              // opcional: re-dibuja cada N milisegundos (omitir si es estático)
  render(body, ctx) {         // dibuja el contenido de la tarjeta
    // body  = el <div> de la tarjeta donde escribís tu HTML
    // ctx   = caja de herramientas (ver abajo)
  }
});
```

- El **`<id>` debe ser igual al nombre del archivo**: `gadgets/reloj.js` → `registrarGadget('reloj', …)`.
- `render` puede ser `async` si necesitás esperar datos.
- No pongas `<script>`, no cargues librerías externas, no uses `eval`. El validador los rechaza.

## La caja de herramientas (`ctx`)

Usá **siempre** `ctx.*`. Es lo único que tu gadget puede tocar del sistema:

| Herramienta | Qué hace |
|---|---|
| `ctx.escapeHtml(texto)` | Limpia texto antes de meterlo en el HTML. **Usalo con cualquier dato** (de internet, del usuario). |
| `ctx.iconSVG('nombre')` | Devuelve el `<svg>` de un ícono Lucide para insertar en tu HTML. |
| `ctx.apiFetch(ruta)` | Pide datos a la propia plataforma (ej. `ctx.apiFetch('/api1/notas')`). Devuelve el JSON ya parseado. **Qué datos hay disponibles → [`DATOS.md`](DATOS.md).** |
| `ctx.showToast(mensaje)` | Muestra un avisito abajo a la derecha. |
| `ctx.openApp('id')` | Abre una app del escritorio. |
| `ctx.chatConUsuario('uid')` | Abre el chat privado con alguien. |

## Clases de estilo listas para usar

No escribas CSS propio salvo que haga falta; reusá estas clases (ya se ven bien en claro y oscuro):

| Clase | Para qué |
|---|---|
| `gd-sum` | Línea de resumen arriba (número grande con `<b>`). |
| `gd-empty` | Mensaje cuando no hay datos / error. |
| `gd-scroll` | Contenedor con scroll si la lista es larga. |
| `gd-row` | Fila clickeable de una lista. |
| `gd-bar` | Barra de progreso (`<div class="gd-bar"><div style="width:70%"></div></div>`). |

## Reglas (las revisa el validador)

1. **Datos de internet:** si usás `fetch`, el dominio tiene que estar en la lista permitida
   (ver `validar.js` → `DOMINIOS_PERMITIDOS`). Hoy: `api.open-meteo.com`, `hacker-news.firebaseio.com`.
   Para datos de la plataforma, usá `ctx.apiFetch` (no hace falta allowlist).
2. **Nada de backend ni secretos:** un gadget es 100% navegador. No pidas contraseñas ni claves de API.
3. **Siempre `ctx.escapeHtml`** sobre cualquier texto que venga de afuera, antes de ponerlo en `innerHTML`.
4. **Degradá con elegancia:** si falla una petición, mostrá un `gd-empty`, no rompas.
5. **Un archivo, un gadget.** El `id` = el nombre del archivo.
