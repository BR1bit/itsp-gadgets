// Ejemplo que usa datos de la INSTITUCIÓN: /api1/estadisticas-publicas.
// Muestra el ranking de divisiones por certificados, con barras.
registrarGadget('ranking', {
  name: 'Ranking de divisiones',
  icon: 'trophy',
  every: 600000,                 // refresca cada 10 min
  async render(body, ctx) {
    const { apiFetch, escapeHtml } = ctx;
    const d = await apiFetch('/api1/estadisticas-publicas');
    if (!d || !d.ok) { body.innerHTML = '<div class="gd-empty">No se pudo cargar el ranking.</div>'; return; }

    const filas = (d.ranking_grupos_certificados || []).slice(0, 6);
    if (!filas.length) { body.innerHTML = '<div class="gd-empty">Todavía no hay datos de ranking.</div>'; return; }
    const max = Math.max(...filas.map(f => f.certificados || 0), 1);

    body.innerHTML =
      `<div class="gd-sum">🎓 <b>${d.certificados || 0}</b> certificados en la institución</div>` +
      `<div class="gd-scroll">` + filas.map((f, i) => {
        const pct = Math.round(100 * (f.certificados || 0) / max);
        const medalla = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
        return `<div class="gd-row" style="cursor:default">
            <div class="gd-row-top">
              <span>${medalla} ${escapeHtml(f.grupo)}</span>
              <span>${escapeHtml(String(f.certificados || 0))}</span>
            </div>
            <div class="gd-bar"><div style="width:${pct}%"></div></div></div>`;
      }).join('') + `</div>`;
  }
});
