/* ==========================================================
   Escape Room 2 - Análisis Matemático
   Progreso, temporizador, respuestas persistentes, informe,
   impresión, descarga y preparación de correo.
   ========================================================== */

const ESCAPE = {
  storagePrefix: "escape-analisis-4b-v2-",
  codes: {
    estacion1: "0408",
    estacion2: "1534",
    estacion3: "9313",
    estacion4: "0209",
    estacion5: "4520",
    final: "9724"
  },
  words: {
    estacion1: "PENDIENTE",
    estacion2: "VÉRTICE",
    estacion3: "ASÍNTOTA",
    estacion4: "POTENCIA",
    estacion5: "DOMINIO"
  },
  next: {
    estacion1: "estacion2.html",
    estacion2: "estacion3.html",
    estacion3: "estacion4.html",
    estacion4: "estacion5.html",
    estacion5: "final.html",
    final: "index.html"
  }
};

const REPORT_SECTIONS = [
  {
    id: "estacion1",
    title: "Estación 1 · Función lineal",
    model: "f(x) = -2x + 8",
    fields: [
      ["e1_dominio", "Dominio"], ["e1_raiz", "Raíz"], ["e1_ordenada", "Ordenada al origen"],
      ["e1_pendiente", "Pendiente"], ["e1_monotonia", "Crecimiento o decrecimiento"],
      ["e1_signo", "Positividad y negatividad"], ["e1_justificacion", "Justificación"]
    ]
  },
  {
    id: "estacion2",
    title: "Estación 2 · Función cuadrática",
    model: "g(x) = x² - 6x + 5",
    fields: [
      ["e2_dominio", "Dominio"], ["e2_raices", "Raíces"], ["e2_ordenada", "Ordenada al origen"],
      ["e2_vertice", "Vértice y eje"], ["e2_extremo", "Máximo o mínimo"],
      ["e2_monotonia", "Crecimiento y decrecimiento"], ["e2_signo", "Positividad y negatividad"],
      ["e2_justificacion", "Justificación"]
    ]
  },
  {
    id: "estacion3",
    title: "Estación 3 · Función racional",
    model: "h(x) = -6/(x - 3) + 1",
    fields: [
      ["e3_dominio", "Dominio"], ["e3_raiz", "Raíz"], ["e3_ordenada", "Ordenada al origen"],
      ["e3_asintotas", "Asíntotas"], ["e3_signo", "Positividad y negatividad"],
      ["e3_monotonia", "Crecimiento o decrecimiento"], ["e3_justificacion", "Justificación"]
    ]
  },
  {
    id: "estacion4",
    title: "Estación 4 · Función exponencial",
    model: "p(x) = 3ˣ - 9",
    fields: [
      ["e4_dominio", "Dominio"], ["e4_imagen", "Imagen"], ["e4_raiz", "Raíz"],
      ["e4_ordenada", "Ordenada al origen"], ["e4_asintota", "Asíntota horizontal"],
      ["e4_monotonia", "Crecimiento o decrecimiento"], ["e4_signo", "Positividad y negatividad"],
      ["e4_justificacion", "Justificación"]
    ]
  },
  {
    id: "estacion5",
    title: "Estación 5 · Función logarítmica",
    model: "q(x) = log₂(x - 4)",
    fields: [
      ["e5_dominio", "Dominio"], ["e5_imagen", "Imagen"], ["e5_raiz", "Raíz"],
      ["e5_ordenada", "Ordenada al origen"], ["e5_asintota", "Asíntota vertical"],
      ["e5_monotonia", "Crecimiento o decrecimiento"], ["e5_signo", "Positividad y negatividad"],
      ["e5_justificacion", "Justificación"]
    ]
  },
  {
    id: "final",
    title: "Cierre y puesta en común",
    model: "Síntesis del recorrido",
    fields: [
      ["final_opcion", "Pregunta final"], ["final_facil", "Estación más sencilla"],
      ["final_dominio", "Atención al dominio"], ["final_diferencias", "Raíz, ordenada y asíntota"],
      ["final_analisis", "Significado de análisis completo"]
    ]
  }
];

function key(name){
  return ESCAPE.storagePrefix + name;
}

function readField(name){
  return localStorage.getItem(key(`field-${name}`)) || "";
}

function saveField(name, value){
  localStorage.setItem(key(`field-${name}`), String(value ?? ""));
  localStorage.setItem(key("lastSaved"), new Date().toISOString());
}

function getCompleted(){
  try{
    return JSON.parse(localStorage.getItem(key("completed")) || "[]");
  }catch(error){
    return [];
  }
}

