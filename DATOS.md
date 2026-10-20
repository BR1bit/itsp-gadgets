# Datos que podés traer con `ctx.apiFetch`

`ctx.apiFetch('<ruta>')` le pide datos a la propia plataforma y te devuelve el JSON ya parseado.
Corre como vos (el alumno logueado), así que los datos "tuyos" salen de tu sesión.

**Patrón de uso (copialo):**
```js
const d = await ctx.apiFetch('/api1/mis-certificados');
if (!d || !d.ok) { body.innerHTML = '<div class="gd-empty">No se pudo cargar.</div>'; return; }
// ... usar d
```
Casi todo devuelve `{ ok: true, ... }`. Si `ok` es falso o no hay respuesta, mostrá un `gd-empty`.

> Estos son los endpoints disponibles **hoy**. Si necesitás un dato que no está, proponelo en tu PR:
> si hace falta un endpoint nuevo, lo agrega un docente del lado de la plataforma.

## Tus datos (de tu propia cuenta)

| Ruta | Devuelve (claves principales) | Idea de gadget |
|---|---|---|
| `/api1/mis-certificados` | `{ ok, linux, linux2, html, mysql, java, java2, arq, docker, api, misiones, misiones_ciber, misiones_websec }` — cada uno `true`/`false` | **Mis medallas**: grilla de certificados obtenidos/pendientes |
| `/api1/gadgets/progreso` | `{ ok, certificados, certificados_max, cursos:[{id,nombre,cert,hechos,total}] }` | *(lo usa "Mi progreso")* |
| `/api1/desafio/progreso` | `{ ok, progreso: { <curso_id>: [ids resueltos] } }` | **Próximo desafío**: qué te falta del curso actual |
| `/api1/notas` | `{ ok, contenido }` (y `POST {contenido}` para guardar) | *(lo usa "Post-it")* |
| `/api1/mis-proyectos` | `{ ok, proyectos:[{name,type,size,date,...}] }` | **Mis sitios**: accesos directos a tus webs |
| `/api1/misiones/estado` · `/api1/misiones-ciber/estado` · `/api1/misiones-websec/estado` | estado/avance de cada misión narrativa | **Misión en curso**: barra de avance |
| `/api1/chat/no-leidos?desde=<ms>` | `{ ok, nuevos, conversacion }` | **Mensajes sin leer**: contador |
| `/api1/chat/mensajes` (o `?con=<uid>`) | mensajes de las últimas 2 h | **Últimos mensajes**: mini-feed |

## Datos de la institución (iguales para todos)

| Ruta | Devuelve (claves principales) | Idea de gadget |
|---|---|---|
| `/api1/chat/online` | `{ ok, usuarios:[{uid,nombre}] }` | *(lo usa "Quién está online")* |
| `/api1/online-users` | conteo de conectados | **Pulso**: cuánta gente hay ahora |
| `/api1/estadisticas-publicas` | `{ ok, usuarios_online, usuarios_registrados, certificados, horas_totales, por_curso, ranking_grupos_horas, ranking_grupos_certificados }` | **Ranking de divisiones** / **Certificados de la institución** |
| `/api1/apuntes/materias` | `{ ok, materias:[...], grupos, grupos_editables, puede_gestionar }` | **Apuntes recientes** de tu división |
| `/api1/proyectos` | galería de proyectos de toda la institución | **Proyecto destacado** |
| `/api1/project/likes` | likes por proyecto (público) | **Lo más gustado** |
| `/api1/forum/posts` | posts del foro (público) | **Últimos del foro** |

## Reglas

- Para datos de **internet** (no de la plataforma) se usa `fetch` directo, y el dominio tiene que
  estar en la allowlist (ver [`CONTRATO.md`](CONTRATO.md)). `ctx.apiFetch` es solo para `/api1/...`.
- **No existe** (todavía) un endpoint para "horas/racha conectado" por usuario: ese gadget necesitaría
  una ruta nueva del lado de la plataforma. Proponelo en un issue si te interesa.
- Probá tu gadget en `preview.html`: trae datos de ejemplo para varios de estos endpoints.
