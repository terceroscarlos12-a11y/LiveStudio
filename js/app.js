function ocultarSplash() {
  const splash = document.getElementById("splash-screen");
  if (splash && !splash.classList.contains("oculto")) {
    splash.classList.add("oculto");
  }
}

window.addEventListener("DOMContentLoaded", () => setTimeout(ocultarSplash, 900));
setTimeout(ocultarSplash, 2200);

const dispositivos = {
  iphone16Pro: { nombre: "iPhone 16 / 15 Pro", ancho: 1179, alto: 2556, marco: "marco-celular" },
  iphone16Max: { nombre: "iPhone 16 / 15 Pro Max", ancho: 1290, alto: 2796, marco: "marco-celular" },
  iphone13: { nombre: "iPhone 13 / 14", ancho: 1170, alto: 2532, marco: "marco-celular" },
  iphoneSE: { nombre: "iPhone SE", ancho: 750, alto: 1334, marco: "marco-celular" },
  galaxyS24Ultra: { nombre: "Samsung Galaxy S24 Ultra", ancho: 1440, alto: 3120, marco: "marco-celular" },
  galaxyS24: { nombre: "Samsung Galaxy S24 / S23", ancho: 1080, alto: 2340, marco: "marco-celular" },
  galaxyA55: { nombre: "Samsung Galaxy A55 / A54", ancho: 1080, alto: 2340, marco: "marco-celular" },
  galaxyZFlip: { nombre: "Samsung Galaxy Z Flip 6", ancho: 1080, alto: 2640, marco: "marco-celular" },
  motoEdge50Ultra: { nombre: "Motorola Edge 50 Ultra", ancho: 1220, alto: 2712, marco: "marco-celular" },
  motoG84: { nombre: "Motorola Moto G84", ancho: 1080, alto: 2400, marco: "marco-celular" },
  motoRazr: { nombre: "Motorola Razr 50 Ultra", ancho: 1080, alto: 2640, marco: "marco-celular" },
  xiaomi14: { nombre: "Xiaomi 14", ancho: 1220, alto: 2712, marco: "marco-celular" },
  redmiNote13: { nombre: "Redmi Note 13 Pro", ancho: 1220, alto: 2712, marco: "marco-celular" },
  ipadPro: { nombre: "iPad Pro 12.9", ancho: 2048, alto: 2732, marco: "marco-celular" },
  ipadAir: { nombre: "iPad Air", ancho: 1640, alto: 2360, marco: "marco-celular" },
  galaxyTabS9: { nombre: "Samsung Galaxy Tab S9", ancho: 1600, alto: 2560, marco: "marco-celular" },
  monitorFHD: { nombre: "Monitor Full HD", ancho: 1920, alto: 1080, marco: "marco-monitor" },
  monitor2K: { nombre: "Monitor QHD 2K", ancho: 2560, alto: 1440, marco: "marco-monitor" },
  monitor4K: { nombre: "Monitor UHD 4K", ancho: 3840, alto: 2160, marco: "marco-monitor" },
  monitorUltrawide: { nombre: "Monitor Ultrawide", ancho: 3440, alto: 1440, marco: "marco-monitor" }
};
const botonesTab = document.querySelectorAll(".tab-btn");
const secciones = document.querySelectorAll(".seccion");
botonesTab.forEach((btn) => {
  btn.addEventListener("click", () => {
    botonesTab.forEach((b) => b.classList.remove("active"));
    secciones.forEach((sec) => sec.classList.remove("activa"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add("activa");
  });
});

function dibujarImagenCover(ctx, img, dx, dy, dWidth, dHeight, posX = 0.5, posY = 0.5, zoom = 1) {
  const imgRatio = img.width / img.height;
  const targetRatio = dWidth / dHeight;
  let baseW, baseH;
  if (imgRatio > targetRatio) { baseH = img.height; baseW = img.height * targetRatio; }
  else { baseW = img.width; baseH = img.width / targetRatio; }
  const sWidth = baseW / zoom, sHeight = baseH / zoom;
  const sx = (img.width - sWidth) * posX, sy = (img.height - sHeight) * posY;
  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function descargarPdfDirectoDesdeCanvas(listaCanvas, nombreArchivo, esHorizontal = false) {
  const enc = new TextEncoder();
  const partes = [];
  const offsets = [];
  let pos = 0;
  const addStr = (s) => { const b = enc.encode(s); partes.push(b); pos += b.length; };
  const addBin = (b) => { partes.push(b); pos += b.length; };

  const pageW = esHorizontal ? 841.89 : 595.28;
  const pageH = esHorizontal ? 595.28 : 841.89;
  const n = listaCanvas.length;
  const kids = [];

  addStr("%PDF-1.4\n");
  offsets[1] = pos; addStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  for (let i = 0; i < n; i++) {
    const c = listaCanvas[i];
    const dataUrl = c.toDataURL("image/jpeg", 0.92);
    const binStr = atob(dataUrl.split(",")[1]);
    const jpgBytes = new Uint8Array(binStr.length);
    for (let j = 0; j < binStr.length; j++) jpgBytes[j] = binStr.charCodeAt(j);

    const pObj = 3 + i * 3, cObj = pObj + 1, iObj = pObj + 2;
    kids.push(`${pObj} 0 R`);

    const scale = Math.min(pageW / c.width, pageH / c.height);
    const drawW = (c.width * scale).toFixed(2), drawH = (c.height * scale).toFixed(2);
    const drawX = ((pageW - drawW) / 2).toFixed(2), drawY = ((pageH - drawH) / 2).toFixed(2);
    const stream = `q\n${drawW} 0 0 ${drawH} ${drawX} ${drawY} cm\n/Im${i} Do\nQ\n`;

    offsets[pObj] = pos;
    addStr(`${pObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im${i} ${iObj} 0 R >> >> /Contents ${cObj} 0 R >>\nendobj\n`);
    offsets[cObj] = pos;
    addStr(`${cObj} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`);
    offsets[iObj] = pos;
    addStr(`${iObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpgBytes.length} >>\nstream\n`);
    addBin(jpgBytes);
    addStr("\nendstream\nendobj\n");
  }

  offsets[2] = pos;
  addStr(`2 0 obj\n<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${n} >>\nendobj\n`);

  const xrefPos = pos;
  const totalObjs = 3 + n * 3;
  addStr(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let k = 1; k < totalObjs; k++) addStr(`${String(offsets[k]).padStart(10, "0")} 00000 n \n`);
  addStr(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);

  const blob = new Blob(partes, { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${nombreArchivo}.pdf`;
  link.click();
}

function exportarCanvasAPdf(c, nombre, horiz = false) { descargarPdfDirectoDesdeCanvas([c], nombre, horiz); }
function exportarMultiplesCanvasAPdf(lista, nombre, horiz = false) { descargarPdfDirectoDesdeCanvas(lista, nombre, horiz); }
const inputImagen = document.getElementById("input-imagen");
const selectDispositivo = document.getElementById("select-dispositivo");
const rangeX = document.getElementById("range-x");
const rangeY = document.getElementById("range-y");
const rangeZoom = document.getElementById("range-zoom");
const marcoDispositivo = document.getElementById("marco-dispositivo");
const canvas = document.getElementById("canvas-preview");
const ctx = canvas ? canvas.getContext("2d") : null;
const btnDescargar = document.getElementById("btn-descargar");
let imagenCargada = null;

function dibujarAdaptador() {
  if (!canvas || !ctx) return;
  const disp = dispositivos[selectDispositivo.value] || dispositivos.iphone16Pro;
  if (marcoDispositivo) marcoDispositivo.className = disp.marco;
  canvas.width = disp.ancho; canvas.height = disp.alto;
  ctx.fillStyle = "#0F172A"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!imagenCargada) {
    ctx.fillStyle = "#94A3B8"; ctx.font = `bold ${Math.round(canvas.width * 0.045)}px system-ui, sans-serif`;
    ctx.textAlign = "center"; ctx.fillText("Subí una imagen para comenzar", canvas.width / 2, canvas.height / 2);
    return;
  }
  dibujarImagenCover(ctx, imagenCargada, 0, 0, canvas.width, canvas.height, rangeX.value / 100, rangeY.value / 100, rangeZoom.value / 100);
}

if (inputImagen) {
  inputImagen.addEventListener("change", (e) => {
    const archivo = e.target.files.item(0);
    if (!archivo) return; e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => { const img = new Image(); img.onload = () => { imagenCargada = img; dibujarAdaptador(); }; img.src = ev.target.result; };
    reader.readAsDataURL(archivo);
  });
}
[selectDispositivo, rangeX, rangeY, rangeZoom].forEach((el) => { if (el) el.addEventListener("input", dibujarAdaptador); });
if (btnDescargar) {
  btnDescargar.addEventListener("click", () => {
    if (!imagenCargada) return alert("Primero subí una imagen.");
    const link = document.createElement("a");
    link.download = `LiveStudio-Wallpaper-${selectDispositivo.value}.png`;
    link.href = canvas.toDataURL("image/png", 1.0); link.click();
  });
}
const inputFotoPoca = document.getElementById("input-foto-poca");
const contadorPoca = document.getElementById("contador-poca");
const btnLimpiarPoca = document.getElementById("btn-limpiar-poca");
const selectSlotPoca = document.getElementById("select-slot-poca");
const btnSwapPoca = document.getElementById("btn-swap-poca");
const btnQuitarSlotPoca = document.getElementById("btn-quitar-slot-poca");
const galeriaPoca = document.getElementById("galeria-poca");
const pocaRangeX = document.getElementById("poca-range-x");
const pocaRangeY = document.getElementById("poca-range-y");
const pocaRangeZoom = document.getElementById("poca-range-zoom");
const selectFormatoPoca = document.getElementById("select-formato-poca");
const checkGuias = document.getElementById("check-guias");
const canvasPoca = document.getElementById("canvas-poca");
const ctxPoca = canvasPoca ? canvasPoca.getContext("2d") : null;
const btnDescargarPoca = document.getElementById("btn-descargar-poca");
const btnDescargarPocaPdf = document.getElementById("btn-descargar-poca-pdf");

let slotsPoca = Array.from({ length: 9 }, () => ({ img: null, x: 50, y: 50, zoom: 100 }));
let slotPocaActivo = 0;
let swapPocaOrigen = null;

function sincronizarSlidersPoca() {
  const actual = slotsPoca[slotPocaActivo] || { x: 50, y: 50, zoom: 100 };
  if (pocaRangeX) pocaRangeX.value = actual.x;
  if (pocaRangeY) pocaRangeY.value = actual.y;
  if (pocaRangeZoom) pocaRangeZoom.value = actual.zoom;
}
function actualizarInterfazPoca() {
  const maxSlots = selectFormatoPoca.value === "banners" ? 2 : 9;
  if (slotPocaActivo >= maxSlots) slotPocaActivo = 0;
  if (selectSlotPoca) {
    selectSlotPoca.innerHTML = "";
    for (let i = 0; i < maxSlots; i++) {
      const opt = document.createElement("option");
      opt.value = i; opt.textContent = `${selectFormatoPoca.value === "banners" ? "Banner" : "Tarjeta"} #${i + 1} ${slotsPoca[i].img ? "✓" : "(Vacía)"}`;
      if (i === slotPocaActivo) opt.selected = true;
      selectSlotPoca.appendChild(opt);
    }
  }
  const cargadas = slotsPoca.slice(0, maxSlots).filter((s) => s.img !== null).length;
  if (contadorPoca) contadorPoca.textContent = `${cargadas} / ${maxSlots} fotos cargadas`;
  if (btnSwapPoca) {
    btnSwapPoca.classList.toggle("btn-activo-swap", swapPocaOrigen !== null);
    btnSwapPoca.textContent = swapPocaOrigen !== null ? `⇄ Tocá destino (#${swapPocaOrigen + 1})` : "⇄ Mover de lugar";
  }
  if (galeriaPoca) {
    galeriaPoca.innerHTML = "";
    for (let i = 0; i < maxSlots; i++) {
      const item = document.createElement("div");
      item.className = `mini-slot ${i === slotPocaActivo ? "activo" : ""} ${swapPocaOrigen === i ? "swap-origen" : ""}`;
      item.innerHTML = slotsPoca[i].img ? `<img src="${slotsPoca[i].img.src}"><span class="num-slot">${i + 1}</span>` : `<span class="num-slot">${i + 1}</span>`;
      item.addEventListener("click", () => {
        if (swapPocaOrigen !== null && swapPocaOrigen !== i) { const t = slotsPoca[swapPocaOrigen]; slotsPoca[swapPocaOrigen] = slotsPoca[i]; slotsPoca[i] = t; swapPocaOrigen = null; slotPocaActivo = i; }
        else { swapPocaOrigen = null; slotPocaActivo = i; }
        sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards();
      });
      galeriaPoca.appendChild(item);
    }
  }
}
function dibujarHojaPhotocards() {
  if (!canvasPoca || !ctxPoca) return;
  canvasPoca.width = 2480; canvasPoca.height = 3508;
  ctxPoca.fillStyle = "#FFFFFF"; ctxPoca.fillRect(0, 0, canvasPoca.width, canvasPoca.height);
  if (selectFormatoPoca.value === "photocards") {
    const cardW = 650, cardH = 1004, gap = 45;
    const startX = (canvasPoca.width - (cardW * 3 + gap * 2)) / 2, startY = (canvasPoca.height - (cardH * 3 + gap * 2)) / 2;
    for (let fila = 0; fila < 3; fila++) {
      for (let col = 0; col < 3; col++) {
        const idx = fila * 3 + col; const slot = slotsPoca[idx];
        const x = startX + col * (cardW + gap), y = startY + fila * (cardH + gap);
        if (slot && slot.img) dibujarImagenCover(ctxPoca, slot.img, x, y, cardW, cardH, slot.x / 100, slot.y / 100, slot.zoom / 100);
        else { ctxPoca.fillStyle = "#F1F5F9"; ctxPoca.fillRect(x, y, cardW, cardH); ctxPoca.fillStyle = "#94A3B8"; ctxPoca.font = "bold 40px system-ui, sans-serif"; ctxPoca.textAlign = "center"; ctxPoca.fillText(`Tarjeta ${idx + 1}`, x + cardW / 2, y + cardH / 2); }
        if (idx === slotPocaActivo) { ctxPoca.save(); ctxPoca.strokeStyle = "#E8364C"; ctxPoca.lineWidth = 10; ctxPoca.strokeRect(x, y, cardW, cardH); ctxPoca.restore(); }
        if (checkGuias.checked) { ctxPoca.save(); ctxPoca.strokeStyle = "#94A3B8"; ctxPoca.lineWidth = 3; ctxPoca.setLineDash([12, 10]); ctxPoca.strokeRect(x, y, cardW, cardH); ctxPoca.restore(); }
      }
    }
  } else {
    const bannerW = 2240, bannerH = 1180, gap = 140;
    const startX = (canvasPoca.width - bannerW) / 2, startY = (canvasPoca.height - (bannerH * 2 + gap)) / 2;
    for (let i = 0; i < 2; i++) {
      const slot = slotsPoca[i]; const y = startY + i * (bannerH + gap);
      if (slot && slot.img) dibujarImagenCover(ctxPoca, slot.img, startX, y, bannerW, bannerH, slot.x / 100, slot.y / 100, slot.zoom / 100);
      else { ctxPoca.fillStyle = "#F1F5F9"; ctxPoca.fillRect(startX, y, bannerW, bannerH); ctxPoca.fillStyle = "#94A3B8"; ctxPoca.font = "bold 54px system-ui, sans-serif"; ctxPoca.textAlign = "center"; ctxPoca.fillText(`Banner #${i + 1}`, startX + bannerW / 2, y + bannerH / 2); }
      if (i === slotPocaActivo) { ctxPoca.save(); ctxPoca.strokeStyle = "#E8364C"; ctxPoca.lineWidth = 10; ctxPoca.strokeRect(startX, y, bannerW, bannerH); ctxPoca.restore(); }
      if (checkGuias.checked) { ctxPoca.save(); ctxPoca.strokeStyle = "#94A3B8"; ctxPoca.lineWidth = 4; ctxPoca.setLineDash([14, 12]); ctxPoca.strokeRect(startX, y, bannerW, bannerH); ctxPoca.restore(); }
    }
  }
}
if (canvasPoca) {
  canvasPoca.addEventListener("click", (e) => {
    const rect = canvasPoca.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvasPoca.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvasPoca.height / rect.height);
    if (selectFormatoPoca.value === "photocards") {
      const cardW = 650, cardH = 1004, gap = 45;
      const startX = (canvasPoca.width - (cardW * 3 + gap * 2)) / 2, startY = (canvasPoca.height - (cardH * 3 + gap * 2)) / 2;
      for (let fila = 0; fila < 3; fila++) for (let col = 0; col < 3; col++) {
        const x = startX + col * (cardW + gap), y = startY + fila * (cardH + gap);
        if (clickX >= x && clickX <= x + cardW && clickY >= y && clickY <= y + cardH) {
          const idx = fila * 3 + col;
          if (swapPocaOrigen !== null && swapPocaOrigen !== idx) { const t = slotsPoca[swapPocaOrigen]; slotsPoca[swapPocaOrigen] = slotsPoca[idx]; slotsPoca[idx] = t; swapPocaOrigen = null; }
          slotPocaActivo = idx; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); return;
        }
      }
    } else {
      const bannerW = 2240, bannerH = 1180, gap = 140;
      const startX = (canvasPoca.width - bannerW) / 2, startY = (canvasPoca.height - (bannerH * 2 + gap)) / 2;
      for (let i = 0; i < 2; i++) {
        const y = startY + i * (bannerH + gap);
        if (clickX >= startX && clickX <= startX + bannerW && clickY >= y && clickY <= y + bannerH) {
          if (swapPocaOrigen !== null && swapPocaOrigen !== i) { const t = slotsPoca[swapPocaOrigen]; slotsPoca[swapPocaOrigen] = slotsPoca[i]; slotsPoca[i] = t; swapPocaOrigen = null; }
          slotPocaActivo = i; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); return;
        }
      }
    }
  });
}

