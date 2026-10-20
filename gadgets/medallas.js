// Ejemplo que usa TUS datos de la plataforma: /api1/mis-certificados.
// Muestra qué certificados ya tenés y cuáles te faltan.
registrarGadget('medallas', {
  name: 'Mis medallas',
  icon: 'award',
  every: 300000,                 // refresca cada 5 min
  async render(body, ctx) {
    const { apiFetch, escapeHtml } = ctx;
    // Clave que devuelve la API → nombre lindo para mostrar
    const CURSOS = [
      ['linux', 'Linux'], ['linux2', 'Redes'], ['html', 'HTML'], ['mysql', 'MySQL'],
      ['java', 'Java'], ['java2', 'Java POO'], ['arq', 'Arquitectura'], ['docker', 'Docker'],
      ['api', 'APIs'], ['misiones', 'Misión ITSP'], ['misiones_ciber', 'Misión Ciber'], ['misiones_websec', 'Misión Websec'],
    ];
    const d = await apiFetch('/api1/mis-certificados');
    if (!d || !d.ok) { body.innerHTML = '<div class="gd-empty">No se pudieron cargar tus certificados.</div>'; return; }

    const tengo = CURSOS.filter(([k]) => d[k]).length;
    body.innerHTML =
      `<div class="gd-sum">🏅 <b>${tengo}</b> de ${CURSOS.length} certificados</div>` +
      `<div class="gd-scroll">` + CURSOS.map(([k, nombre]) => {
        const ok = !!d[k];
        return `<div class="gd-row" style="cursor:default">
            <div class="gd-row-top">
              <span>${ok ? '✅' : '⬜'} ${escapeHtml(nombre)}</span>
              <span>${ok ? 'Obtenido' : '—'}</span>
            </div></div>`;
      }).join('') + `</div>`;
  }
});
