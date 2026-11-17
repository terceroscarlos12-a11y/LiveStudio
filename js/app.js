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
  galaxyS24: { nombre: "Samsung Galaxy S24", ancho: 1080, alto: 2340, marco: "marco-celular" },
  galaxyA55: { nombre: "Samsung Galaxy A55", ancho: 1080, alto: 2340, marco: "marco-celular" },
  galaxyZFlip: { nombre: "Samsung Galaxy Z Flip 6", ancho: 1080, alto: 2640, marco: "marco-celular" },
  motoEdge50Ultra: { nombre: "Motorola Edge 50 Ultra", ancho: 1220, alto: 2712, marco: "marco-celular" },
  motoG84: { nombre: "Motorola Moto G84", ancho: 1080, alto: 2400, marco: "marco-celular" },
  motoRazr: { nombre: "Motorola Razr 50 Ultra", ancho: 1080, alto: 2640, marco: "marco-celular" },
  xiaomi14: { nombre: "Xiaomi 14", ancho: 1220, alto: 2712, marco: "marco-celular" },
  redmiNote13: { nombre: "Redmi Note 13 Pro", ancho: 1220, alto: 2712, marco: "marco-celular" },
  ipadPro: { nombre: "iPad Pro 12.9", ancho: 2048, alto: 2732, marco: "marco-celular" },
  ipadAir: { nombre: "iPad Air", ancho: 1640, alto: 2360, marco: "marco-celular" },
  galaxyTabS9: { nombre: "Galaxy Tab S9", ancho: 1600, alto: 2560, marco: "marco-celular" },
  monitorFHD: { nombre: "Monitor Full HD", ancho: 1920, alto: 1080, marco: "marco-monitor" },
  monitor2K: { nombre: "Monitor QHD 2K", ancho: 2560, alto: 1440, marco: "marco-monitor" },
  monitor4K: { nombre: "Monitor UHD 4K", ancho: 3840, alto: 2160, marco: "marco-monitor" },
  monitorUltrawide: { nombre: "Monitor Ultrawide", ancho: 3440, alto: 1440, marco: "marco-monitor" }
};

const A4_ANCHO = 2480;
const A4_ALTO = 3508;
const botonesTab = document.querySelectorAll(".tab-btn");
const secciones = document.querySelectorAll(".seccion");
const inputImagen = document.getElementById("input-imagen");
const selectDispositivo = document.getElementById("select-dispositivo");
const rangeX = document.getElementById("range-x");
const rangeY = document.getElementById("range-y");
const rangeZoom = document.getElementById("range-zoom");
const marcoDispositivo = document.getElementById("marco-dispositivo");
const canvas = document.getElementById("canvas-preview");
const ctx = canvas.getContext("2d");
const btnDescargar = document.getElementById("btn-descargar");

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
const ctxPoca = canvasPoca.getContext("2d");
const btnDescargarPoca = document.getElementById("btn-descargar-poca");
const btnDescargarPocaPdf = document.getElementById("btn-descargar-poca-pdf");

const inputFotoCal = document.getElementById("input-foto-cal");
const selectEstiloCal = document.getElementById("select-estilo-cal");
const calRangeX = document.getElementById("cal-range-x");
const calRangeY = document.getElementById("cal-range-y");
const calRangeZoom = document.getElementById("cal-range-zoom");
const selectMes = document.getElementById("select-mes");
const inputAnio = document.getElementById("input-anio");
const selectColorCal = document.getElementById("select-color-cal");
const inputDiaEvento = document.getElementById("input-dia-evento");
const selectIconoEvento = document.getElementById("select-icono-evento");
const inputTextoEvento = document.getElementById("input-texto-evento");
const btnAgregarEvento = document.getElementById("btn-agregar-evento");
const listaEventosChips = document.getElementById("lista-eventos-chips");
const canvasCal = document.getElementById("canvas-cal");
const ctxCal = canvasCal.getContext("2d");
const btnDescargarCal = document.getElementById("btn-descargar-cal");
const btnDescargarCalPdf = document.getElementById("btn-descargar-cal-pdf");
const btnDescargarCalAnual = document.getElementById("btn-descargar-cal-anual");

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
const canvasCollage = document.getElementById("canvas-collage");
const ctxCollage = canvasCollage.getContext("2d");
const btnDescargarCollage = document.getElementById("btn-descargar-collage");
const btnDescargarCollagePdf = document.getElementById("btn-descargar-collage-pdf");

let imagenActual = null;
let archivosPocaGuardados = [];
let listaImagenesPoca = [];
let slotsPocaConfig = Array.from({ length: 9 }, (_, i) => ({ imgIdx: i, x: 50, y: 50, zoom: 100, vacio: false }));
let rectangulosPoca = [];
let modoSwapPoca = false;

let datosMesesCal = Array.from({ length: 12 }, () => ({ img: null, posX: 50, posY: 50, zoom: 100, eventos: [] }));

let archivosCollageGuardados = [];
let listaImagenesCollage = [];
let slotsCollageConfig = Array.from({ length: 20 }, (_, i) => ({ imgIdx: i, x: 50, y: 50, zoom: 100, vacio: false }));
let rectangulosCollage = [];
let modoSwapCollage = false;

const nombresMeses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
botonesTab.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesTab.forEach((btn) => btn.classList.remove("active"));
    secciones.forEach((sec) => sec.classList.remove("activa"));
    boton.classList.add("active");
    document.getElementById(boton.getAttribute("data-target")).classList.add("activa");
  });
});

function cargarImagenEnVariable(archivo, callback) {
  if (!archivo) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(archivo);
}

function dibujarImagenRecortada(contexto, img, destX, destY, destW, destH, posX = 50, posY = 50, zoom = 100, radio = 0) {
  contexto.save();
  if (radio > 0) {
    contexto.beginPath();
    contexto.roundRect(destX, destY, destW, destH, radio);
    contexto.clip();
  }
  const propImg = img.width / img.height;
  const propDest = destW / destH;
  let baseSw, baseSh;

  if (propImg > propDest) {
    baseSh = img.height;
    baseSw = img.height * propDest;
  } else {
    baseSw = img.width;
    baseSh = img.width / propDest;
  }

  const factorZoom = zoom / 100;
  const sw = baseSw / factorZoom;
  const sh = baseSh / factorZoom;
  const sx = (img.width - sw) * (posX / 100);
  const sy = (img.height - sh) * (posY / 100);

  contexto.drawImage(img, sx, sy, sw, sh, destX, destY, destW, destH);
  contexto.restore();
}

