# Cómo aportar un gadget

Esto es práctica real de Git + Pull Request (lo mismo que ves en el curso de Linux+Git),
aplicado a algo que van a usar todos tus compañeros. 🎉

## Pasos

1. **Forkeá** este repo (botón *Fork* arriba a la derecha en GitHub).
2. **Cloná tu fork** y creá una rama con un nombre claro:
   ```bash
   git clone https://github.com/<tu-usuario>/itsp-gadgets.git
   cd itsp-gadgets
   git switch -c gadget/<id>      # ej: gadget/pomodoro
   ```
3. **Creá tu archivo** en `gadgets/<id>.js`. Copiá `gadgets/reloj.js` como base y leé [`CONTRATO.md`](CONTRATO.md).
4. **Probalo:** abrí `preview.html` en el navegador y mirá que tu tarjeta se vea bien.
5. **Validá:**
   ```bash
   node validar.js
   ```
   Tiene que decir que tu gadget pasó. Si marca algo, corregilo.
6. **Commiteá y subí:**
   ```bash
   git add gadgets/<id>.js
   git commit -m "gadget: <id>"
   git push origin gadget/<id>
   ```
7. **Abrí el Pull Request** desde GitHub hacia este repo. Contá en una línea qué hace tu gadget.

## Qué miramos al revisar

- ✅ Pasa `node validar.js` (el CI lo corre solo en tu PR).
- ✅ Cumple el [`CONTRATO.md`](CONTRATO.md): un archivo, `id` = nombre, usa `ctx.*`.
- ✅ Si trae datos de internet, el dominio está en la lista permitida.
- ✅ Usa `ctx.escapeHtml` con cualquier texto de afuera.
- ✅ Se ve bien en tema claro y oscuro (probalo en `preview.html`).
- ✅ Útil o lindo, y respetuoso (nada ofensivo).

## Qué NO entra

- Librerías externas, `<script>`, `eval`, `new Function(...)`.
- Pedir contraseñas, tokens o datos personales de otros.
- `fetch` a dominios fuera de la lista (si querés uno nuevo, proponelo en el PR y lo evaluamos).
- Backend, archivos fuera de `gadgets/`.

## Ideas para arrancar

- **Fácil:** sumar comandos a `comando` · un **Pomodoro** · una **frase del día** (lista estática).
- **Medio:** **Clima en Paysandú** (ya hay ejemplo), un **conversor** chiquito, una **calculadora**.
- **Con datos de la plataforma:** tus **apuntes recientes**, tu **racha de horas** (con `ctx.apiFetch`).

Cuando tu PR se aprueba, un docente lo lleva al escritorio real. ¡Tu gadget queda para toda la institución!
