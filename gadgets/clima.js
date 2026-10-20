// Ejemplo CON DATOS DE INTERNET. Clima en Paysandú usando Open-Meteo
// (API pública, sin clave, con CORS → funciona 100% desde el navegador).
// Fijate cómo: 1) el dominio está en la lista permitida del validador,
//             2) se usa ctx.escapeHtml con los datos, 3) degrada si falla.
registrarGadget('clima', {
  name: 'Clima en Paysandú',
  icon: 'cloud-sun',
  every: 1800000,          // refresca cada 30 minutos
  async render(body, ctx) {
    // Código del tiempo (WMO) → texto + emoji
    const DESC = {
      0: ['Despejado', '☀️'], 1: ['Mayormente despejado', '🌤️'], 2: ['Parcialmente nublado', '⛅'],
      3: ['Nublado', '☁️'], 45: ['Niebla', '🌫️'], 48: ['Niebla', '🌫️'],
      51: ['Llovizna', '🌦️'], 61: ['Lluvia', '🌧️'], 63: ['Lluvia', '🌧️'], 65: ['Lluvia fuerte', '🌧️'],
      71: ['Nieve', '🌨️'], 80: ['Chaparrones', '🌦️'], 95: ['Tormenta', '⛈️']
    };
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-32.32&longitude=-58.08&current_weather=true';
      const d = await fetch(url).then(r => r.json());
      const w = d && d.current_weather;
      if (!w) { body.innerHTML = '<div class="gd-empty">No se pudo cargar el clima.</div>'; return; }
      const [txt, emoji] = DESC[w.weathercode] || ['—', '🌡️'];
      body.innerHTML =
        `<div class="gd-sum" style="font-size:20px">${emoji} <b>${ctx.escapeHtml(String(Math.round(w.temperature)))}°C</b></div>` +
        `<div class="gd-empty">${ctx.escapeHtml(txt)} · viento ${ctx.escapeHtml(String(Math.round(w.windspeed)))} km/h</div>`;
    } catch (e) {
      body.innerHTML = '<div class="gd-empty">Sin conexión para traer el clima ahora.</div>';
    }
  }
});