function exportarPaginasAPDF(listaImagenesJpeg, nombreArchivo, orientacion = "portrait") {
  const wPt = orientacion === "landscape" ? 842 : 595;
  const hPt = orientacion === "landscape" ? 595 : 842;
  const enc = new TextEncoder();
  const partes = Array.of();
  const offsets = Array.of(0);
  let pos = 0;

  const agregarTexto = (txt) => {
    const b = enc.encode(txt);
    partes.push(b);
    pos += b.length;
  };

  agregarTexto("%PDF-1.3\n");
  const totalPaginas = listaImagenesJpeg.length;
  const kidsRefs = Array.from({ length: totalPaginas }, (_, i) => `${3 + i * 3} 0 R`).join(" ");

  offsets.push(pos);
  agregarTexto("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  offsets.push(pos);
  agregarTexto(`2 0 obj\n<< /Type /Pages /Kids [${kidsRefs}] /Count ${totalPaginas} >>\nendobj\n`);

  listaImagenesJpeg.forEach((item, i) => {
    const pageObj = 3 + i * 3;
    const imgObj = 4 + i * 3;
    const contObj = 5 + i * 3;

    const base64 = item.dataUrl.split(",").at(1);
    const binStr = atob(base64);
    const imgBytes = new Uint8Array(binStr.length);
    for (let j = 0; j < binStr.length; j++) {
      imgBytes.set(Array.of(binStr.charCodeAt(j)), j);
    }

    offsets.push(pos);
    agregarTexto(`${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im1 ${imgObj} 0 R >> >> /MediaBox [0 0 ${wPt} ${hPt}] /Contents ${contObj} 0 R >>\nendobj\n`);
    offsets.push(pos);
    agregarTexto(`${imgObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${item.width} /Height ${item.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`);
    partes.push(imgBytes);
    pos += imgBytes.length;
    agregarTexto("\nendstream\nendobj\n");

    const contenido = `q\n${wPt} 0 0 ${hPt} 0 0 cm\n/Im1 Do\nQ\n`;
    offsets.push(pos);
    agregarTexto(`${contObj} 0 obj\n<< /Length ${contenido.length} >>\nstream\n${contenido}endstream\nendobj\n`);
  });

  const xrefPos = pos;
  agregarTexto(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (let i = 1; i < offsets.length; i++) {
    agregarTexto(`${String(offsets.at(i)).padStart(10, "0")} 00000 n \n`);
  }
  agregarTexto(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);

  const blobPDF = new Blob(partes, { type: "application/pdf" });
  const urlBlob = URL.createObjectURL(blobPDF);
  const enlace = document.createElement("a");
  enlace.href = urlBlob;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  setTimeout(() => URL.revokeObjectURL(urlBlob), 2500);
}

function exportarCanvasAPDF(canvasOrigen, nombreArchivo, orientacion = "portrait") {
  const dataUrl = canvasOrigen.toDataURL("image/jpeg", 0.92);
  exportarPaginasAPDF(Array.of({ dataUrl, width: canvasOrigen.width, height: canvasOrigen.height }), nombreArchivo, orientacion);
}
inputImagen.addEventListener("change", async (evento) => {
  const archivo = evento.target.files.item(0);
  if (!archivo) return;
  evento.target.value = "";
  await guardarImagenLocal("ultima_foto_adaptador", archivo);
  cargarImagenEnVariable(archivo, (img) => {
    imagenActual = img;
    dibujarEnCanvas();
  });
});

selectDispositivo.addEventListener("change", () => {
  guardarPreferencia("dispositivo_seleccionado", selectDispositivo.value);
  dibujarEnCanvas();
});

rangeX.addEventListener("input", () => dibujarEnCanvas());
rangeY.addEventListener("input", () => dibujarEnCanvas());
rangeZoom.addEventListener("input", () => dibujarEnCanvas());

function dibujarEnCanvas() {
  const config = dispositivos[selectDispositivo.value] || dispositivos.iphone16Pro;
  canvas.width = config.ancho;
  canvas.height = config.alto;
  marcoDispositivo.className = config.marco;

  if (!imagenActual) {
    ctx.fillStyle = "#1E263B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#C6DCF3";
    ctx.font = "bold 46px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Subí una imagen para ver", canvas.width / 2, canvas.height / 2);
    return;
  }

  dibujarImagenRecortada(
    ctx, imagenActual, 0, 0, canvas.width, canvas.height,
    parseInt(rangeX.value), parseInt(rangeY.value), parseInt(rangeZoom.value)
  );
}

btnDescargar.addEventListener("click", () => {
  if (!imagenActual) return alert("Primero subí una imagen.");
  const enlace = document.createElement("a");
  enlace.download = `LiveStudio-${selectDispositivo.value}.png`;
  enlace.href = canvas.toDataURL("image/png", 1.0);
  enlace.click();
});
const nombresPosicionesPoca = [
  "Fila 1 • Izquierda", "Fila 1 • Centro", "Fila 1 • Derecha",
  "Fila 2 • Izquierda", "Fila 2 • Centro", "Fila 2 • Derecha",
  "Fila 3 • Izquierda", "Fila 3 • Centro", "Fila 3 • Derecha"
];

btnSwapPoca.addEventListener("click", () => {
  modoSwapPoca = !modoSwapPoca;
  btnSwapPoca.classList.toggle("btn-activo-swap", modoSwapPoca);
  btnSwapPoca.textContent = modoSwapPoca ? "Tocá destino..." : "⇄ Mover de lugar";
});

btnQuitarSlotPoca.addEventListener("click", () => {
  const slotIdx = parseInt(selectSlotPoca.value) || 0;
  slotsPocaConfig.at(slotIdx).vacio = true;
  dibujarHojaPoca(true);
});

function actualizarSelectoresPoca() {
  const prev = parseInt(selectSlotPoca.value) || 0;
  selectSlotPoca.innerHTML = "";
  const esBanner = selectFormatoPoca.value === "banners";
  const cantidad = esBanner ? 2 : 9;

  for (let i = 0; i < cantidad; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = esBanner ? (i === 0 ? "Banner Superior" : "Banner Inferior") : nombresPosicionesPoca.at(i);
    selectSlotPoca.appendChild(opt);
  }
  if (prev < cantidad) selectSlotPoca.value = prev;

  galeriaPoca.innerHTML = "";
  listaImagenesPoca.forEach((img, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "miniatura-wrapper";

    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = "miniatura-item";
    thumb.addEventListener("click", () => {
      const slotIdx = parseInt(selectSlotPoca.value) || 0;
      slotsPocaConfig.at(slotIdx).imgIdx = idx;
      slotsPocaConfig.at(slotIdx).vacio = false;
      sincronizarControlesSlotPoca();
      dibujarHojaPoca(true);
    });

    const btnDel = document.createElement("button");
    btnDel.className = "btn-borrar-thumb";
    btnDel.textContent = "×";
    btnDel.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      archivosPocaGuardados.splice(idx, 1);
      await guardarImagenLocal("ultimas_fotos_poca", archivosPocaGuardados);
      cargarListaImagenesPoca(archivosPocaGuardados);
    });

    wrap.appendChild(thumb);
    wrap.appendChild(btnDel);
    galeriaPoca.appendChild(wrap);
  });

  sincronizarControlesSlotPoca();
}