if (inputFotoPoca) {
  inputFotoPoca.addEventListener("change", (e) => {
    const archivos = Array.from(e.target.files).slice(0, 9);
    e.target.value = ""; if (archivos.length === 0) return;
    let puntero = slotPocaActivo;
    archivos.forEach((archivo) => {
      const destino = puntero % 9; puntero++;
      const reader = new FileReader();
      reader.onload = (ev) => { const img = new Image(); img.onload = () => { slotsPoca[destino] = { img, x: 50, y: 50, zoom: 100 }; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); }; img.src = ev.target.result; };
      reader.readAsDataURL(archivo);
    });
  });
}
if (btnSwapPoca) btnSwapPoca.addEventListener("click", () => { swapPocaOrigen = swapPocaOrigen === null ? slotPocaActivo : null; actualizarInterfazPoca(); });
if (btnQuitarSlotPoca) btnQuitarSlotPoca.addEventListener("click", () => { slotsPoca[slotPocaActivo] = { img: null, x: 50, y: 50, zoom: 100 }; swapPocaOrigen = null; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); });
if (btnLimpiarPoca) btnLimpiarPoca.addEventListener("click", () => { slotsPoca = Array.from({ length: 9 }, () => ({ img: null, x: 50, y: 50, zoom: 100 })); slotPocaActivo = 0; swapPocaOrigen = null; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); });
if (selectSlotPoca) selectSlotPoca.addEventListener("change", () => { slotPocaActivo = parseInt(selectSlotPoca.value) || 0; swapPocaOrigen = null; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); });
[pocaRangeX, pocaRangeY, pocaRangeZoom].forEach((sl) => { if (!sl) return; sl.addEventListener("input", () => { if (!slotsPoca[slotPocaActivo]) return; slotsPoca[slotPocaActivo].x = parseInt(pocaRangeX.value); slotsPoca[slotPocaActivo].y = parseInt(pocaRangeY.value); slotsPoca[slotPocaActivo].zoom = parseInt(pocaRangeZoom.value); dibujarHojaPhotocards(); }); });
if (selectFormatoPoca) selectFormatoPoca.addEventListener("change", () => { swapPocaOrigen = null; sincronizarSlidersPoca(); actualizarInterfazPoca(); dibujarHojaPhotocards(); });
if (checkGuias) checkGuias.addEventListener("change", dibujarHojaPhotocards);