function setCompleted(station){
  const completed = new Set(getCompleted());
  completed.add(station);
  localStorage.setItem(key("completed"), JSON.stringify([...completed]));
  localStorage.setItem(key(`completedAt-${station}`), new Date().toISOString());
}

function isCompleted(station){
  return getCompleted().includes(station);
}

function startTimer(){
  if(!localStorage.getItem(key("startTime"))){
    localStorage.setItem(key("startTime"), Date.now().toString());
  }
  updateTimer();
  window.setInterval(updateTimer, 1000);
}

function getElapsedSeconds(){
  const start = Number(localStorage.getItem(key("startTime")) || Date.now());
  const finish = Number(localStorage.getItem(key("finishTime")) || Date.now());
  return Math.max(0, Math.floor((finish - start) / 1000));
}

function formatDuration(totalSeconds){
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = hours ? `${hours} h ` : "";
  return `${hh}${String(minutes).padStart(2,"0")} min ${String(seconds).padStart(2,"0")} s`;
}

function updateTimer(){
  const timer = document.querySelector("[data-timer]");
  if(!timer) return;
  const elapsed = getElapsedSeconds();
  const min = String(Math.floor(elapsed / 60)).padStart(2,"0");
  const sec = String(elapsed % 60).padStart(2,"0");
  timer.textContent = `${min}:${sec}`;
}

function renderProgress(current){
  const progress = document.querySelector("[data-progress]");
  if(!progress) return;
  const stations = ["estacion1","estacion2","estacion3","estacion4","estacion5","final"];
  const labels = ["Lineal","Cuadrática","Racional","Exponencial","Logarítmica","Final"];
  progress.innerHTML = stations.map((station, index) => {
    const cssClass = isCompleted(station) ? "completo" : (station === current ? "actual" : "");
    return `<div class="paso ${cssClass}">${index + 1}. ${labels[index]}</div>`;
  }).join("");
}

function normalizeCode(value){
  return String(value || "").trim().replace(/\s+/g, "").toUpperCase();
}

function showMessage(id, type, text){
  const box = document.getElementById(id);
  if(!box) return;
  box.className = `mensaje ${type}`;
  box.innerHTML = text;
}

function registerAttempt(station, code){
  const attemptKey = key(`attempts-${station}`);
  const attempts = Number(localStorage.getItem(attemptKey) || 0) + 1;
  localStorage.setItem(attemptKey, String(attempts));
  localStorage.setItem(key(`lastCode-${station}`), code);
  return attempts;
}

function validateStation(station){
  const input = document.getElementById("codigo");
  const code = normalizeCode(input?.value);
  const expected = ESCAPE.codes[station];
  const word = ESCAPE.words[station];
  const next = ESCAPE.next[station];
  const attempts = registerAttempt(station, code);

  if(code === expected){
    setCompleted(station);
    localStorage.setItem(key(`correctCode-${station}`), code);
    renderProgress(station);
    showMessage("resultado", "ok", `
      <p>✅ Código correcto en el intento ${attempts}. Abran el candado físico con <span class="codigo">${expected}</span>.</p>
      <div class="palabra">${word}</div>
      <p>Las respuestas quedaron guardadas. Registren la palabra y continúen.</p>
      <p><a class="boton verde" href="${next}">Continuar</a></p>
    `);
  }else{
    showMessage("resultado", "error", `❌ El código no abre el sistema. Intento ${attempts}. Revisen el análisis y vuelvan a probar.`);
  }
}

function validateFinal(){
  const input = document.getElementById("codigo");
  const code = normalizeCode(input?.value);
  const attempts = registerAttempt("final", code);

  if(code === ESCAPE.codes.final){
    setCompleted("final");
    localStorage.setItem(key("finishTime"), Date.now().toString());
    localStorage.setItem(key("correctCode-final"), code);
    renderProgress("final");
    renderReport();
    showMessage("resultado", "ok", `
      <p>✅ Cofre final desbloqueado en el intento ${attempts}.</p>
      <h2>¡Sistema reactivado!</h2>
      <p>Completen la puesta en común y utilicen el informe final para imprimir o guardar la entrega.</p>
    `);
  }else{
    showMessage("resultado", "error", `❌ El cofre final sigue bloqueado. Intento ${attempts}. Revisen las palabras y los datos del recorrido.`);
  }
}