function sincronizarControlesSlotPoca() {
  const slotIdx = parseInt(selectSlotPoca.value) || 0;
  const conf = slotsPocaConfig.at(slotIdx);
  pocaRangeX.value = conf.x;
  pocaRangeY.value = conf.y;
  pocaRangeZoom.value = conf.zoom;

  const thumbs = galeriaPoca.querySelectorAll(".miniatura-item");
  thumbs.forEach((t, i) => {
    const activa = !conf.vacio && listaImagenesPoca.length > 0 && (conf.imgIdx % listaImagenesPoca.length === i);
    t.classList.toggle("seleccionada", activa);
  });
}
canvasPoca.addEventListener("click", (e) => {
  const rect = canvasPoca.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) * (canvasPoca.width / rect.width);
  const clickY = (e.clientY - rect.top) * (canvasPoca.height / rect.height);

  const encontrada = rectangulosPoca.findIndex(
    (r) => clickX >= r.x && clickX <= r.x + r.w && clickY >= r.y && clickY <= r.y + r.h
  );
  if (encontrada === -1) return;

  const origen = parseInt(selectSlotPoca.value) || 0;
  if (modoSwapPoca && origen !== encontrada) {
    const temp = { ...slotsPocaConfig.at(origen) };
    slotsPocaConfig.splice(origen, 1, { ...slotsPocaConfig.at(encontrada) });
    slotsPocaConfig.splice(encontrada, 1, temp);
    modoSwapPoca = false;
    btnSwapPoca.classList.remove("btn-activo-swap");
    btnSwapPoca.textContent = "⇄ Mover de lugar";
  }

  selectSlotPoca.value = encontrada;
  sincronizarControlesSlotPoca();
  dibujarHojaPoca(true);
});

selectSlotPoca.addEventListener("change", () => { sincronizarControlesSlotPoca(); dibujarHojaPoca(true); });
pocaRangeX.addEventListener("input", () => { slotsPocaConfig.at(parseInt(selectSlotPoca.value) || 0).x = parseInt(pocaRangeX.value); dibujarHojaPoca(true); });
pocaRangeY.addEventListener("input", () => { slotsPocaConfig.at(parseInt(selectSlotPoca.value) || 0).y = parseInt(pocaRangeY.value); dibujarHojaPoca(true); });
pocaRangeZoom.addEventListener("input", () => { slotsPocaConfig.at(parseInt(selectSlotPoca.value) || 0).zoom = parseInt(pocaRangeZoom.value); dibujarHojaPoca(true); });

inputFotoPoca.addEventListener("change", async (e) => {
  const nuevos = Array.from(e.target.files);
  if (nuevos.length === 0) return;
  const cantidadPrevia = archivosPocaGuardados.length;
  archivosPocaGuardados = [...archivosPocaGuardados, ...nuevos].slice(0, 9);
  inputFotoPoca.value = "";
  for (let i = cantidadPrevia; i < archivosPocaGuardados.length; i++) {
    slotsPocaConfig.at(i).imgIdx = i;
    slotsPocaConfig.at(i).vacio = false;
  }
  await guardarImagenLocal("ultimas_fotos_poca", archivosPocaGuardados);
  cargarListaImagenesPoca(archivosPocaGuardados);
});

btnLimpiarPoca.addEventListener("click", async () => {
  archivosPocaGuardados = [];
  listaImagenesPoca = [];
  slotsPocaConfig = Array.from({ length: 9 }, (_, i) => ({ imgIdx: i, x: 50, y: 50, zoom: 100, vacio: false }));
  contadorPoca.textContent = "0 / 9 fotos cargadas";
  await guardarImagenLocal("ultimas_fotos_poca", []);
  actualizarSelectoresPoca();
  dibujarHojaPoca(true);
});

function cargarListaImagenesPoca(archivos) {
  listaImagenesPoca = [];
  contadorPoca.textContent = `${archivos.length} / 9 fotos cargadas`;
  if (archivos.length === 0) { actualizarSelectoresPoca(); dibujarHojaPoca(true); return; }
  let cargadas = 0;
  archivos.forEach((archivo, indice) => {
    cargarImagenEnVariable(archivo, (img) => {
      listaImagenesPoca.splice(indice, 1, img);
      cargadas++;
      if (cargadas === archivos.length) { actualizarSelectoresPoca(); dibujarHojaPoca(true); }
    });
  });
}

selectFormatoPoca.addEventListener("change", () => { actualizarSelectoresPoca(); dibujarHojaPoca(true); });
checkGuias.addEventListener("change", () => dibujarHojaPoca(true));