if (btnDescargarPoca) {
  btnDescargarPoca.addEventListener("click", () => {
    const b = slotPocaActivo; slotPocaActivo = -1; dibujarHojaPhotocards();
    const link = document.createElement("a"); link.download = `LiveStudio-${selectFormatoPoca.value}-A4.png`; link.href = canvasPoca.toDataURL("image/png", 1.0); link.click();
    slotPocaActivo = b; dibujarHojaPhotocards();
  });
}
if (btnDescargarPocaPdf) {
  btnDescargarPocaPdf.addEventListener("click", () => {
    const b = slotPocaActivo; slotPocaActivo = -1; dibujarHojaPhotocards();
    exportarCanvasAPdf(canvasPoca, `LiveStudio-${selectFormatoPoca.value}-A4`, false);
    slotPocaActivo = b; dibujarHojaPhotocards();
  });
}
const selectMes = document.getElementById("select-mes");
const inputAnio = document.getElementById("input-anio");
const inputFotoCal = document.getElementById("input-foto-cal");
const selectEstiloCal = document.getElementById("select-estilo-cal");
const calRangeX = document.getElementById("cal-range-x");
const calRangeY = document.getElementById("cal-range-y");
const calRangeZoom = document.getElementById("cal-range-zoom");
const selectColorCal = document.getElementById("select-color-cal");
const selectVistaEventosCal = document.getElementById("select-vista-eventos-cal");
const inputDiaEvento = document.getElementById("input-dia-evento");
const selectIconoEvento = document.getElementById("select-icono-evento");
const inputColorEvento = document.getElementById("input-color-evento");
const inputTextoEvento = document.getElementById("input-texto-evento");
const btnAgregarEvento = document.getElementById("btn-agregar-evento");
const listaEventosChips = document.getElementById("lista-eventos-chips");
const textareaNotasMes = document.getElementById("textarea-notas-mes");
const btnDescargarCalAnual = document.getElementById("btn-descargar-cal-anual");
const btnDescargarCalPdf = document.getElementById("btn-descargar-cal-pdf");
const btnDescargarCal = document.getElementById("btn-descargar-cal");
const canvasCal = document.getElementById("canvas-cal");
const ctxCal = canvasCal ? canvasCal.getContext("2d") : null;

const NOMBRES_MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const DIAS_SEMANA = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

let mesesData = Array.from({ length: 12 }, () => ({ img: null, x: 50, y: 50, zoom: 100, color: "#FF5FA2", eventos: [], notas: "" }));
let eventoEditandoIndex = null;
function guardarCalendarioPersistente() {
  if (typeof guardarDatosLocales !== "function") return;
  const serializado = mesesData.map((m) => ({ imgSrc: m.img ? m.img.src : null, x: m.x, y: m.y, zoom: m.zoom, color: m.color, eventos: m.eventos, notas: m.notas || "" }));
  guardarDatosLocales("calendario_livestudio", { anio: inputAnio ? inputAnio.value : 2026, estilo: selectEstiloCal ? selectEstiloCal.value : "vertical", meses: serializado });
}

async function restaurarCalendarioPersistente() {
  if (typeof leerDatosLocales !== "function") return;
  const guardado = await leerDatosLocales("calendario_livestudio");
  if (!guardado || !Array.isArray(guardado.meses)) return;
  if (guardado.anio && inputAnio) inputAnio.value = guardado.anio;
  if (guardado.estilo && selectEstiloCal) selectEstiloCal.value = guardado.estilo;
  const promesas = guardado.meses.map((item, idx) => new Promise((resolve) => {
    mesesData[idx].x = item.x ?? 50; mesesData[idx].y = item.y ?? 50; mesesData[idx].zoom = item.zoom ?? 100;
    mesesData[idx].color = item.color || "#FF5FA2"; mesesData[idx].eventos = Array.isArray(item.eventos) ? item.eventos : [];
    mesesData[idx].notas = item.notas || "";
    if (item.imgSrc) { const img = new Image(); img.onload = () => { mesesData[idx].img = img; resolve(); }; img.onerror = () => resolve(); img.src = item.imgSrc; }
    else resolve();
  }));
  await Promise.all(promesas);
  sincronizarControlesMes(); dibujarCalendario();
}

function sincronizarControlesMes() {
  const m = mesesData[parseInt(selectMes.value) || 0];
  if (!m) return;
  if (calRangeX) calRangeX.value = m.x; if (calRangeY) calRangeY.value = m.y; if (calRangeZoom) calRangeZoom.value = m.zoom;
  if (selectColorCal) selectColorCal.value = m.color; if (inputColorEvento) inputColorEvento.value = m.color;
  if (textareaNotasMes) textareaNotasMes.value = m.notas || "";
  eventoEditandoIndex = null; if (btnAgregarEvento) btnAgregarEvento.textContent = "+";
  renderizarChipsEventos();
}

