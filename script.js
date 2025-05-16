// Parámetros de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const configJson = urlParams.get("configJson") || "";

const widgetUrl = urlParams.get("widgetUrl") || "";

fetch('./config/config.json')
  .then(response => response.json())
  .then(config => {
    applyDefaultSettings(config);
    loadFromURL(config);
    generarUrlWidget(config);

    document.getElementById('btnWidgetUrl').addEventListener('click', () => {
      generarUrlWidget(config);
    });
  })
  .catch(error => {
    console.error("Error cargando config.json:", error);
  });

function applyDefaultSettings(config) {
  config.config.forEach(item => {
    const input = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!input) return;

    if (item.type === "checkbox") {
      input.checked = item.value ?? item.defaultValue ?? false;
    } else if (item.type === "number" || item.type === "text" || item.type === "color") {
      input.value = item.value ?? item.defaultValue ?? "";
    }
  });
}

function loadFromURL(config) {
  const urlParams = new URLSearchParams(window.location.search);
  config.config.forEach(item => {
    const input = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!input || !urlParams.has(item.id)) return;

    if (item.type === "checkbox") {
      input.checked = urlParams.get(item.id) === 'true';
    } else {
      input.value = urlParams.get(item.id);
    }
  });
}

function generarUrlWidget(config) {
  const baseUrl = "https://cscheems.github.io/metricas-twitch/";
  const params = new URLSearchParams();

  config.config.forEach(item => {
    const el = document.getElementById(`toggle-${item.id}`) || document.getElementById(item.id);
    if (!el) return;
    const value = item.type === "checkbox" ? el.checked : el.value;
    params.set(item.id, value);
  });

  const finalUrl = `${baseUrl}?${params.toString()}`;
  document.getElementById("widgetUrlInput").value = finalUrl;
}

function copiarUrl() {
  const input = document.getElementById("widgetUrlInput");
  navigator.clipboard.writeText(input.value);

  const urlCopiado = document.createElement('span');
  urlCopiado.textContent = 'Copiado';
  urlCopiado.style.textAlign = 'center';
  urlCopiado.style.color = 'white';
  urlCopiado.style.fontWeight = 'bold';
  urlCopiado.style.position = 'absolute';
  urlCopiado.style.backgroundColor = '#45A049';
  urlCopiado.style.padding = '5px';
  urlCopiado.style.borderRadius = '10px';
  urlCopiado.style.zIndex = '2';
  urlCopiado.style.opacity = '0';
  urlCopiado.style.transform = 'translate(-50%, -112%)';
  urlCopiado.style.transition = 'opacity 0.2s easy-in-out';

  const widgetUrlInputContainer  = document.getElementById("widgetUrlInputContainer");
  widgetUrlInputContainer.appendChild(urlCopiado);

  void urlCopiado.offsetWidth;

  urlCopiado.style.opacity = '1';

  setTimeout(() => {
    urlCopiado.style.opacity = '0';
    setTimeout(() => {
      widgetUrlInputContainer.removeChild(urlCopiado);
    }, 500);
  }, 5000);
}

// PREVIEW

function actualizarPreview() {
  const baseURL = "https://cscheems.github.io/metricas-twitch/";

  // Obtener valores
  const usuarioTwitch = document.getElementById("usuarioTwitch").value;
  const mostrarVistas = document.getElementById("toggle-mostrarVistas").checked;
  const mostrarSubs = document.getElementById("toggle-mostrarSubs").checked;
  const mostrarSeguidores = document.getElementById("toggle-mostrarSeguidores").checked;
  const tamanoFuente = document.getElementById("tamañoFuente").value;
  const widgetColor = document.getElementById("widgetColor").value;

  // Construir parámetros
  const params = new URLSearchParams({
    usuarioTwitch,
    mostrarVistas,
    mostrarSubs,
    mostrarSeguidores,
    tamanoFuente,
    widgetColor, 
  });

  document.getElementById("widget-preview-frame").src = `${baseURL}?${params.toString()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarPreview();
});