function dibujarHojaPoca(mostrarSeleccion = true) {
  canvasPoca.width = A4_ANCHO;
  canvasPoca.height = A4_ALTO;
  ctxPoca.fillStyle = "#FFFFFF";
  ctxPoca.fillRect(0, 0, A4_ANCHO, A4_ALTO);
  rectangulosPoca = [];
  const slotActivo = parseInt(selectSlotPoca.value) || 0;

  if (selectFormatoPoca.value === "photocards") {
    const cardW = 650, cardH = 1004, cols = 3, filas = 3, gap = 60;
    const margenX = (A4_ANCHO - (cols * cardW + (cols - 1) * gap)) / 2;
    const margenY = (A4_ALTO - (filas * cardH + (filas - 1) * gap)) / 2;
    let contador = 0;
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const x = margenX + c * (cardW + gap);
        const y = margenY + f * (cardH + gap);
        rectangulosPoca.push({ x, y, w: cardW, h: cardH });
        const conf = slotsPocaConfig.at(contador);
        if (!conf.vacio && listaImagenesPoca.length > 0) {
          const imgAsignada = listaImagenesPoca.at(conf.imgIdx % listaImagenesPoca.length);
          if (imgAsignada) dibujarImagenRecortada(ctxPoca, imgAsignada, x, y, cardW, cardH, conf.x, conf.y, conf.zoom);
        } else {
          ctxPoca.fillStyle = "#F1F4F9";
          ctxPoca.fillRect(x, y, cardW, cardH);
          ctxPoca.fillStyle = "#8A94A6";
          ctxPoca.font = "bold 34px system-ui, sans-serif";
          ctxPoca.textAlign = "center";
          ctxPoca.fillText(nombresPosicionesPoca.at(contador), x + cardW / 2, y + cardH / 2);
        }
        if (checkGuias.checked) {
          ctxPoca.strokeStyle = "#888888"; ctxPoca.lineWidth = 3;
          ctxPoca.setLineDash(Array.of(15, 15)); ctxPoca.strokeRect(x, y, cardW, cardH); ctxPoca.setLineDash(Array.of());
        }
        if (mostrarSeleccion && contador === slotActivo) {
          ctxPoca.strokeStyle = "#FF5FA2"; ctxPoca.lineWidth = 12; ctxPoca.strokeRect(x, y, cardW, cardH);
        }
        contador++;
      }
    }
  } else {
    const bannerW = 2200, bannerH = 850, x = (A4_ANCHO - bannerW) / 2;
    Array.of(550, 2100).forEach((y, idx) => {
      rectangulosPoca.push({ x, y, w: bannerW, h: bannerH });
      const conf = slotsPocaConfig.at(idx);
      if (!conf.vacio && listaImagenesPoca.length > 0) {
        const imgAsignada = listaImagenesPoca.at(conf.imgIdx % listaImagenesPoca.length);
        if (imgAsignada) dibujarImagenRecortada(ctxPoca, imgAsignada, x, y, bannerW, bannerH, conf.x, conf.y, conf.zoom);
      } else {
        ctxPoca.fillStyle = "#F1F4F9"; ctxPoca.fillRect(x, y, bannerW, bannerH);
      }
      if (checkGuias.checked) {
        ctxPoca.strokeStyle = "#888888"; ctxPoca.lineWidth = 3;
        ctxPoca.setLineDash(Array.of(15, 15)); ctxPoca.strokeRect(x, y, bannerW, bannerH); ctxPoca.setLineDash(Array.of());
      }
      if (mostrarSeleccion && idx === slotActivo) {
        ctxPoca.strokeStyle = "#FF5FA2"; ctxPoca.lineWidth = 12; ctxPoca.strokeRect(x, y, bannerW, bannerH);
      }
    });
  }
}

btnDescargarPoca.addEventListener("click", () => {
  if (listaImagenesPoca.length === 0) return alert("Subí al menos una imagen primero.");
  dibujarHojaPoca(false);
  const link = document.createElement("a");
  link.download = `LiveStudio-A4-${selectFormatoPoca.value}.png`;
  link.href = canvasPoca.toDataURL("image/png", 1.0);
  link.click();
  dibujarHojaPoca(true);
});

btnDescargarPocaPdf.addEventListener("click", () => {
  if (listaImagenesPoca.length === 0) return alert("Subí al menos una imagen primero.");
  dibujarHojaPoca(false);
  exportarCanvasAPDF(canvasPoca, `LiveStudio-A4-${selectFormatoPoca.value}.pdf`, "portrait");
  dibujarHojaPoca(true);
});
function obtenerMesActivo() {
  return parseInt(selectMes.value) || 0;
}

function sincronizarControlesMes() {
  const mesIdx = obtenerMesActivo();
  const data = datosMesesCal.at(mesIdx);
  calRangeX.value = data.posX;
  calRangeY.value = data.posY;
  calRangeZoom.value = data.zoom;
  renderizarChipsEventos();
}

inputFotoCal.addEventListener("change", async (e) => {
  const archivos = Array.from(e.target.files);
  if (archivos.length === 0) return;
  e.target.value = "";
  const mesInicial = obtenerMesActivo();

  if (archivos.length === 1) {
    const archivo = archivos.at(0);
    await guardarImagenLocal(`foto_cal_mes_${mesInicial}`, archivo);
    cargarImagenEnVariable(archivo, (img) => {
      datosMesesCal.at(mesInicial).img = img;
      dibujarCalendario();
    });
  } else {
    const limite = Math.min(archivos.length, 12);
    for (let i = 0; i < limite; i++) {
      const mesDestino = (mesInicial + i) % 12;
      const archivo = archivos.at(i);
      await guardarImagenLocal(`foto_cal_mes_${mesDestino}`, archivo);
      cargarImagenEnVariable(archivo, (img) => {
        datosMesesCal.at(mesDestino).img = img;
        if (mesDestino === obtenerMesActivo()) dibujarCalendario();
      });
    }
  }
});

selectMes.addEventListener("change", () => {
  sincronizarControlesMes();
  dibujarCalendario();
});

selectEstiloCal.addEventListener("change", () => dibujarCalendario());
inputAnio.addEventListener("input", () => dibujarCalendario());
selectColorCal.addEventListener("change", () => dibujarCalendario());

calRangeX.addEventListener("input", () => {
  datosMesesCal.at(obtenerMesActivo()).posX = parseInt(calRangeX.value);
  dibujarCalendario();
});
calRangeY.addEventListener("input", () => {
  datosMesesCal.at(obtenerMesActivo()).posY = parseInt(calRangeY.value);
  dibujarCalendario();
});
calRangeZoom.addEventListener("input", () => {
  datosMesesCal.at(obtenerMesActivo()).zoom = parseInt(calRangeZoom.value);
  dibujarCalendario();
});

btnAgregarEvento.addEventListener("click", () => {
  const dia = parseInt(inputDiaEvento.value);
  const icono = selectIconoEvento.value;
  const texto = inputTextoEvento.value.trim();
  if (!dia || dia < 1 || dia > 31) return alert("Ingresá un día válido (1 a 31).");

  const mesIdx = obtenerMesActivo();
  datosMesesCal.at(mesIdx).eventos.push({ dia, icono, texto });
  guardarPreferencia("eventos_12_meses", datosMesesCal.map(m => m.eventos));
  inputDiaEvento.value = "";
  inputTextoEvento.value = "";
  renderizarChipsEventos();
  dibujarCalendario();
});

function renderizarChipsEventos() {
  const mesIdx = obtenerMesActivo();
  const lista = datosMesesCal.at(mesIdx).eventos;
  listaEventosChips.innerHTML = "";
  lista.forEach((ev, index) => {
    const chip = document.createElement("div");
    chip.className = "chip-evento";
    chip.innerHTML = `<span>${ev.icono} ${ev.dia} ${ev.texto}</span> <button onclick="eliminarEvento(${index})">×</button>`;
    listaEventosChips.appendChild(chip);
  });
}