function renderizarChipsEventos() {
  if (!listaEventosChips) return;
  const mesIdx = parseInt(selectMes.value) || 0;
  const m = mesesData[mesIdx];
  const tituloChips = document.getElementById("titulo-chips-cal");
  if (tituloChips) tituloChips.textContent = `🎂 Ver / Editar Fechas del Mes (${m.eventos.length}) ▾`;

  listaEventosChips.innerHTML = "";
  m.eventos.sort((a, b) => a.dia - b.dia).forEach((ev, idx) => {
    const chip = document.createElement("span");
    chip.className = "evento-chip";
    chip.style.borderLeft = `5px solid ${ev.color || m.color}`;
    chip.innerHTML = `<span class="chip-editar">${ev.icono} Día ${ev.dia}: ${ev.texto}</span> <button type="button" class="chip-borrar">✕</button>`;
    chip.querySelector(".chip-editar").addEventListener("click", () => {
      inputDiaEvento.value = ev.dia; selectIconoEvento.value = ev.icono; inputTextoEvento.value = ev.texto;
      if (inputColorEvento) inputColorEvento.value = ev.color || m.color;
      eventoEditandoIndex = idx; btnAgregarEvento.textContent = "✓";
    });
    chip.querySelector(".chip-borrar").addEventListener("click", (e) => {
      e.stopPropagation(); m.eventos.splice(idx, 1); eventoEditandoIndex = null; btnAgregarEvento.textContent = "+";
      guardarCalendarioPersistente(); renderizarChipsEventos(); dibujarCalendario();
    });
    listaEventosChips.appendChild(chip);
  });
}

const btnGuardarNotasMes = document.getElementById("btn-guardar-notas-mes");
const btnLimpiarNotasMes = document.getElementById("btn-limpiar-notas-mes");
const acordeonNotasMes = document.getElementById("acordeon-notas-mes");

if (textareaNotasMes) {
  textareaNotasMes.addEventListener("input", () => {
    const m = mesesData[parseInt(selectMes.value) || 0];
    if (m) m.notas = textareaNotasMes.value;
    dibujarCalendario();
  });
}
if (btnGuardarNotasMes) {
  btnGuardarNotasMes.addEventListener("click", () => {
    const m = mesesData[parseInt(selectMes.value) || 0];
    if (m && textareaNotasMes) m.notas = textareaNotasMes.value.trim();
    guardarCalendarioPersistente(); dibujarCalendario();
    if (acordeonNotasMes) acordeonNotasMes.open = false;
  });
}
if (btnLimpiarNotasMes) {
  btnLimpiarNotasMes.addEventListener("click", () => {
    const m = mesesData[parseInt(selectMes.value) || 0];
    if (m) m.notas = "";
    if (textareaNotasMes) textareaNotasMes.value = "";
    guardarCalendarioPersistente(); dibujarCalendario();
  });
}
const btnImportarMasivoCal = document.getElementById("btn-importar-masivo-cal");
const btnExportarMasivoCal = document.getElementById("btn-exportar-masivo-cal");
const textareaMasivoCal = document.getElementById("textarea-masivo-cal");

if (selectVistaEventosCal) selectVistaEventosCal.addEventListener("change", dibujarCalendario);

if (btnImportarMasivoCal && textareaMasivoCal) {
  btnImportarMasivoCal.addEventListener("click", () => {
    const texto = textareaMasivoCal.value.trim();
    if (!texto) return alert("Pegá primero tu lista de cumpleaños.");

    const lineas = texto.split(/\r?\n/);
    const colorDefault = inputColorEvento ? inputColorEvento.value : "#FF5FA2";
    const iconoDefault = selectIconoEvento ? selectIconoEvento.value : "🎂";
    let agregados = 0;

    lineas.forEach((linea) => {
      const limpia = linea.trim();
      if (!limpia) return;
      const match = limpia.match(/^(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.]\d{2,4})?\s*[:\-–—]?\s*(.+)$/);
      if (!match) return;

      const dia = parseInt(match[1], 10);
      const mesIndex = parseInt(match[2], 10) - 1;
      let resto = match[3].trim();

      let colorLinea = colorDefault;
      const hexMatch = resto.match(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\b/);
      if (hexMatch) {
        colorLinea = hexMatch[1].toUpperCase();
        resto = resto.replace(hexMatch[0], "").replace(/[\-\–—:]\s*$/, "").trim();
      }

      if (mesIndex >= 0 && mesIndex <= 11 && dia >= 1 && dia <= 31 && resto && mesesData[mesIndex]) {
        mesesData[mesIndex].eventos.push({ dia, icono: iconoDefault, texto: resto, color: colorLinea });
        agregados++;
      }
    });

    if (agregados === 0) return alert("No se reconoció ninguna fecha. Usá el formato DD/MM Nombre #HEX.");
    guardarCalendarioPersistente(); renderizarChipsEventos(); dibujarCalendario();
    textareaMasivoCal.value = "";
    alert(`🎉 ¡Listo! Se importaron ${agregados} cumpleaños con sus colores.`);
  });
}

if (btnExportarMasivoCal && textareaMasivoCal) {
  btnExportarMasivoCal.addEventListener("click", () => {
    const salida = [];
    for (let m = 0; m < 12; m++) {
      const ordenados = [...(mesesData[m].eventos || [])].sort((a, b) => a.dia - b.dia);
      ordenados.forEach((ev) => {
        const dd = String(ev.dia).padStart(2, "0");
        const mm = String(m + 1).padStart(2, "0");
        salida.push(`${dd}/${mm} ${ev.texto} ${ev.color || ""}`.trim());
      });
    }
    if (salida.length === 0) return alert("Todavía no hay cumpleaños cargados para exportar.");
    textareaMasivoCal.value = salida.join("\n");
    textareaMasivoCal.select();
    navigator.clipboard?.writeText(textareaMasivoCal.value);
    alert(`📋 Se copiaron ${salida.length} fechas ordenadas al portapapeles.`);
  });
}
const selectIcsAlcance = document.getElementById("select-ics-alcance");
const selectIcsHorario = document.getElementById("select-ics-horario");
const btnDescargarIcs = document.getElementById("btn-descargar-ics");

function formatearFechaIcs(fechaObj, enUtc = false) {
  const pad = (n) => String(n).padStart(2, "0");
  if (enUtc) return `${fechaObj.getUTCFullYear()}${pad(fechaObj.getUTCMonth() + 1)}${pad(fechaObj.getUTCDate())}T${pad(fechaObj.getUTCHours())}${pad(fechaObj.getUTCMinutes())}00Z`;
  return `${fechaObj.getFullYear()}${pad(fechaObj.getMonth() + 1)}${pad(fechaObj.getDate())}`;
}

