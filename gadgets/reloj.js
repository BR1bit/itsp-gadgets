// Ejemplo SIMPLE (sin internet). Copiá este archivo como base para tu gadget.
// Muestra la hora y la fecha, y se actualiza solo cada segundo.
registrarGadget('reloj', {
  name: 'Reloj',
  icon: 'clock',
  every: 1000,            // re-dibuja cada 1000 ms (1 segundo)
  render(body, ctx) {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fecha = ahora.toLocaleDateString('es-UY', { weekday: 'long', day: '2-digit', month: 'long' });
    body.innerHTML =
      `<div class="gd-sum" style="font-size:22px"><b>${ctx.escapeHtml(hora)}</b></div>` +
      `<div class="gd-empty" style="text-transform:capitalize">${ctx.escapeHtml(fecha)}</div>`;
  }
});