window.eliminarEvento = function(index) {
  const mesIdx = obtenerMesActivo();
  datosMesesCal.at(mesIdx).eventos.splice(index, 1);
  guardarPreferencia("eventos_12_meses", datosMesesCal.map(m => m.eventos));
  renderizarChipsEventos();
  dibujarCalendario();
};
function dibujarCalendario(mesForzado = null) {
  const mes = typeof mesForzado === "number" ? mesForzado : obtenerMesActivo();
  const dataMes = datosMesesCal.at(mes);
  const estilo = selectEstiloCal.value;
  const anio = parseInt(inputAnio.value) || 2026;
  const colorAcento = selectColorCal.value || "#FF5FA2";

  const esHorizontal = estilo === "escritorio";
  const ancho = esHorizontal ? A4_ALTO : A4_ANCHO;
  const alto = esHorizontal ? A4_ANCHO : A4_ALTO;

  canvasCal.width = ancho;
  canvasCal.height = alto;
  ctxCal.fillStyle = estilo === "editorial" ? "#FFF9FB" : "#FFFFFF";
  ctxCal.fillRect(0, 0, ancho, alto);

  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  if (esHorizontal) {
    const fotoW = ancho * 0.44;
    if (dataMes.img) {
      dibujarImagenRecortada(ctxCal, dataMes.img, 0, 0, fotoW, alto, dataMes.posX, dataMes.posY, dataMes.zoom);
    } else {
      ctxCal.fillStyle = "#E5E9F2";
      ctxCal.fillRect(0, 0, fotoW, alto);
    }

    const panelX = fotoW + 110;
    const panelW = ancho - panelX - 110;

    ctxCal.fillStyle = colorAcento;
    ctxCal.font = "900 105px system-ui, sans-serif";
    ctxCal.textAlign = "left";
    const textoMes = nombresMeses.at(mes) || "ENERO";
    const anchoMes = ctxCal.measureText(textoMes).width;
    ctxCal.fillText(textoMes, panelX, 230);

    ctxCal.fillStyle = "#1E263B";
    ctxCal.font = "700 65px system-ui, sans-serif";
    ctxCal.fillText(`${anio}`, panelX + anchoMes + 35, 230);

    dibujarGrillaDias(panelX, 360, panelW, 180, primerDia, totalDias, colorAcento, false, dataMes.eventos);

    let notaY = 1780;
    ctxCal.font = "600 44px system-ui, sans-serif";
    ctxCal.textAlign = "left";
    dataMes.eventos.forEach((ev) => {
      ctxCal.fillStyle = colorAcento;
      const diaStr = ev.dia < 10 ? `0${ev.dia}` : `${ev.dia}`;
      ctxCal.fillText(`${ev.icono} ${diaStr}  ${ev.texto}`, panelX, notaY);
      notaY += 65;
    });
  } else {
    const margen = 140;
    const fotoW = ancho - margen * 2;
    const fotoH = 1550;

    if (dataMes.img) {
      dibujarImagenRecortada(ctxCal, dataMes.img, margen, margen, fotoW, fotoH, dataMes.posX, dataMes.posY, dataMes.zoom);
    } else {
      ctxCal.fillStyle = "#E5E9F2";
      ctxCal.fillRect(margen, margen, fotoW, fotoH);
      ctxCal.fillStyle = "#667085";
      ctxCal.font = "bold 55px system-ui, sans-serif";
      ctxCal.textAlign = "center";
      ctxCal.fillText(`Subí la foto de ${nombresMeses.at(mes)}`, ancho / 2, margen + fotoH / 2);
    }

    const inicioY = margen + fotoH + 150;
    ctxCal.fillStyle = colorAcento;
    ctxCal.font = "900 115px system-ui, sans-serif";
    ctxCal.textAlign = estilo === "editorial" ? "center" : "left";
    const tituloX = estilo === "editorial" ? ancho / 2 : margen;
    const textoMes = nombresMeses.at(mes) || "ENERO";
    ctxCal.fillText(`${textoMes} ${anio}`, tituloX, inicioY);

    if (estilo === "vertical") ctxCal.fillRect(margen, inicioY + 35, fotoW, 10);

    dibujarGrillaDias(margen, inicioY + 130, fotoW, 175, primerDia, totalDias, colorAcento, estilo === "editorial", dataMes.eventos);

    if (dataMes.eventos.length > 0) {
      ctxCal.font = "bold 40px system-ui, sans-serif";
      ctxCal.textAlign = "left";
      const textoResumen = dataMes.eventos.map(e => `${e.icono} ${e.dia}: ${e.texto}`).join("   •   ");
      ctxCal.fillStyle = colorAcento;
      ctxCal.fillText(textoResumen, margen, 3230);
    }
  }
}

function dibujarGrillaDias(inicioX, inicioY, anchoTotal, altoFila, primerDia, totalDias, colorAcento, conRecuadros, listaEventos = []) {
  const anchoCol = anchoTotal / 7;
  ctxCal.font = "bold 44px system-ui, sans-serif";
  ctxCal.textAlign = "center";

  diasSemana.forEach((dia, idx) => {
    ctxCal.fillStyle = idx === 0 ? "#E8364C" : colorAcento;
    ctxCal.fillText(dia, inicioX + anchoCol * idx + anchoCol / 2, inicioY);
  });

  let fila = 0, col = primerDia;
  for (let dia = 1; dia <= totalDias; dia++) {
    const posX = inicioX + col * anchoCol + anchoCol / 2;
    const posY = inicioY + 135 + fila * altoFila;

    if (conRecuadros) {
      ctxCal.strokeStyle = colorAcento;
      ctxCal.globalAlpha = 0.35;
      ctxCal.lineWidth = 3;
      ctxCal.strokeRect(inicioX + col * anchoCol + 6, posY - 85, anchoCol - 12, altoFila - 16);
      ctxCal.globalAlpha = 1.0;
    }

    const eventoDelDia = listaEventos.find((e) => e.dia === dia);
    if (eventoDelDia) {
      ctxCal.beginPath();
      ctxCal.arc(posX, posY - 18, 48, 0, Math.PI * 2);
      ctxCal.fillStyle = colorAcento;
      ctxCal.fill();

      ctxCal.fillStyle = "#FFFFFF";
      ctxCal.font = "bold 52px system-ui, sans-serif";
      ctxCal.fillText(dia.toString(), posX, posY);

      ctxCal.font = "44px system-ui, sans-serif";
      ctxCal.fillText(eventoDelDia.icono, posX + 42, posY - 42);
    } else {
      ctxCal.fillStyle = col === 0 ? "#E8364C" : "#1E263B";
      ctxCal.font = "600 52px system-ui, sans-serif";
      ctxCal.fillText(dia.toString(), posX, posY);
    }

    col++;
    if (col > 6) { col = 0; fila++; }
  }
}