if (btnDescargarIcs) {
  btnDescargarIcs.addEventListener("click", () => {
    const anio = parseInt(inputAnio?.value) || 2026;
    const alcance = selectIcsAlcance ? selectIcsAlcance.value : "todos";
    const horario = selectIcsHorario ? selectIcsHorario.value : "ambos";
    const mesActual = parseInt(selectMes?.value) || 0;

    const mesesAExportar = alcance === "mes" ? [mesActual] : Array.from({ length: 12 }, (_, i) => i);
    const lineasIcs = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LiveStudio//K-pop Birthdays//ES", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Cumpleaños K-pop (LiveStudio)"];

    let totalEventos = 0;
    const ahoraStamp = formatearFechaIcs(new Date(), true);

    mesesAExportar.forEach((mIdx) => {
      const lista = [...(mesesData[mIdx]?.eventos || [])].sort((a, b) => a.dia - b.dia);
      lista.forEach((ev, idx) => {
        totalEventos++;
        const colorHex = (ev.color || mesesData[mIdx].color || "#FF5FA2").toUpperCase();
        const tituloLimpio = ev.texto.replace(/[,;\\]/g, " ");

        if (horario === "kst" || horario === "ambos") {
          const inicioKstEnUtc = new Date(Date.UTC(anio, mIdx, ev.dia, 0, 0, 0) - 9 * 3600 * 1000);
          const finKstEnUtc = new Date(inicioKstEnUtc.getTime() + 3600 * 1000);
          lineasIcs.push("BEGIN:VEVENT", `UID:livestudio-kst-${anio}-${mIdx + 1}-${ev.dia}-${idx}@livestudio.app`, `DTSTAMP:${ahoraStamp}`, `DTSTART:${formatearFechaIcs(inicioKstEnUtc, true)}`, `DTEND:${formatearFechaIcs(finKstEnUtc, true)}`, `SUMMARY:🇰🇷 ${ev.icono} ${tituloLimpio} (00:00 KST)`, "DESCRIPTION:Celebración en Corea del Sur (00:00 KST) - LiveStudio", `COLOR:${colorHex}`, "RRULE:FREQ=YEARLY", "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", `DESCRIPTION:¡Ya es el cumpleaños de ${tituloLimpio} en Corea!`, "END:VALARM", "END:VEVENT");
        }

        if (horario === "local" || horario === "ambos") {
          const inicioLocal = new Date(anio, mIdx, ev.dia);
          const finLocal = new Date(anio, mIdx, ev.dia + 1);
          lineasIcs.push("BEGIN:VEVENT", `UID:livestudio-loc-${anio}-${mIdx + 1}-${ev.dia}-${idx}@livestudio.app`, `DTSTAMP:${ahoraStamp}`, `DTSTART;VALUE=DATE:${formatearFechaIcs(inicioLocal, false)}`, `DTEND;VALUE=DATE:${formatearFechaIcs(finLocal, false)}`, `SUMMARY:🌎 ${ev.icono} ${tituloLimpio}`, "DESCRIPTION:Cumpleaños local - LiveStudio", `COLOR:${colorHex}`, "RRULE:FREQ=YEARLY", "BEGIN:VALARM", "TRIGGER:PT9H", "ACTION:DISPLAY", `DESCRIPTION:Hoy es el cumpleaños de ${tituloLimpio}`, "END:VALARM", "END:VEVENT");
        }
      });
    });

    if (totalEventos === 0) return alert("No hay cumpleaños cargados en el rango elegido.");
    lineasIcs.push("END:VCALENDAR");
    const blob = new Blob([lineasIcs.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = alcance === "mes" ? `LiveStudio-Cumpleanos-${NOMBRES_MESES[mesActual]}.ics` : `LiveStudio-Cumpleanos-${anio}.ics`;
    link.click();
  });
}
function dibujarCirculoDiaEquilibrado(targetCtx, cx, cy, radio, evsDia, colorTema) {
  if (evsDia.length === 1) {
    const c = evsDia[0].color || colorTema;
    targetCtx.fillStyle = `${c}20`;
    targetCtx.beginPath(); targetCtx.arc(cx, cy, radio, 0, Math.PI * 2); targetCtx.fill();
    targetCtx.strokeStyle = c; targetCtx.lineWidth = 3.5; targetCtx.stroke();
    return;
  }
  const pasoAng = (Math.PI * 2) / evsDia.length;
  evsDia.forEach((ev, idx) => {
    const c = ev.color || colorTema;
    targetCtx.beginPath();
    targetCtx.arc(cx, cy, radio, idx * pasoAng - Math.PI / 2, (idx + 1) * pasoAng - Math.PI / 2);
    targetCtx.strokeStyle = c; targetCtx.lineWidth = 5; targetCtx.stroke();
  });
}

function dibujarListaInferiorEventos(targetCtx, x, y, ancho, eventosOrdenados, colorTema, maxFilas = 7) {
  if (!eventosOrdenados || eventosOrdenados.length === 0) return;
  targetCtx.save();
  targetCtx.fillStyle = colorTema;
  targetCtx.font = "900 26px system-ui, sans-serif";
  targetCtx.textAlign = "left";
  targetCtx.fillText("🎂 CUMPLEAÑOS Y FECHAS DEL MES:", x, y);

  const cols = 3;
  const colW = ancho / cols;
  const maxItems = Math.min(eventosOrdenados.length, cols * maxFilas);
  for (let i = 0; i < maxItems; i++) {
    const ev = eventosOrdenados[i];
    const col = Math.floor(i / maxFilas);
    const fila = i % maxFilas;
    const ix = x + col * colW;
    const iy = y + 36 + fila * 30;

    targetCtx.fillStyle = ev.color || colorTema;
    targetCtx.beginPath(); targetCtx.arc(ix + 8, iy - 7, 7, 0, Math.PI * 2); targetCtx.fill();

    targetCtx.fillStyle = "#1E293B";
    targetCtx.font = "bold 22px system-ui, sans-serif";
    const dd = String(ev.dia).padStart(2, "0");
    targetCtx.fillText(`Día ${dd}: ${ev.texto.slice(0, 21)}`, ix + 22, iy);
  }
  targetCtx.restore();
}

function dibujarBloqueNotasUsuario(targetCtx, x, y, textoNotas, colorTema) {
  targetCtx.save();
  targetCtx.fillStyle = colorTema;
  targetCtx.font = "900 28px system-ui, sans-serif";
  targetCtx.textAlign = "left";
  targetCtx.fillText("📝 NOTAS DEL MES:", x, y);

  targetCtx.fillStyle = "#334155";
  targetCtx.font = "600 25px system-ui, sans-serif";
  const lineas = (textoNotas || "Sin notas agregadas para este mes.").split(/\r?\n/).slice(0, 6);
  lineas.forEach((linea, idx) => {
    targetCtx.fillText(linea.slice(0, 68), x, y + 42 + idx * 34);
  });
  targetCtx.restore();
}
function dibujarCalendarioEnContexto(targetCtx, targetCanvas, mesIdx) {
  const m = mesesData[mesIdx];
  const anio = parseInt(inputAnio.value) || 2026;
  const colorTema = m.color || "#FF5FA2";
  const estilo = selectEstiloCal.value;
  const modoVistaEv = selectVistaEventosCal ? selectVistaEventosCal.value : "ambos";
  const mostrarEnGrilla = modoVistaEv === "ambos" || modoVistaEv === "grilla";
  const mostrarInferior = modoVistaEv === "ambos" || modoVistaEv === "inferior";

  if (estilo === "escritorio") { targetCanvas.width = 3508; targetCanvas.height = 2480; }
  else { targetCanvas.width = 2480; targetCanvas.height = 3508; }

  targetCtx.fillStyle = "#FFFFFF"; targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  const primerDia = new Date(anio, mesIdx, 1).getDay();
  const diasEnMes = new Date(anio, mesIdx + 1, 0).getDate();
  const eventosMes = [...m.eventos].sort((a, b) => a.dia - b.dia);

  if (estilo === "escritorio") {
    const fotoW = 1520, fotoH = 2240;
    if (m.img) dibujarImagenCover(targetCtx, m.img, 120, 120, fotoW, fotoH, m.x / 100, m.y / 100, m.zoom / 100);
    else { targetCtx.fillStyle = "#F1F5F9"; targetCtx.fillRect(120, 120, fotoW, fotoH); targetCtx.fillStyle = "#94A3B8"; targetCtx.font = "bold 48px system-ui, sans-serif"; targetCtx.textAlign = "center"; targetCtx.fillText(`Subí foto de ${NOMBRES_MESES[mesIdx]}`, 120 + fotoW / 2, 120 + fotoH / 2); }

    const gridX = 1740, gridW = 1640;
    targetCtx.fillStyle = colorTema; targetCtx.font = "900 100px system-ui, sans-serif"; targetCtx.textAlign = "left";
    targetCtx.fillText(`${NOMBRES_MESES[mesIdx]} ${anio}`, gridX, 230);
    const colW = gridW / 7;
    targetCtx.font = "bold 35px system-ui, sans-serif"; targetCtx.textAlign = "center";
    DIAS_SEMANA.forEach((d, i) => { targetCtx.fillStyle = i === 0 ? colorTema : "#64748B"; targetCtx.fillText(d, gridX + i * colW + colW / 2, 330); });

    let diaActual = 1;
    for (let fila = 0; fila < 6; fila++) {
      for (let col = 0; col < 7; col++) {
        if ((fila === 0 && col < primerDia) || diaActual > diasEnMes) continue;
        const cx = gridX + col * colW + colW / 2;
        const cy = 440 + fila * 235;
        const evsDia = eventosMes.filter((e) => e.dia === diaActual);
        if (evsDia.length > 0) dibujarCirculoDiaEquilibrado(targetCtx, cx, cy - 13, 33, evsDia, colorTema);

        targetCtx.fillStyle = evsDia.length === 1 ? (evsDia[0].color || colorTema) : (col === 0 ? colorTema : "#1E293B");
        targetCtx.font = evsDia.length > 0 ? "900 40px system-ui, sans-serif" : "bold 40px system-ui, sans-serif";
        targetCtx.fillText(diaActual, cx, cy);

        if (mostrarEnGrilla) {
          evsDia.slice(0, 3).forEach((itemEv, idxEv) => {
            targetCtx.fillStyle = itemEv.color || colorTema;
            targetCtx.font = "bold 18px system-ui, sans-serif";
            const nombreCorto = itemEv.texto.split("(")[0].trim().slice(0, 12);
            targetCtx.fillText(`${itemEv.icono}${nombreCorto}`, cx, cy + 42 + idxEv * 21);
          });
        }
        diaActual++;
      }
    }
    targetCtx.strokeStyle = "#CBD5E1"; targetCtx.lineWidth = 3;
    targetCtx.strokeRect(gridX, 1885, gridW, 475);
    if (mostrarInferior && eventosMes.length > 0) {
      dibujarListaInferiorEventos(targetCtx, gridX + 28, 1935, gridW - 56, eventosMes, colorTema, 5);
      if (m.notas && m.notas.trim()) {
        targetCtx.fillStyle = colorTema; targetCtx.font = "bold 22px system-ui, sans-serif"; targetCtx.textAlign = "left";
        targetCtx.fillText(`📝 Nota: ${m.notas.trim().slice(0, 85)}`, gridX + 28, 2330);
      }
    } else {
      dibujarBloqueNotasUsuario(targetCtx, gridX + 32, 1940, m.notas, colorTema);
    }
  } else {
    const marginX = 140, fotoW = targetCanvas.width - marginX * 2;
    const tieneNotasV = m.notas && m.notas.trim().length > 0;
    const fotoH = (mostrarInferior && eventosMes.length > 0) || tieneNotasV ? (estilo === "editorial" ? 1260 : 1420) : (estilo === "editorial" ? 1480 : 1680);
    if (m.img) dibujarImagenCover(targetCtx, m.img, marginX, 130, fotoW, fotoH, m.x / 100, m.y / 100, m.zoom / 100);
    else { targetCtx.fillStyle = "#F1F5F9"; targetCtx.fillRect(marginX, 130, fotoW, fotoH); targetCtx.fillStyle = "#94A3B8"; targetCtx.font = "bold 50px system-ui, sans-serif"; targetCtx.textAlign = "center"; targetCtx.fillText(`Subí la foto de ${NOMBRES_MESES[mesIdx]}`, targetCanvas.width / 2, 130 + fotoH / 2); }

    const headerY = 130 + fotoH + 115;
    targetCtx.fillStyle = colorTema; targetCtx.font = "900 105px system-ui, sans-serif"; targetCtx.textAlign = "left";
    targetCtx.fillText(`${NOMBRES_MESES[mesIdx]} ${anio}`, marginX, headerY);

    const colW = fotoW / 7, diasY = headerY + 90;
    targetCtx.font = "bold 36px system-ui, sans-serif"; targetCtx.textAlign = "center";
    DIAS_SEMANA.forEach((d, i) => { targetCtx.fillStyle = i === 0 ? colorTema : "#64748B"; targetCtx.fillText(d, marginX + i * colW + colW / 2, diasY); });

    let diaActual = 1;
    const rowH = (mostrarInferior && eventosMes.length > 0) || tieneNotasV ? 198 : (estilo === "editorial" ? 235 : 210);
    for (let fila = 0; fila < 6; fila++) {
      for (let col = 0; col < 7; col++) {
        if ((fila === 0 && col < primerDia) || diaActual > diasEnMes) continue;
        const cellX = marginX + col * colW, cellY = diasY + 40 + fila * rowH;
        const cx = cellX + colW / 2;
        const cy = cellY + 54;
        const evsDia = eventosMes.filter((e) => e.dia === diaActual);

        if (estilo === "editorial") { targetCtx.strokeStyle = "#E2E8F0"; targetCtx.lineWidth = 3; targetCtx.strokeRect(cellX + 8, cellY, colW - 16, rowH - 16); }
        if (evsDia.length > 0) dibujarCirculoDiaEquilibrado(targetCtx, cx, cy - 13, 34, evsDia, colorTema);

        targetCtx.fillStyle = evsDia.length === 1 ? (evsDia[0].color || colorTema) : (col === 0 ? colorTema : "#1E293B");
        targetCtx.font = evsDia.length > 0 ? "900 42px system-ui, sans-serif" : "bold 42px system-ui, sans-serif";
        targetCtx.fillText(diaActual, cx, cy);

        if (mostrarEnGrilla) {
          evsDia.slice(0, 3).forEach((itemEv, idxEv) => {
            targetCtx.fillStyle = itemEv.color || colorTema;
            targetCtx.font = "bold 19px system-ui, sans-serif";
            const nombreCorto = itemEv.texto.split("(")[0].trim().slice(0, 14);
            targetCtx.fillText(`${itemEv.icono}${nombreCorto}`, cx, cy + 44 + idxEv * 22);
          });
        }
        diaActual++;
      }
    }

    if (mostrarInferior && eventosMes.length > 0) {
      dibujarListaInferiorEventos(targetCtx, marginX, 3110, fotoW, eventosMes, colorTema, 7);
      if (tieneNotasV) {
        targetCtx.fillStyle = colorTema; targetCtx.font = "bold 24px system-ui, sans-serif"; targetCtx.textAlign = "left";
        targetCtx.fillText(`📝 Nota: ${m.notas.trim().slice(0, 95)}`, marginX, 3385);
      }
    } else if (tieneNotasV) {
      dibujarBloqueNotasUsuario(targetCtx, marginX, 3140, m.notas, colorTema);
    }
  }
}

function dibujarCalendario() {
  if (!canvasCal || !ctxCal) return;
  dibujarCalendarioEnContexto(ctxCal, canvasCal, parseInt(selectMes.value) || 0);
}
if (selectMes) selectMes.addEventListener("change", () => { sincronizarControlesMes(); dibujarCalendario(); });
[inputAnio, selectEstiloCal].forEach((el) => { if (el) el.addEventListener("change", () => { guardarCalendarioPersistente(); dibujarCalendario(); }); });
if (selectColorCal) selectColorCal.addEventListener("change", () => {
  const mesIdx = parseInt(selectMes.value) || 0;
  mesesData[mesIdx].color = selectColorCal.value;
  if (inputColorEvento) inputColorEvento.value = selectColorCal.value;
  guardarCalendarioPersistente(); dibujarCalendario();
});
[calRangeX, calRangeY, calRangeZoom].forEach((sl) => {
  if (!sl) return;
  sl.addEventListener("input", () => {
    const m = mesesData[parseInt(selectMes.value) || 0];
    m.x = parseInt(calRangeX.value); m.y = parseInt(calRangeY.value); m.zoom = parseInt(calRangeZoom.value);
    dibujarCalendario();
  });
  sl.addEventListener("change", guardarCalendarioPersistente);
});
if (inputFotoCal) {
  inputFotoCal.addEventListener("change", (e) => {
    const archivos = Array.from(e.target.files).slice(0, 12);
    e.target.value = ""; if (archivos.length === 0) return;
    const mesInicio = parseInt(selectMes.value) || 0;
    archivos.forEach((archivo, idx) => {
      const destinoMes = (mesInicio + idx) % 12;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => { mesesData[destinoMes].img = img; guardarCalendarioPersistente(); if (destinoMes === mesInicio) dibujarCalendario(); };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(archivo);
    });
  });
}

if (btnAgregarEvento) {
  btnAgregarEvento.addEventListener("click", () => {
    const mesIdx = parseInt(selectMes.value) || 0;
    const dia = parseInt(inputDiaEvento.value);
    const texto = inputTextoEvento.value.trim();
    const colorEv = inputColorEvento ? inputColorEvento.value : mesesData[mesIdx].color;
    if (!dia || dia < 1 || dia > 31 || !texto) return alert("Ingresá un día válido (1-31) y un nombre.");
    if (eventoEditandoIndex !== null) {
      mesesData[mesIdx].eventos[eventoEditandoIndex] = { dia, icono: selectIconoEvento.value, texto, color: colorEv };
      eventoEditandoIndex = null; btnAgregarEvento.textContent = "+";
    } else {
      mesesData[mesIdx].eventos.push({ dia, icono: selectIconoEvento.value, texto, color: colorEv });
    }
    inputDiaEvento.value = ""; inputTextoEvento.value = "";
    guardarCalendarioPersistente(); renderizarChipsEventos(); dibujarCalendario();
  });
}
if (btnDescargarCal) {
  btnDescargarCal.addEventListener("click", () => {
    const mesNombre = NOMBRES_MESES[parseInt(selectMes.value) || 0];
    const link = document.createElement("a"); link.download = `LiveStudio-Calendario-${mesNombre}-${inputAnio.value}.png`;
    link.href = canvasCal.toDataURL("image/png", 1.0); link.click();
  });
}
if (btnDescargarCalPdf) {
  btnDescargarCalPdf.addEventListener("click", () => {
    const mesNombre = NOMBRES_MESES[parseInt(selectMes.value) || 0];
    exportarCanvasAPdf(canvasCal, `LiveStudio-Calendario-${mesNombre}-${inputAnio.value}`, selectEstiloCal.value === "escritorio");
  });
}
if (btnDescargarCalAnual) {
  btnDescargarCalAnual.addEventListener("click", () => {
    const esHorizontal = selectEstiloCal.value === "escritorio";
    const hojasAnuales = [];
    for (let i = 0; i < 12; i++) {
      const cTemp = document.createElement("canvas");
      dibujarCalendarioEnContexto(cTemp.getContext("2d"), cTemp, i);
      hojasAnuales.push(cTemp);
    }
    exportarMultiplesCanvasAPdf(hojasAnuales, `LiveStudio-Calendario-Anual-${inputAnio.value}`, esHorizontal);
  });
}
const inputFotoCollage = document.getElementById("input-foto-collage");
const contadorCollage = document.getElementById("contador-collage");
const btnLimpiarCollage = document.getElementById("btn-limpiar-collage");
const selectLayoutCollage = document.getElementById("select-layout-collage");
const selectRatioCollage = document.getElementById("select-ratio-collage");
const selectSlotCollage = document.getElementById("select-slot-collage");
const btnSwapCollage = document.getElementById("btn-swap-collage");
const btnQuitarSlotCollage = document.getElementById("btn-quitar-slot-collage");
const galeriaCollage = document.getElementById("galeria-collage");
const collagePosX = document.getElementById("collage-pos-x");
const collagePosY = document.getElementById("collage-pos-y");
const collageZoom = document.getElementById("collage-zoom");
const collageFiltro = document.getElementById("collage-filtro");
const collageTexto = document.getElementById("collage-texto");
const collageGrosor = document.getElementById("collage-grosor");
const collageRadio = document.getElementById("collage-radio");
const collageColorMarco = document.getElementById("collage-color-marco");
const btnDescargarCollage = document.getElementById("btn-descargar-collage");
const btnDescargarCollagePdf = document.getElementById("btn-descargar-collage-pdf");
const canvasCollage = document.getElementById("canvas-collage");
const ctxCollage = canvasCollage ? canvasCollage.getContext("2d") : null;

let slotsCollage = Array.from({ length: 20 }, () => ({ img: null, x: 50, y: 50, zoom: 100 }));
let slotCollageActivo = 0;
let swapCollageOrigen = null;
function obtenerCeldasLayout(layout, w, h, gap, topOffset) {
  const usableW = w - gap * 2, usableH = h - topOffset - gap;
  const celdas = [];
  const crearGrilla = (filas, cols) => {
    const cellW = (usableW - gap * (cols - 1)) / cols, cellH = (usableH - gap * (filas - 1)) / filas;
    for (let r = 0; r < filas; r++) for (let c = 0; c < cols; c++) celdas.push({ x: gap + c * (cellW + gap), y: topOffset + r * (cellH + gap), w: cellW, h: cellH });
  };
  if (layout === "grid2x2") crearGrilla(2, 2);
  else if (layout === "grid3x3") crearGrilla(3, 3);
  else if (layout === "grid4x4") crearGrilla(4, 4);
  else if (layout === "grid4x5") crearGrilla(5, 4);
  else if (layout === "photobooth") crearGrilla(4, 1);
  else if (layout === "editorial5") {
    const bigW = usableW * 0.58 - gap / 2, smallW = usableW * 0.42 - gap / 2, smallH = (usableH - gap * 3) / 4;
    celdas.push({ x: gap, y: topOffset, w: bigW, h: usableH });
    for (let i = 0; i < 4; i++) celdas.push({ x: gap + bigW + gap, y: topOffset + i * (smallH + gap), w: smallW, h: smallH });
  } else {
    const cellW = (usableW - gap * 3) / 4, cellH = (usableH - gap * 3) / 4;
    celdas.push({ x: gap + cellW + gap, y: topOffset + cellH + gap, w: cellW * 2 + gap, h: cellH * 2 + gap });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if ((r === 1 || r === 2) && (c === 1 || c === 2)) continue;
      celdas.push({ x: gap + c * (cellW + gap), y: topOffset + r * (cellH + gap), w: cellW, h: cellH });
    }
  }
  return celdas;
}
function sincronizarSlidersCollage() {
  const actual = slotsCollage[slotCollageActivo] || { x: 50, y: 50, zoom: 100 };
  if (collagePosX) collagePosX.value = actual.x;
  if (collagePosY) collagePosY.value = actual.y;
  if (collageZoom) collageZoom.value = actual.zoom;
}

function actualizarInterfazCollage(totalCeldas) {
  if (slotCollageActivo >= totalCeldas) slotCollageActivo = 0;
  if (selectSlotCollage) {
    selectSlotCollage.innerHTML = "";
    for (let i = 0; i < totalCeldas; i++) {
      const opt = document.createElement("option");
      opt.value = i; opt.textContent = `Espacio #${i + 1} ${slotsCollage[i].img ? "✓" : "(Vacío)"}`;
      if (i === slotCollageActivo) opt.selected = true;
      selectSlotCollage.appendChild(opt);
    }
  }
  const cargadas = slotsCollage.slice(0, totalCeldas).filter((s) => s.img !== null).length;
  if (contadorCollage) contadorCollage.textContent = `${cargadas} / ${totalCeldas} espacios con foto`;
  if (btnSwapCollage) {
    btnSwapCollage.classList.toggle("btn-activo-swap", swapCollageOrigen !== null);
    btnSwapCollage.textContent = swapCollageOrigen !== null ? `⇄ Tocá destino (#${swapCollageOrigen + 1})` : "⇄ Mover de lugar";
  }
  if (galeriaCollage) {
    galeriaCollage.innerHTML = "";
    for (let i = 0; i < totalCeldas; i++) {
      const item = document.createElement("div");
      item.className = `mini-slot ${i === slotCollageActivo ? "activo" : ""} ${swapCollageOrigen === i ? "swap-origen" : ""}`;
      item.innerHTML = slotsCollage[i].img ? `<img src="${slotsCollage[i].img.src}"><span class="num-slot">${i + 1}</span>` : `<span class="num-slot">${i + 1}</span>`;
      item.addEventListener("click", () => {
        if (swapCollageOrigen !== null && swapCollageOrigen !== i) { const t = slotsCollage[swapCollageOrigen]; slotsCollage[swapCollageOrigen] = slotsCollage[i]; slotsCollage[i] = t; swapCollageOrigen = null; slotCollageActivo = i; }
        else { swapCollageOrigen = null; slotCollageActivo = i; }
        sincronizarSlidersCollage(); dibujarCollage();
      });
      galeriaCollage.appendChild(item);
    }
  }
}
function dibujarCollage() {
  if (!canvasCollage || !ctxCollage) return;
  const dims = { cuadrado: { w: 2400, h: 2400 }, insta45: { w: 2160, h: 2700 }, story: { w: 1800, h: 3200 }, a4: { w: 2480, h: 3508 }, a4Horizontal: { w: 3508, h: 2480 }, monitor169: { w: 3840, h: 2160 } };
  const tam = dims[selectRatioCollage.value] || dims.cuadrado;
  canvasCollage.width = tam.w; canvasCollage.height = tam.h;

  const texto = collageTexto.value.trim();
  const gap = (parseInt(collageGrosor.value) || 0) * 2;
  const radio = (parseInt(collageRadio.value) || 0) * 2;
  const bottomSpace = texto ? 160 : 0;

  ctxCollage.fillStyle = collageColorMarco.value; ctxCollage.fillRect(0, 0, canvasCollage.width, canvasCollage.height);
  const celdas = obtenerCeldasLayout(selectLayoutCollage.value, canvasCollage.width, canvasCollage.height - bottomSpace, gap, gap);
  actualizarInterfazCollage(celdas.length);
  celdas.forEach((celda, idx) => {
    const slot = slotsCollage[idx];
    ctxCollage.save(); ctxCollage.beginPath();
    if (ctxCollage.roundRect) ctxCollage.roundRect(celda.x, celda.y, celda.w, celda.h, radio);
    else ctxCollage.rect(celda.x, celda.y, celda.w, celda.h);
    ctxCollage.clip();

    if (slot && slot.img) {
      ctxCollage.filter = collageFiltro.value;
      dibujarImagenCover(ctxCollage, slot.img, celda.x, celda.y, celda.w, celda.h, slot.x / 100, slot.y / 100, slot.zoom / 100);
      ctxCollage.filter = "none";
    } else {
      ctxCollage.fillStyle = "#E2E8F0"; ctxCollage.fillRect(celda.x, celda.y, celda.w, celda.h);
      ctxCollage.fillStyle = "#64748B"; ctxCollage.font = `bold ${Math.max(32, Math.round(Math.min(celda.w, celda.h) * 0.14))}px system-ui, sans-serif`;
      ctxCollage.textAlign = "center"; ctxCollage.textBaseline = "middle"; ctxCollage.fillText(`#${idx + 1}`, celda.x + celda.w / 2, celda.y + celda.h / 2);
    }
    ctxCollage.restore();

    if (idx === slotCollageActivo) {
      ctxCollage.save(); ctxCollage.strokeStyle = "#E8364C"; ctxCollage.lineWidth = 10;
      if (ctxCollage.roundRect) { ctxCollage.beginPath(); ctxCollage.roundRect(celda.x, celda.y, celda.w, celda.h, radio); ctxCollage.stroke(); }
      else ctxCollage.strokeRect(celda.x, celda.y, celda.w, celda.h);
      ctxCollage.restore();
    }
  });

  if (texto) {
    const esOscuro = parseInt(collageColorMarco.value.replace("#", ""), 16) < 0x888888;
    ctxCollage.fillStyle = esOscuro ? "#FFFFFF" : "#083090";
    ctxCollage.font = "900 68px system-ui, sans-serif"; ctxCollage.textAlign = "center"; ctxCollage.textBaseline = "middle";
    ctxCollage.fillText(texto, canvasCollage.width / 2, canvasCollage.height - bottomSpace / 2);
  }
}
if (canvasCollage) {
  canvasCollage.addEventListener("click", (e) => {
    const rect = canvasCollage.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvasCollage.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvasCollage.height / rect.height);
    const gap = (parseInt(collageGrosor.value) || 0) * 2;
    const bottomSpace = collageTexto.value.trim() ? 160 : 0;
    const celdas = obtenerCeldasLayout(selectLayoutCollage.value, canvasCollage.width, canvasCollage.height - bottomSpace, gap, gap);
    for (let i = 0; i < celdas.length; i++) {
      const c = celdas[i];
      if (clickX >= c.x && clickX <= c.x + c.w && clickY >= c.y && clickY <= c.y + c.h) {
        if (swapCollageOrigen !== null && swapCollageOrigen !== i) { const t = slotsCollage[swapCollageOrigen]; slotsCollage[swapCollageOrigen] = slotsCollage[i]; slotsCollage[i] = t; swapCollageOrigen = null; }
        slotCollageActivo = i; sincronizarSlidersCollage(); dibujarCollage(); break;
      }
    }
  });
}