function toggleHint(id, station = "general"){
  const element = document.getElementById(id);
  if(!element) return;
  const isOpening = !element.classList.contains("visible");
  element.classList.toggle("visible");
  if(isOpening){
    const hintKey = key(`hints-${station}`);
    const hints = Number(localStorage.getItem(hintKey) || 0) + 1;
    localStorage.setItem(hintKey, String(hints));
  }
}

function setupPersistentFields(){
  const fields = document.querySelectorAll("[data-save]");
  fields.forEach((field) => {
    const name = field.dataset.save;
    const stored = readField(name);
    if(stored !== ""){
      field.value = stored;
    }else if(field.value){
      saveField(name, field.value);
    }

    field.addEventListener("input", () => {
      saveField(name, field.value);
      showSavedStatus();
      if(document.getElementById("contenidoInforme")) renderReport();
    });

    field.addEventListener("change", () => {
      saveField(name, field.value);
      showSavedStatus();
      if(document.getElementById("contenidoInforme")) renderReport();
    });
  });
}

let saveStatusTimer;
function showSavedStatus(){
  const status = document.getElementById("estadoGuardado");
  if(!status) return;
  status.textContent = "✓ Respuestas guardadas en este dispositivo";
  window.clearTimeout(saveStatusTimer);
  saveStatusTimer = window.setTimeout(() => { status.textContent = ""; }, 2200);
}

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value){
  if(!value) return "—";
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-AR", {dateStyle:"short", timeStyle:"short"});
}

function stationStatusHtml(section){
  const completed = isCompleted(section.id);
  const attempts = Number(localStorage.getItem(key(`attempts-${section.id}`)) || 0);
  const hints = Number(localStorage.getItem(key(`hints-${section.id}`)) || 0);
  const finishedAt = localStorage.getItem(key(`completedAt-${section.id}`));
  return `
    <div class="resumen-estacion">
      <span class="insignia ${completed ? "ok" : "pendiente"}">${completed ? "Desbloqueada" : "Pendiente"}</span>
      <span class="insignia">Intentos: ${attempts}</span>
      <span class="insignia">Pistas abiertas: ${hints}</span>
      <span class="insignia">Finalizada: ${escapeHtml(formatDate(finishedAt))}</span>
    </div>`;
}

function sectionReportHtml(section){
  const rows = section.fields.map(([name, label]) => {
    const value = readField(name).trim() || "Sin respuesta registrada";
    return `<tr><td>${escapeHtml(label)}</td><td class="respuesta-valor">${escapeHtml(value)}</td></tr>`;
  }).join("");

  return `
    <section class="informe-seccion">
      <h2>${escapeHtml(section.title)}</h2>
      <p class="informe-funcion">${escapeHtml(section.model)}</p>
      ${stationStatusHtml(section)}
      <table class="tabla-respuestas"><tbody>${rows}</tbody></table>
    </section>`;
}

function renderReport(){
  const container = document.getElementById("contenidoInforme");
  if(!container) return;

  const group = readField("nombreGrupo").trim() || "Sin nombre de grupo";
  const course = readField("curso").trim() || "Sin curso indicado";
  const members = readField("integrantes").trim() || "Sin integrantes registrados";
  const completedCount = getCompleted().filter((item) => REPORT_SECTIONS.some((section) => section.id === item)).length;
  const generatedAt = new Date().toLocaleString("es-AR", {dateStyle:"long", timeStyle:"short"});
  const elapsed = formatDuration(getElapsedSeconds());

  container.innerHTML = `
    <header class="informe-portada">
      <div>
        <p class="informe-funcion">ANÁLISIS MATEMÁTICO · ESCAPE ROOM 2</p>
        <h1>Informe del recorrido</h1>
        <p><strong>Grupo:</strong> ${escapeHtml(group)}</p>
        <p><strong>Curso:</strong> ${escapeHtml(course)}</p>
        <p><strong>Integrantes:</strong></p>
        <p class="respuesta-valor">${escapeHtml(members)}</p>
      </div>
      <div class="informe-meta">
        <strong>Resumen</strong><br />
        Estaciones completas: ${completedCount}/6<br />
        Tiempo registrado: ${escapeHtml(elapsed)}<br />
        Generado: ${escapeHtml(generatedAt)}
      </div>
    </header>
    <div class="aviso-entrega"><strong>Entrega:</strong> este informe contiene las respuestas guardadas en el navegador. Antes de reiniciar, guárdenlo como PDF y adjúntenlo al correo.</div>
    ${REPORT_SECTIONS.map(sectionReportHtml).join("")}
  `;
}