btnDescargarCal.addEventListener("click", () => {
  const mesNombre = nombresMeses.at(obtenerMesActivo()) || "ENERO";
  const link = document.createElement("a");
  link.download = `LiveStudio-Calendario-${mesNombre}-${inputAnio.value}.png`;
  link.href = canvasCal.toDataURL("image/png", 1.0);
  link.click();
});

btnDescargarCalPdf.addEventListener("click", () => {
  const mesNombre = nombresMeses.at(obtenerMesActivo()) || "ENERO";
  const orientacion = selectEstiloCal.value === "escritorio" ? "landscape" : "portrait";
  exportarCanvasAPDF(canvasCal, `LiveStudio-Calendario-${mesNombre}-${inputAnio.value}.pdf`, orientacion);
});

btnDescargarCalAnual.addEventListener("click", () => {
  const mesOriginal = obtenerMesActivo();
  const orientacion = selectEstiloCal.value === "escritorio" ? "landscape" : "portrait";
  const paginas = Array.of();

  for (let m = 0; m < 12; m++) {
    dibujarCalendario(m);
    paginas.push({
      dataUrl: canvasCal.toDataURL("image/jpeg", 0.90),
      width: canvasCal.width,
      height: canvasCal.height
    });
  }

  exportarPaginasAPDF(paginas, `LiveStudio-Anuario-Completo-${inputAnio.value}.pdf`, orientacion);
  dibujarCalendario(mesOriginal);
});
btnSwapCollage.addEventListener("click", () => {
  modoSwapCollage = !modoSwapCollage;
  btnSwapCollage.classList.toggle("btn-activo-swap", modoSwapCollage);
  btnSwapCollage.textContent = modoSwapCollage ? "Tocá destino..." : "⇄ Mover de lugar";
});

btnQuitarSlotCollage.addEventListener("click", () => {
  const slotIdx = parseInt(selectSlotCollage.value) || 0;
  slotsCollageConfig.at(slotIdx).vacio = true;
  dibujarCollage(true);
});

function obtenerCeldasCollage(layout) {
  if (layout === "grid2x2") {
    return Array.of(
      { nombre: "Arriba Izquierda", rect: Array.of(0, 0, 0.5, 0.5) },
      { nombre: "Arriba Derecha", rect: Array.of(0.5, 0, 0.5, 0.5) },
      { nombre: "Abajo Izquierda", rect: Array.of(0, 0.5, 0.5, 0.5) },
      { nombre: "Abajo Derecha", rect: Array.of(0.5, 0.5, 0.5, 0.5) }
    );
  }
  if (layout === "grid3x3") {
    const t = 1 / 3;
    return Array.from({ length: 9 }, (_, i) => ({
      nombre: `Fila ${Math.floor(i / 3) + 1} • Col ${(i % 3) + 1}`,
      rect: Array.of((i % 3) * t, Math.floor(i / 3) * t, t, t)
    }));
  }
  if (layout === "grid4x4") {
    return Array.from({ length: 16 }, (_, i) => ({
      nombre: `Fila ${Math.floor(i / 4) + 1} • Col ${(i % 4) + 1}`,
      rect: Array.of((i % 4) * 0.25, Math.floor(i / 4) * 0.25, 0.25, 0.25)
    }));
  }
  if (layout === "grid4x5") {
    return Array.from({ length: 20 }, (_, i) => ({
      nombre: `Fila ${Math.floor(i / 4) + 1} • Col ${(i % 4) + 1}`,
      rect: Array.of((i % 4) * 0.25, Math.floor(i / 4) * 0.2, 0.25, 0.2)
    }));
  }
  if (layout === "photobooth") {
    return Array.of(
      { nombre: "Toma #1 (Arriba)", rect: Array.of(0.1, 0.04, 0.8, 0.21) },
      { nombre: "Toma #2", rect: Array.of(0.1, 0.27, 0.8, 0.21) },
      { nombre: "Toma #3", rect: Array.of(0.1, 0.50, 0.8, 0.21) },
      { nombre: "Toma #4 (Abajo)", rect: Array.of(0.1, 0.73, 0.8, 0.21) }
    );
  }
  if (layout === "editorial5") {
    return Array.of(
      { nombre: "Izquierda Grande (Principal)", rect: Array.of(0, 0, 0.6, 1) },
      { nombre: "Costado Derecho 1", rect: Array.of(0.6, 0, 0.4, 0.25) },
      { nombre: "Costado Derecho 2", rect: Array.of(0.6, 0.25, 0.4, 0.25) },
      { nombre: "Costado Derecho 3", rect: Array.of(0.6, 0.5, 0.4, 0.25) },
      { nombre: "Costado Derecho 4", rect: Array.of(0.6, 0.75, 0.4, 0.25) }
    );
  }
  return Array.of(
    { nombre: "⭐ Centro Protagonista", rect: Array.of(0.25, 0.25, 0.5, 0.5) },
    { nombre: "Arriba Esquina Izq", rect: Array.of(0, 0, 0.25, 0.25) },
    { nombre: "Arriba Centro-Izq", rect: Array.of(0.25, 0, 0.25, 0.25) },
    { nombre: "Arriba Centro-Der", rect: Array.of(0.5, 0, 0.25, 0.25) },
    { nombre: "Arriba Esquina Der", rect: Array.of(0.75, 0, 0.25, 0.25) },
    { nombre: "Costado Izq Superior", rect: Array.of(0, 0.25, 0.25, 0.25) },
    { nombre: "Costado Der Superior", rect: Array.of(0.75, 0.25, 0.25, 0.25) },
    { nombre: "Costado Izq Inferior", rect: Array.of(0, 0.5, 0.25, 0.25) },
    { nombre: "Costado Der Inferior", rect: Array.of(0.75, 0.5, 0.25, 0.25) },
    { nombre: "Abajo Esquina Izq", rect: Array.of(0, 0.75, 0.25, 0.25) },
    { nombre: "Abajo Centro-Izq", rect: Array.of(0.25, 0.75, 0.25, 0.25) },
    { nombre: "Abajo Centro-Der", rect: Array.of(0.5, 0.75, 0.25, 0.25) },
    { nombre: "Abajo Esquina Der", rect: Array.of(0.75, 0.75, 0.25, 0.25) }
  );
}
function actualizarSelectoresCollage() {
  const celdas = obtenerCeldasCollage(selectLayoutCollage.value);
  const slotPrevio = parseInt(selectSlotCollage.value) || 0;

  selectSlotCollage.innerHTML = "";
  celdas.forEach((celda, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = celda.nombre;
    selectSlotCollage.appendChild(opt);
  });
  if (slotPrevio < celdas.length) selectSlotCollage.value = slotPrevio;

  galeriaCollage.innerHTML = "";
  listaImagenesCollage.forEach((img, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "miniatura-wrapper";

    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = "miniatura-item";
    thumb.addEventListener("click", () => {
      const slotIdx = parseInt(selectSlotCollage.value) || 0;
      slotsCollageConfig.at(slotIdx).imgIdx = idx;
      slotsCollageConfig.at(slotIdx).vacio = false;
      sincronizarControlesSlotCollage();
      dibujarCollage(true);
    });

    const btnDel = document.createElement("button");
    btnDel.className = "btn-borrar-thumb";
    btnDel.textContent = "×";
    btnDel.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      archivosCollageGuardados.splice(idx, 1);
      await guardarImagenLocal("ultimas_fotos_collage", archivosCollageGuardados);
      cargarListaImagenesCollage(archivosCollageGuardados);
    });

    wrap.appendChild(thumb);
    wrap.appendChild(btnDel);
    galeriaCollage.appendChild(wrap);
  });

  sincronizarControlesSlotCollage();
}