if (inputFotoCollage) {
  inputFotoCollage.addEventListener("change", (e) => {
    const archivos = Array.from(e.target.files).slice(0, 20);
    e.target.value = ""; if (archivos.length === 0) return;
    let puntero = slotCollageActivo;
    archivos.forEach((archivo) => {
      const destino = puntero % 20; puntero++;
      const reader = new FileReader();
      reader.onload = (ev) => { const img = new Image(); img.onload = () => { slotsCollage[destino] = { img, x: 50, y: 50, zoom: 100 }; sincronizarSlidersCollage(); dibujarCollage(); }; img.src = ev.target.result; };
      reader.readAsDataURL(archivo);
    });
  });
}
if (btnSwapCollage) btnSwapCollage.addEventListener("click", () => { swapCollageOrigen = swapCollageOrigen === null ? slotCollageActivo : null; dibujarCollage(); });
if (btnQuitarSlotCollage) btnQuitarSlotCollage.addEventListener("click", () => { slotsCollage[slotCollageActivo] = { img: null, x: 50, y: 50, zoom: 100 }; swapCollageOrigen = null; sincronizarSlidersCollage(); dibujarCollage(); });
if (btnLimpiarCollage) btnLimpiarCollage.addEventListener("click", () => { slotsCollage = Array.from({ length: 20 }, () => ({ img: null, x: 50, y: 50, zoom: 100 })); slotCollageActivo = 0; swapCollageOrigen = null; sincronizarSlidersCollage(); dibujarCollage(); });
if (selectSlotCollage) selectSlotCollage.addEventListener("change", () => { slotCollageActivo = parseInt(selectSlotCollage.value) || 0; swapCollageOrigen = null; sincronizarSlidersCollage(); dibujarCollage(); });
[collagePosX, collagePosY, collageZoom].forEach((sl) => { if (!sl) return; sl.addEventListener("input", () => { if (!slotsCollage[slotCollageActivo]) return; slotsCollage[slotCollageActivo].x = parseInt(collagePosX.value); slotsCollage[slotCollageActivo].y = parseInt(collagePosY.value); slotsCollage[slotCollageActivo].zoom = parseInt(collageZoom.value); dibujarCollage(); }); });
[selectLayoutCollage, selectRatioCollage, collageFiltro, collageTexto, collageGrosor, collageRadio, collageColorMarco].forEach((el) => { if (el) el.addEventListener("input", dibujarCollage); });
if (btnDescargarCollage) {
  btnDescargarCollage.addEventListener("click", () => {
    const b = slotCollageActivo; slotCollageActivo = -1; dibujarCollage();
    const link = document.createElement("a"); link.download = `LiveStudio-Collage-${selectLayoutCollage.value}.png`; link.href = canvasCollage.toDataURL("image/png", 1.0); link.click();
    slotCollageActivo = b; dibujarCollage();
  });
}
if (btnDescargarCollagePdf) {
  btnDescargarCollagePdf.addEventListener("click", () => {
    const b = slotCollageActivo; slotCollageActivo = -1; dibujarCollage();
    exportarCanvasAPdf(canvasCollage, `LiveStudio-Collage-${selectLayoutCollage.value}`, selectRatioCollage.value === "a4Horizontal");
    slotCollageActivo = b; dibujarCollage();
  });
}
let eventoInstalacionDiferido = null;
const btnInstalarPwa = document.getElementById("btn-instalar-pwa");
const modalIos = document.getElementById("modal-ios");
const btnCerrarIos = document.getElementById("btn-cerrar-ios");

