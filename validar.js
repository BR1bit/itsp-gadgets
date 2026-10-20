#!/usr/bin/env node
// Valida los gadgets de gadgets/*.js. No necesita instalar nada (Node puro).
// Uso:  node validar.js            (valida todos)
//       node validar.js clima      (valida solo gadgets/clima.js)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Dominios permitidos para fetch(). Para datos de la plataforma usá ctx.apiFetch (no cuenta acá).
// ¿Querés agregar uno? Proponelo en el PR y lo evaluamos.
const DOMINIOS_PERMITIDOS = [
  'api.open-meteo.com',
  'hacker-news.firebaseio.com',
];

// Patrones prohibidos (texto, mensaje).
const PROHIBIDOS = [
  [/\beval\s*\(/,            'usa eval()'],
  [/new\s+Function\s*\(/,    'usa new Function()'],
  [/\bimport\s*\(/,          'usa import() dinámico'],
  [/\brequire\s*\(/,         'usa require()'],
  [/document\s*\.\s*cookie/, 'toca document.cookie'],
  [/<script/i,               'incluye una etiqueta <script>'],
  [/\bXMLHttpRequest\b/,     'usa XMLHttpRequest (usá fetch o ctx.apiFetch)'],
];

const dir = path.join(__dirname, 'gadgets');
const filtro = process.argv[2];
let archivos = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
if (filtro) archivos = archivos.filter(f => f === filtro || f === filtro + '.js');

let errores = 0;
let okCount = 0;

for (const archivo of archivos) {
  const id = archivo.replace(/\.js$/, '');
  const ruta = path.join(dir, archivo);
  const src = fs.readFileSync(ruta, 'utf8');
  const fallas = [];

  // 1) Sintaxis + registro: corre el archivo en un sandbox que captura registrarGadget.
  const registrados = [];
  const sandbox = {
    registrarGadget: (gid, def) => registrados.push({ gid, def }),
    window: { lucide: null },
    document: { createElement: () => ({}), querySelectorAll: () => [] },
    fetch: () => Promise.resolve({ json: () => ({}) }),
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    Date, Math, JSON, console, URL, setTimeout, clearTimeout, setInterval, clearInterval,
  };
  try {
    vm.runInNewContext(src, sandbox, { filename: archivo, timeout: 2000 });
  } catch (e) {
    fallas.push('no se pudo ejecutar: ' + e.message);
  }

  // 2) Contrato
  if (!fallas.length) {
    if (registrados.length !== 1) {
      fallas.push(`debe llamar a registrarGadget() exactamente una vez (lo hace ${registrados.length})`);
    } else {
      const { gid, def } = registrados[0];
      if (gid !== id) fallas.push(`el id "${gid}" no coincide con el nombre del archivo "${id}"`);
      if (!def || typeof def !== 'object') fallas.push('el segundo argumento debe ser un objeto');
      else {
        if (!def.name || typeof def.name !== 'string') fallas.push('falta "name" (texto)');
        if (!def.icon || typeof def.icon !== 'string') fallas.push('falta "icon" (nombre de ícono Lucide)');
        if (typeof def.render !== 'function') fallas.push('falta "render(body, ctx)" (función)');
        if (def.every != null && (typeof def.every !== 'number' || def.every < 1000))
          fallas.push('"every" debe ser un número de milisegundos >= 1000 (o no ponerlo)');
      }
    }
  }

  // 3) Patrones prohibidos
  for (const [re, msg] of PROHIBIDOS) if (re.test(src)) fallas.push(msg);

  // 4) Dominios de fetch: toda URL http(s) literal debe estar en la allowlist
  const urls = src.match(/https?:\/\/[^\s"'`)]+/g) || [];
  for (const u of urls) {
    let host;
    try { host = new URL(u).hostname; } catch (e) { continue; }
    if (!DOMINIOS_PERMITIDOS.includes(host))
      fallas.push(`usa un dominio no permitido: ${host} (permitidos: ${DOMINIOS_PERMITIDOS.join(', ')})`);
  }

  if (fallas.length) {
    errores++;
    console.log(`\n❌ ${archivo}`);
    for (const f of fallas) console.log('   - ' + f);
  } else {
    okCount++;
    console.log(`✅ ${archivo}`);
  }
}

console.log(`\n${okCount} OK, ${errores} con problemas.`);
process.exit(errores ? 1 : 0);