function sincronizarControlesSlotCollage() {
  const slotIdx = parseInt(selectSlotCollage.value) || 0;
  const conf = slotsCollageConfig.at(slotIdx);
  collagePosX.value = conf.x;
  collagePosY.value = conf.y;
  collageZoom.value = conf.zoom;

  const thumbs = galeriaCollage.querySelectorAll(".miniatura-item");
  thumbs.forEach((t, i) => {
    const activa = !conf.vacio && listaImagenesCollage.length > 0 && (conf.imgIdx % listaImagenesCollage.length === i);
    t.classList.toggle("seleccionada", activa);
  });
}

canvasCollage.addEventListener("click", (e) => {
  const rect = canvasCollage.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) * (canvasCollage.width / rect.width);
  const clickY = (e.clientY - rect.top) * (canvasCollage.height / rect.height);

  const encontrada = rectangulosCollage.findIndex(
    (r) => clickX >= r.x && clickX <= r.x + r.w && clickY >= r.y && clickY <= r.y + r.h
  );
  if (encontrada === -1) return;

  const origen = parseInt(selectSlotCollage.value) || 0;
  if (modoSwapCollage && origen !== encontrada) {
    const temp = { ...slotsCollageConfig.at(origen) };
    slotsCollageConfig.splice(origen, 1, { ...slotsCollageConfig.at(encontrada) });
    slotsCollageConfig.splice(encontrada, 1, temp);
    modoSwapCollage = false;
    btnSwapCollage.classList.remove("btn-activo-swap");
    btnSwapCollage.textContent = "⇄ Mover de lugar";
  }

  selectSlotCollage.value = encontrada;
  sincronizarControlesSlotCollage();
  dibujarCollage(true);
});

selectSlotCollage.addEventListener("change", () => { sincronizarControlesSlotCollage(); dibujarCollage(true); });
collagePosX.addEventListener("input", () => { slotsCollageConfig.at(parseInt(selectSlotCollage.value) || 0).x = parseInt(collagePosX.value); dibujarCollage(true); });
collagePosY.addEventListener("input", () => { slotsCollageConfig.at(parseInt(selectSlotCollage.value) || 0).y = parseInt(collagePosY.value); dibujarCollage(true); });
collageZoom.addEventListener("input", () => { slotsCollageConfig.at(parseInt(selectSlotCollage.value) || 0).zoom = parseInt(collageZoom.value); dibujarCollage(true); });
inputFotoCollage.addEventListener("change", async (e) => {
  const nuevas = Array.from(e.target.files);
  if (nuevas.length === 0) return;
  const cantidadPrevia = archivosCollageGuardados.length;
  archivosCollageGuardados = [...archivosCollageGuardados, ...nuevas].slice(0, 20);
  inputFotoCollage.value = "";
  for (let i = cantidadPrevia; i < archivosCollageGuardados.length; i++) {
    slotsCollageConfig.at(i).imgIdx = i;
    slotsCollageConfig.at(i).vacio = false;
  }
  await guardarImagenLocal("ultimas_fotos_collage", archivosCollageGuardados);
  cargarListaImagenesCollage(archivosCollageGuardados);
});

btnLimpiarCollage.addEventListener("click", async () => {
  archivosCollageGuardados = [];
  listaImagenesCollage = [];
  slotsCollageConfig = Array.from({ length: 20 }, (_, i) => ({ imgIdx: i, x: 50, y: 50, zoom: 100, vacio: false }));
  contadorCollage.textContent = "0 fotos cargadas";
  await guardarImagenLocal("ultimas_fotos_collage", []);
  actualizarSelectoresCollage();
  dibujarCollage(true);
});

function cargarListaImagenesCollage(archivos) {
  listaImagenesCollage = [];
  contadorCollage.textContent = `${archivos.length} fotos cargadas`;
  if (archivos.length === 0) { actualizarSelectoresCollage(); dibujarCollage(true); return; }
  let cargadas = 0;
  archivos.forEach((archivo, indice) => {
    cargarImagenEnVariable(archivo, (img) => {
      listaImagenesCollage.splice(indice, 1, img);
      cargadas++;
      if (cargadas === archivos.length) { actualizarSelectoresCollage(); dibujarCollage(true); }
    });
  });
}

selectLayoutCollage.addEventListener("change", () => { actualizarSelectoresCollage(); dibujarCollage(true); });
selectRatioCollage.addEventListener("change", () => dibujarCollage(true));
collageGrosor.addEventListener("input", () => dibujarCollage(true));
collageRadio.addEventListener("input", () => dibujarCollage(true));
collageColorMarco.addEventListener("input", () => dibujarCollage(true));
collageFiltro.addEventListener("change", () => dibujarCollage(true));
collageTexto.addEventListener("input", () => dibujarCollage(true));