function buildPlainTextReport(){
  const group = readField("nombreGrupo").trim() || "Sin nombre de grupo";
  const course = readField("curso").trim() || "Sin curso indicado";
  const members = readField("integrantes").trim() || "Sin integrantes registrados";
  const lines = [
    "ESCAPE ROOM 2 - INFORME DEL RECORRIDO",
    `Grupo: ${group}`,
    `Curso: ${course}`,
    `Integrantes: ${members}`,
    `Tiempo registrado: ${formatDuration(getElapsedSeconds())}`,
    ""
  ];

  REPORT_SECTIONS.forEach((section) => {
    lines.push(section.title, section.model);
    lines.push(`Estado: ${isCompleted(section.id) ? "Desbloqueada" : "Pendiente"}`);
    lines.push(`Intentos: ${Number(localStorage.getItem(key(`attempts-${section.id}`)) || 0)}`);
    lines.push(`Pistas: ${Number(localStorage.getItem(key(`hints-${section.id}`)) || 0)}`);
    section.fields.forEach(([name, label]) => {
      lines.push(`${label}: ${readField(name).trim() || "Sin respuesta registrada"}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

function printReport(){
  renderReport();
  document.body.classList.add("imprimir-informe");
  window.print();
  window.setTimeout(() => document.body.classList.remove("imprimir-informe"), 500);
}

window.addEventListener("afterprint", () => document.body.classList.remove("imprimir-informe"));

function downloadReport(){
  const content = buildPlainTextReport();
  const group = readField("nombreGrupo").trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+/g, "-") || "grupo";
  const blob = new Blob([content], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `escape-room-2-${group}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMessage("mensajeInforme", "info", "✓ Se descargó una copia de las respuestas en formato de texto.");
}

function prepareEmail(){
  const email = readField("correoDocente").trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!validEmail){
    showMessage("mensajeInforme", "error", "Escriban un correo docente válido en la portada antes de preparar el mensaje.");
    return;
  }

  const group = readField("nombreGrupo").trim() || "Grupo sin nombre";
  const fullReport = buildPlainTextReport();
  const shortBody = [
    `Hola, enviamos la entrega del Escape Room 2 del ${group}.`,
    "",
    "Adjuntamos el informe guardado como PDF desde la página final.",
    "",
    `Curso: ${readField("curso").trim() || "Sin curso indicado"}`,
    `Integrantes: ${readField("integrantes").trim() || "Sin integrantes registrados"}`,
    `Tiempo registrado: ${formatDuration(getElapsedSeconds())}`,
    "",
    "Antes de enviar, recordá adjuntar manualmente el archivo PDF."
  ].join("\n");

  const body = fullReport.length <= 5500
    ? `${shortBody}\n\n--- RESPUESTAS ---\n${fullReport}`
    : shortBody;
  const subject = `Entrega Escape Room 2 - ${group}`;
  showMessage("mensajeInforme", "info", "Se abrirá el programa de correo. El PDF debe adjuntarse manualmente antes de enviar.");
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function resetEscape(){
  if(confirm("¿Querés borrar el progreso y todas las respuestas guardadas en este dispositivo?")){
    Object.keys(localStorage)
      .filter((storageKey) => storageKey.startsWith(ESCAPE.storagePrefix))
      .forEach((storageKey) => localStorage.removeItem(storageKey));
    location.href = "index.html";
  }
}

function teacherLogin(){
  const pass = normalizeCode(document.getElementById("claveDocente")?.value);
  const panel = document.getElementById("panelDocente");
  const message = document.getElementById("mensajeDocente");
  if(pass === "FUNCIONES"){
    panel?.classList.remove("oculto");
    if(message) message.textContent = "";
  }else if(message){
    message.textContent = "Clave incorrecta.";
  }
}

function unlockAll(){
  ["estacion1","estacion2","estacion3","estacion4","estacion5","final"].forEach(setCompleted);
  localStorage.setItem(key("finishTime"), Date.now().toString());
  renderProgress("final");
  renderReport();
  showMessage("docenteOk", "ok", "Todas las estaciones quedaron marcadas como completas en este dispositivo.");
}

function initEscape(current){
  startTimer();
  renderProgress(current);
  setupPersistentFields();
  if(current === "final") renderReport();
}

window.ESCAPE = ESCAPE;
window.initEscape = initEscape;
window.validateStation = validateStation;
window.validateFinal = validateFinal;
window.toggleHint = toggleHint;
window.resetEscape = resetEscape;
window.teacherLogin = teacherLogin;
window.unlockAll = unlockAll;
window.renderReport = renderReport;
window.printReport = printReport;
window.downloadReport = downloadReport;
window.prepareEmail = prepareEmail;