const esIphone = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const yaInstalada = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

if (esIphone && !yaInstalada && btnInstalarPwa) btnInstalarPwa.hidden = false;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacionDiferido = e;
  if (btnInstalarPwa) btnInstalarPwa.hidden = false;
});

if (btnInstalarPwa) {
  btnInstalarPwa.addEventListener("click", async () => {
    if (esIphone) { if (modalIos) modalIos.hidden = false; return; }
    if (!eventoInstalacionDiferido) return;
    eventoInstalacionDiferido.prompt();
    const resultado = await eventoInstalacionDiferido.userChoice;
    if (resultado.outcome === "accepted") btnInstalarPwa.hidden = true;
    eventoInstalacionDiferido = null;
  });
}
if (btnCerrarIos && modalIos) btnCerrarIos.addEventListener("click", () => { modalIos.hidden = true; });
window.addEventListener("appinstalled", () => { if (btnInstalarPwa) btnInstalarPwa.hidden = true; });

const badgeOffline = document.getElementById("badge-offline");
function actualizarEstadoConexion() { if (badgeOffline) badgeOffline.hidden = navigator.onLine; }
window.addEventListener("online", actualizarEstadoConexion);
window.addEventListener("offline", actualizarEstadoConexion);
actualizarEstadoConexion();

window.addEventListener("DOMContentLoaded", () => {
  dibujarAdaptador();
  actualizarInterfazPoca();
  dibujarHojaPhotocards();
  sincronizarControlesMes();
  dibujarCalendario();
  dibujarCollage();
  restaurarCalendarioPersistente();
});