function dibujarCollage(mostrarSeleccion = true) {
  const ratio = selectRatioCollage.value;
  let ancho = 2400, alto = 2400;
  if (ratio === "insta45") { ancho = 2160; alto = 2700; }
  else if (ratio === "story") { ancho = 1440; alto = 2560; }
  else if (ratio === "a4") { ancho = A4_ANCHO; alto = A4_ALTO; }
  else if (ratio === "a4Horizontal") { ancho = A4_ALTO; alto = A4_ANCHO; }
  else if (ratio === "monitor169") { ancho = 2560; alto = 1440; }

  canvasCollage.width = ancho;
  canvasCollage.height = alto;

  const grosor = parseInt(collageGrosor.value);
  const radio = parseInt(collageRadio.value);
  const textoPie = collageTexto.value.trim();
  const espacioTexto = textoPie ? 140 : 0;

  ctxCollage.fillStyle = collageColorMarco.value;
  ctxCollage.fillRect(0, 0, ancho, alto);

  const areaW = ancho - grosor;
  const areaH = alto - grosor - espacioTexto;
  const celdas = obtenerCeldasCollage(selectLayoutCollage.value);
  const slotActivo = parseInt(selectSlotCollage.value) || 0;
  rectangulosCollage = [];

  ctxCollage.filter = collageFiltro.value;

  celdas.forEach((item, idx) => {
    const r = item.rect;
    const x = grosor / 2 + r.at(0) * areaW + grosor / 2;
    const y = grosor / 2 + r.at(1) * areaH + grosor / 2;
    const w = r.at(2) * areaW - grosor;
    const h = r.at(3) * areaH - grosor;
    rectangulosCollage.push({ x, y, w, h });
    const conf = slotsCollageConfig.at(idx);

    if (!conf.vacio && listaImagenesCollage.length > 0) {
      const img = listaImagenesCollage.at(conf.imgIdx % listaImagenesCollage.length);
      if (img) dibujarImagenRecortada(ctxCollage, img, x, y, w, h, conf.x, conf.y, conf.zoom, radio);
    } else {
      ctxCollage.fillStyle = "#F1F4F9";
      ctxCollage.beginPath();
      ctxCollage.roundRect(x, y, w, h, radio);
      ctxCollage.fill();

      ctxCollage.fillStyle = "#8A94A6";
      ctxCollage.font = "bold 32px system-ui, sans-serif";
      ctxCollage.textAlign = "center";
      ctxCollage.fillText(item.nombre, x + w / 2, y + h / 2 + 10);
    }

    if (mostrarSeleccion && idx === slotActivo) {
      ctxCollage.filter = "none";
      ctxCollage.strokeStyle = "#FF5FA2";
      ctxCollage.lineWidth = 14;
      ctxCollage.beginPath();
      ctxCollage.roundRect(x, y, w, h, radio);
      ctxCollage.stroke();
      ctxCollage.filter = collageFiltro.value;
    }
  });

  ctxCollage.filter = "none";

  if (textoPie) {
    ctxCollage.fillStyle = collageColorMarco.value === "#FFFFFF" ? "#0B0F19" : "#FFFFFF";
    ctxCollage.font = "900 64px system-ui, sans-serif";
    ctxCollage.textAlign = "center";
    ctxCollage.fillText(textoPie, ancho / 2, alto - 55);
  }
}

btnDescargarCollage.addEventListener("click", () => {
  dibujarCollage(false);
  const link = document.createElement("a");
  link.download = `LiveStudio-Collage-${selectLayoutCollage.value}.png`;
  link.href = canvasCollage.toDataURL("image/png", 1.0);
  link.click();
  dibujarCollage(true);
});

btnDescargarCollagePdf.addEventListener("click", () => {
  dibujarCollage(false);
  const orient = selectRatioCollage.value === "a4Horizontal" ? "landscape" : "portrait";
  exportarCanvasAPDF(canvasCollage, `LiveStudio-Collage-${selectLayoutCollage.value}.pdf`, orient);
  dibujarCollage(true);
});
window.addEventListener("DOMContentLoaded", async () => {
  const dispGuardado = obtenerPreferencia("dispositivo_seleccionado", "iphone16Pro");
  if (dispositivos[dispGuardado]) selectDispositivo.value = dispGuardado;

  const eventosGuardados12 = obtenerPreferencia("eventos_12_meses", null);
  if (Array.isArray(eventosGuardados12)) {
    eventosGuardados12.forEach((evs, idx) => {
      if (datosMesesCal.at(idx) && Array.isArray(evs)) datosMesesCal.at(idx).eventos = evs;
    });
  }
  renderizarChipsEventos();
  actualizarSelectoresPoca();
  actualizarSelectoresCollage();

  const fotoAdaptador = await obtenerImagenLocal("ultima_foto_adaptador");
  if (fotoAdaptador) {
    cargarImagenEnVariable(fotoAdaptador, (img) => { imagenActual = img; dibujarEnCanvas(); });
  } else {
    dibujarEnCanvas();
  }

  const fotosPocaGuardadas = await obtenerImagenLocal("ultimas_fotos_poca");
  if (fotosPocaGuardadas && fotosPocaGuardadas.length > 0) {
    archivosPocaGuardados = fotosPocaGuardadas;
    cargarListaImagenesPoca(archivosPocaGuardados);
  } else {
    dibujarHojaPoca(true);
  }

  for (let m = 0; m < 12; m++) {
    const fotoMes = await obtenerImagenLocal(`foto_cal_mes_${m}`);
    if (fotoMes) {
      cargarImagenEnVariable(fotoMes, (img) => {
        datosMesesCal.at(m).img = img;
        if (m === obtenerMesActivo()) dibujarCalendario();
      });
    }
  }
  dibujarCalendario();

  const fotosCollageGuardadas = await obtenerImagenLocal("ultimas_fotos_collage");
  if (fotosCollageGuardadas && fotosCollageGuardadas.length > 0) {
    archivosCollageGuardados = fotosCollageGuardadas;
    cargarListaImagenesCollage(archivosCollageGuardados);
  } else {
    dibujarCollage(true);
  }
});

let eventoInstalacionDiferido = null;
const btnInstalarPwa = document.getElementById("btn-instalar-pwa");
const modalIos = document.getElementById("modal-ios");
const btnCerrarIos = document.getElementById("btn-cerrar-ios");

const esIphone = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const yaInstalada = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

if (esIphone && !yaInstalada && btnInstalarPwa) {
  btnInstalarPwa.hidden = false;
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacionDiferido = e;
  if (btnInstalarPwa) btnInstalarPwa.hidden = false;
});

if (btnInstalarPwa) {
  btnInstalarPwa.addEventListener("click", async () => {
    if (esIphone) {
      if (modalIos) modalIos.hidden = false;
      return;
    }
    if (!eventoInstalacionDiferido) return;
    eventoInstalacionDiferido.prompt();
    const resultado = await eventoInstalacionDiferido.userChoice;
    if (resultado.outcome === "accepted") btnInstalarPwa.hidden = true;
    eventoInstalacionDiferido = null;
  });
}

if (btnCerrarIos && modalIos) {
  btnCerrarIos.addEventListener("click", () => {
    modalIos.hidden = true;
  });
}

window.addEventListener("appinstalled", () => {
  if (btnInstalarPwa) btnInstalarPwa.hidden = true;
});

const badgeOffline = document.getElementById("badge-offline");
function actualizarEstadoConexion() {
  if (!badgeOffline) return;
  badgeOffline.hidden = navigator.onLine;
}
window.addEventListener("online", actualizarEstadoConexion);
window.addEventListener("offline", actualizarEstadoConexion);
actualizarEstadoConexion();
