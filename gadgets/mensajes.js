// Usa TUS datos: /api1/chat/no-leidos. Cuenta los mensajes nuevos desde la última vez que abriste el chat.
// Al hacer clic abre la conversación y reinicia el contador.
registrarGadget('mensajes', {
  name: 'Mensajes sin leer',
  icon: 'message-circle',
  every: 30000,                  // refresca cada 30 s
  async render(body, ctx) {
    const { apiFetch, escapeHtml, chatConUsuario } = ctx;
    const CLAVE = 'gadget-mensajes-desde';
    let desde = Date.now() - 24 * 3600 * 1000;    // por defecto: últimas 24 h
    try { desde = Number(localStorage.getItem(CLAVE)) || desde; } catch (e) {}

    const d = await apiFetch('/api1/chat/no-leidos?desde=' + desde);
    if (!d || !d.ok) { body.innerHTML = '<div class="gd-empty">No se pudieron cargar tus mensajes.</div>'; return; }

    const nuevos = d.nuevos || 0;
    if (!nuevos) { body.innerHTML = '<div class="gd-empty">📭 No tenés mensajes nuevos.</div>'; return; }

    body.innerHTML =
      `<div class="gd-sum">📬 <b>${escapeHtml(String(nuevos))}</b> ${nuevos === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}</div>` +
      (d.conversacion
        ? `<button class="gd-row" type="button"><div class="gd-row-top"><span>💬 Abrir chat con ${escapeHtml(d.conversacion)}</span><span>→</span></div></button>`
        : '');

    const btn = body.querySelector('button');
    if (btn) btn.addEventListener('click', () => {
      try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) {}
      chatConUsuario(d.conversacion);
      body.innerHTML = '<div class="gd-empty">📭 No tenés mensajes nuevos.</div>';
    });
  }
});
