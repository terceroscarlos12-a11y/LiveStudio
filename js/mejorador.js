const inputFotoMejora = document.getElementById("input-foto-mejora");
const badgeGpu = document.getElementById("badge-gpu");
const btnNivelPrincipiante = document.getElementById("btn-nivel-principiante");
const btnNivelAvanzado = document.getElementById("btn-nivel-avanzado");
const selectOrientacionMejora = document.getElementById("select-orientacion-mejora");
const selectModoExtension = document.getElementById("select-modo-extension");
const btnReconstruirEntorno = document.getElementById("btn-reconstruir-entorno");
const btnPincelSeleccionar = document.getElementById("btn-pincel-seleccionar");
const btnBorradorMagico = document.getElementById("btn-borrador-magico");
const btnPincelClonar = document.getElementById("btn-pincel-clonar");
const rangoTamanoPincel = document.getElementById("rango-tamano-pincel");
const btnAplicarPincel = document.getElementById("btn-aplicar-pincel");
const btnModoCrop = document.getElementById("btn-modo-crop");
const btnLimpiarTrazos = document.getElementById("btn-limpiar-trazos");
const selectFondoAislado = document.getElementById("select-fondo-aislado");
const btnReconstructorHd = document.getElementById("btn-reconstructor-hd");
const btnRetratoNatural = document.getElementById("btn-retrato-natural");
const btnModoEstudio = document.getElementById("btn-modo-estudio");
const btnAutoLuz = document.getElementById("btn-auto-luz");
const btnAutoNitidez = document.getElementById("btn-auto-nitidez");
const btnRestaurarMejora = document.getElementById("btn-restaurar-mejora");

const mejoraReconstruccion = document.getElementById("mejora-reconstruccion");
const mejoraNitidez = document.getElementById("mejora-nitidez");
const mejoraClaridad = document.getElementById("mejora-claridad");
const mejoraPiel = document.getElementById("mejora-piel");
const mejoraRuido = document.getElementById("mejora-ruido");
const mejoraAberracion = document.getElementById("mejora-aberracion");
const mejoraGrano = document.getElementById("mejora-grano");
const mejoraSombras = document.getElementById("mejora-sombras");
const mejoraLuces = document.getElementById("mejora-luces");
const mejoraDehaze = document.getElementById("mejora-dehaze");
const mejoraBrillo = document.getElementById("mejora-brillo");
const mejoraContraste = document.getElementById("mejora-contraste");
const mejoraSaturacion = document.getElementById("mejora-saturacion");
const mejoraTemperatura = document.getElementById("mejora-temperatura");
const selectEscalaMejora = document.getElementById("select-escala-mejora");
const selectVistaMejora = document.getElementById("select-vista-mejora");
const checkLupaMejora = document.getElementById("check-lupa-mejora");
const btnEnviarAdaptador = document.getElementById("btn-enviar-adaptador");
const btnEnviarCollage = document.getElementById("btn-enviar-collage");
const btnEnviarPoca = document.getElementById("btn-enviar-poca");
const btnEnviarCal = document.getElementById("btn-enviar-cal");
const btnDescargarMejora = document.getElementById("btn-descargar-mejora");
const canvasMejora = document.getElementById("canvas-mejorador");
const ctxMejora = canvasMejora ? canvasMejora.getContext("2d", { willReadFrequently: true }) : null;

let imagenBaseInmutable = null;
let canvasImagenLimpiaInpaint = null;
let cacheFondoReconstruido = null;
let canvasOriginalComparativa = null;
let canvasResultadoFinal = null;
let posicionCortina = 0.5;
let arrastrandoCortina = false;
let puntoLupa = null;
let tiempoUltimoProcesoMs = 0;

let presetsActivos = new Set();
let cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 };
let modoCropActivo = false;
let inicioArrastreCrop = null;

let modoPincel = null;
let pintandoConPincel = false;
let canvasMascaraTrazos = null;
let origenClon = null;
let offsetClon = null;
function detectarPerfilHardware() {
  let gpu = "WebGL2", esGpuPotente = false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (gl) {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const raw = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "";
        esGpuPotente = /nvidia|rtx|gtx|radeon|rx\s*\d|apple m|intel.*iris|arc/i.test(raw);
        gpu = raw.replace(/ANGLE \(|, Direct3D.*|\)/g, "").trim();
      }
    }
  } catch (e) {}
  const cores = navigator.hardwareConcurrency || 4;
  const esMovil = !esGpuPotente && (/iphone|ipad|android|mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024));
  const nombre = esMovil ? (cores >= 6 ? "iPhone Pro / Gama Alta" : "Móvil Estándar") : (esGpuPotente || cores >= 8 ? "PC Estudio" : "PC Estándar");
  return { nombre, gpu: gpu.slice(0, 32), maxPreviewPx: esMovil ? 900 : 1800 };
}

const perfilHardware = detectarPerfilHardware();
if (badgeGpu) badgeGpu.textContent = `⚡ ${perfilHardware.nombre} • ${perfilHardware.gpu}`;
const motorWebGL = (() => {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2", { preserveDrawingBuffer: true, premultipliedAlpha: false });
  if (!gl) return null;

  const vs = `#version 300 es
  in vec2 a_pos; out vec2 v_uv;
  void main(){ v_uv = a_pos * 0.5 + 0.5; v_uv.y = 1.0 - v_uv.y; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  const fs = `#version 300 es
  precision highp float;
  uniform sampler2D u_tex; uniform vec2 u_px;
  uniform float u_lumaSharp, u_microTex, u_clahe, u_piel, u_ruido, u_ca;
  uniform float u_sombras, u_luces, u_dehaze, u_brillo, u_contraste, u_sat, u_temp, u_grano;
  in vec2 v_uv; out vec4 fragColor;

  float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
  vec3 rgb2ycbcr(vec3 c){ float y = luma(c); return vec3(y, (c.b - y) * 0.565, (c.r - y) * 0.713); }
  vec3 ycbcr2rgb(vec3 ycc){ return vec3(ycc.x + 1.403 * ycc.z, ycc.x - 0.344 * ycc.y - 0.714 * ycc.z, ycc.x + 1.770 * ycc.y); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main(){
    vec4 orig = texture(u_tex, v_uv);
    vec3 col = orig.rgb;
    if (u_ca > 0.01) {
      vec2 dir = (v_uv - 0.5) * u_ca * 0.004;
      col.r = texture(u_tex, v_uv + dir).r;
      col.b = texture(u_tex, v_uv - dir).b;
    }
    vec3 n1 = texture(u_tex, v_uv + vec2(-u_px.x, 0.0)).rgb;
    vec3 n2 = texture(u_tex, v_uv + vec2( u_px.x, 0.0)).rgb;
    vec3 n3 = texture(u_tex, v_uv + vec2(0.0, -u_px.y)).rgb;
    vec3 n4 = texture(u_tex, v_uv + vec2(0.0,  u_px.y)).rgb;
    vec3 blur1 = (col * 2.0 + n1 + n2 + n3 + n4) / 6.0;

    vec3 d1 = texture(u_tex, v_uv + vec2(-u_px.x * 2.5, -u_px.y * 2.5)).rgb;
    vec3 d2 = texture(u_tex, v_uv + vec2( u_px.x * 2.5, -u_px.y * 2.5)).rgb;
    vec3 d3 = texture(u_tex, v_uv + vec2(-u_px.x * 2.5,  u_px.y * 2.5)).rgb;
    vec3 d4 = texture(u_tex, v_uv + vec2( u_px.x * 2.5,  u_px.y * 2.5)).rgb;
    vec3 blur2 = (blur1 + d1 + d2 + d3 + d4) / 5.0;
    float skinMask = smoothstep(0.04, 0.14, col.r - col.g) * smoothstep(0.02, 0.12, col.g - col.b);
    if (u_ruido > 0.01 || u_piel > 0.01) {
      float diff = length(col - blur2);
      float wRuido = u_ruido * (1.0 - smoothstep(0.04, 0.18, diff));
      float wPiel = u_piel * skinMask * (1.0 - smoothstep(0.03, 0.15, diff));
      col = mix(col, blur2, clamp(max(wRuido, wPiel), 0.0, 0.85));
    }

    vec3 ycc = rgb2ycbcr(col);
    float yBlur1 = luma(blur1), yBlur2 = luma(blur2);
    float detalleFino = ycc.x - yBlur1;
    float detalleMedio = yBlur1 - yBlur2;
    float proteccionPiel = 1.0 - skinMask * 0.65;

    ycc.x += detalleFino * (u_microTex * 1.45 * proteccionPiel);
    ycc.x += detalleMedio * (u_lumaSharp * 1.35 + u_clahe * 0.65);

    if (u_dehaze > 0.01) ycc.x = (ycc.x - 0.12 * u_dehaze) / max(0.35, 1.0 - 0.15 * u_dehaze);
    if (u_sombras > 0.01) ycc.x += u_sombras * 0.35 * pow(max(0.0, 1.0 - ycc.x), 2.2);
    if (u_luces > 0.01) ycc.x -= u_luces * 0.30 * pow(max(0.0, ycc.x), 2.2);

    ycc.x = clamp(ycc.x + u_brillo, 0.0, 1.0);
    ycc.x = clamp((ycc.x - 0.5) * u_contraste + 0.5, 0.0, 1.0);
    col = clamp(ycbcr2rgb(ycc), 0.0, 1.0);

    float lumFinal = luma(col);
    float satProt = 1.0 + u_sat * (1.0 - skinMask * 0.55);
    col = mix(vec3(lumFinal), col, satProt);
    col.r += u_temp * 0.14;
    col.b -= u_temp * 0.14;

    if (u_grano > 0.005) {
      float g = (hash(v_uv * 1000.0) - 0.5) * u_grano * 0.12;
      col += vec3(g);
    }
    fragColor = vec4(clamp(col, 0.0, 1.0), orig.a);
  }`;
  const compilar = (tipo, src) => {
    const sh = gl.createShader(tipo); gl.shaderSource(sh, src); gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vSh = compilar(gl.VERTEX_SHADER, vs), fSh = compilar(gl.FRAGMENT_SHADER, fs);
  if (!vSh || !fSh) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vSh); gl.attachShader(prog, fSh); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const locPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(locPos);
  gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    procesar(canvasOrigen, p) {
      c.width = canvasOrigen.width; c.height = canvasOrigen.height;
      gl.viewport(0, 0, c.width, c.height);
      gl.useProgram(prog);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvasOrigen);

      gl.uniform2f(gl.getUniformLocation(prog, "u_px"), 1 / c.width, 1 / c.height);
      gl.uniform1f(gl.getUniformLocation(prog, "u_lumaSharp"), p.reconstruccion);
      gl.uniform1f(gl.getUniformLocation(prog, "u_microTex"), p.nitidez);
      gl.uniform1f(gl.getUniformLocation(prog, "u_clahe"), p.claridad);
      gl.uniform1f(gl.getUniformLocation(prog, "u_piel"), p.piel);
      gl.uniform1f(gl.getUniformLocation(prog, "u_ruido"), p.ruido);
      gl.uniform1f(gl.getUniformLocation(prog, "u_ca"), p.aberracion);
      gl.uniform1f(gl.getUniformLocation(prog, "u_sombras"), p.sombras);
      gl.uniform1f(gl.getUniformLocation(prog, "u_luces"), p.luces);
      gl.uniform1f(gl.getUniformLocation(prog, "u_dehaze"), p.dehaze);
      gl.uniform1f(gl.getUniformLocation(prog, "u_brillo"), p.brillo / 130);
      gl.uniform1f(gl.getUniformLocation(prog, "u_contraste"), (100 + p.contraste * 1.15) / 100);
      gl.uniform1f(gl.getUniformLocation(prog, "u_sat"), p.saturacion / 100);
      gl.uniform1f(gl.getUniformLocation(prog, "u_temp"), p.temperatura / 100);
      gl.uniform1f(gl.getUniformLocation(prog, "u_grano"), p.grano);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const out = document.createElement("canvas");
      out.width = c.width; out.height = c.height;
      out.getContext("2d").drawImage(c, 0, 0);
      return out;
    }
  };
})();
function ejecutarInpaintingMagico(canvasSrc, canvasMask) {
  const w = canvasSrc.width, h = canvasSrc.height;
  const out = document.createElement("canvas"); out.width = w; out.height = h;
  const ctxO = out.getContext("2d"); ctxO.drawImage(canvasSrc, 0, 0);
  const imgData = ctxO.getImageData(0, 0, w, h);
  const mData = canvasMask.getContext("2d").getImageData(0, 0, w, h).data;
  const px = imgData.data;

  const estado = new Uint8Array(w * h);
  let pendientes = 0;
  for (let i = 0; i < w * h; i++) {
    if (mData[i * 4 + 3] > 20) { estado[i] = 1; pendientes++; }
  }
  if (pendientes === 0) return out;

  const copia = new Uint8ClampedArray(px);
  const dirs = [-1, 1, -w, w, -w - 1, -w + 1, w - 1, w + 1];
  let iter = 0;
  while (pendientes > 0 && iter < 450) {
    iter++;
    const nuevos = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (estado[idx] !== 1) continue;
        let r = 0, g = 0, b = 0, cnt = 0;
        for (let d = 0; d < 8; d++) {
          const nIdx = idx + dirs[d];
          if (estado[nIdx] === 0) { r += copia[nIdx * 4]; g += copia[nIdx * 4 + 1]; b += copia[nIdx * 4 + 2]; cnt++; }
        }
        if (cnt > 0) {
          const jitter = (Math.random() - 0.5) * 6;
          px[idx * 4] = Math.min(255, Math.max(0, r / cnt + jitter));
          px[idx * 4 + 1] = Math.min(255, Math.max(0, g / cnt + jitter));
          px[idx * 4 + 2] = Math.min(255, Math.max(0, b / cnt + jitter));
          px[idx * 4 + 3] = 255;
          nuevos.push(idx);
        }
      }
    }
    if (nuevos.length === 0) break;
    for (let k = 0; k < nuevos.length; k++) {
      const id = nuevos[k]; estado[id] = 0; pendientes--;
      copia[id * 4] = px[id * 4]; copia[id * 4 + 1] = px[id * 4 + 1]; copia[id * 4 + 2] = px[id * 4 + 2];
    }
  }
  ctxO.putImageData(imgData, 0, 0);
  return out;
}
function generarFondoReconstruido(canvasSrc, destW, destH, dx, dy, drawW, drawH, modo) {
  const c = document.createElement("canvas"); c.width = destW; c.height = destH;
  const ctx = c.getContext("2d");
  ctx.drawImage(canvasSrc, 0, 0, destW, destH);

  if (modo === "blur" || modo === "espejo") {
    ctx.save();
    ctx.filter = modo === "blur" ? "blur(32px) brightness(0.9)" : "blur(18px)";
    if (modo === "espejo") { ctx.translate(destW, 0); ctx.scale(-1, 1); }
    ctx.drawImage(canvasSrc, -40, -40, destW + 80, destH + 80);
    ctx.restore();
    ctx.drawImage(canvasSrc, dx, dy, drawW, drawH);
    return c;
  }

  const sw = canvasSrc.width, sh = canvasSrc.height;
  const margen = Math.max(6, Math.round(Math.min(sw, sh) * 0.03));
  if (dx > 0) {
    ctx.drawImage(canvasSrc, 0, 0, margen, sh, 0, dy, dx + 2, drawH);
    ctx.drawImage(canvasSrc, sw - margen, 0, margen, sh, dx + drawW - 2, dy, destW - (dx + drawW) + 2, drawH);
  }
  if (dy > 0) {
    ctx.drawImage(canvasSrc, 0, 0, sw, margen, dx, 0, drawW, dy + 2);
    ctx.drawImage(canvasSrc, 0, sh - margen, sw, margen, dx, dy + drawH - 2, drawW, destH - (dy + drawH) + 2);
  }
  ctx.save();
  ctx.filter = modo === "ia_outpaint" ? "blur(18px)" : "blur(6px)";
  ctx.drawImage(c, 0, 0);
  ctx.restore();
  ctx.drawImage(canvasSrc, dx, dy, drawW, drawH);
  return c;
}

function obtenerCanvasRecorteBase() {
  if (!imagenBaseInmutable) return null;
  if (!canvasImagenLimpiaInpaint) {
    canvasImagenLimpiaInpaint = document.createElement("canvas");
    canvasImagenLimpiaInpaint.width = imagenBaseInmutable.width;
    canvasImagenLimpiaInpaint.height = imagenBaseInmutable.height;
    canvasImagenLimpiaInpaint.getContext("2d").drawImage(imagenBaseInmutable, 0, 0);
  }
  const srcW = canvasImagenLimpiaInpaint.width, srcH = canvasImagenLimpiaInpaint.height;
  const sx = Math.round(cajaCropNorm.x * srcW), sy = Math.round(cajaCropNorm.y * srcH);
  const sw = Math.max(16, Math.round(cajaCropNorm.w * srcW)), sh = Math.max(16, Math.round(cajaCropNorm.h * srcH));
  const c = document.createElement("canvas"); c.width = sw; c.height = sh;
  c.getContext("2d").drawImage(canvasImagenLimpiaInpaint, sx, sy, sw, sh, 0, 0, sw, sh);
  return c;
}

function adaptarOrientacionSinRecorte(canvasSrc) {
  const ori = selectOrientacionMejora ? selectOrientacionMejora.value : "original";
  if (ori === "original") return canvasSrc;
  const ratios = { "16:9": 16 / 9, "4:3": 4 / 3, "9:16": 9 / 16, "1:1": 1 };
  const targetRatio = ratios[ori] || (canvasSrc.width / canvasSrc.height);
  const srcW = canvasSrc.width, srcH = canvasSrc.height, srcRatio = srcW / srcH;
  if (Math.abs(srcRatio - targetRatio) < 0.02) return canvasSrc;

  let destW = srcW, destH = srcH;
  if (targetRatio > srcRatio) destW = Math.round(srcH * targetRatio);
  else destH = Math.round(srcW / targetRatio);

  const dx = Math.round((destW - srcW) / 2), dy = Math.round((destH - srcH) / 2);
  const modo = selectModoExtension ? selectModoExtension.value : "content";
  if (!cacheFondoReconstruido || cacheFondoReconstruido.w !== destW || cacheFondoReconstruido.h !== destH || cacheFondoReconstruido.modo !== modo) {
    cacheFondoReconstruido = { w: destW, h: destH, modo, canvas: generarFondoReconstruido(canvasSrc, destW, destH, dx, dy, srcW, srcH, modo) };
  }
  return cacheFondoReconstruido.canvas;
}
function actualizarEtiquetasPorcentaje() {
  const pares = [
    ["val-reconstruccion", mejoraReconstruccion], ["val-nitidez", mejoraNitidez], ["val-claridad", mejoraClaridad],
    ["val-piel", mejoraPiel], ["val-ruido", mejoraRuido], ["val-aberracion", mejoraAberracion], ["val-grano", mejoraGrano],
    ["val-sombras", mejoraSombras], ["val-luces", mejoraLuces], ["val-dehaze", mejoraDehaze],
    ["val-brillo", mejoraBrillo], ["val-contraste", mejoraContraste], ["val-saturacion", mejoraSaturacion], ["val-temperatura", mejoraTemperatura]
  ];
  pares.forEach(([id, el]) => { const span = document.getElementById(id); if (span && el) span.textContent = `${el.value}%`; });
  const valPincel = document.getElementById("val-tamano-pincel");
  if (valPincel && rangoTamanoPincel) valPincel.textContent = `${rangoTamanoPincel.value}px`;
}

const definicionPresets = {
  reconstructor: { btn: btnReconstructorHd, vals: { reconstruccion: 65, nitidez: 42, claridad: 28, ruido: 25, aberracion: 30, grano: 10, contraste: 8, saturacion: 6 } },
  retrato: { btn: btnRetratoNatural, vals: { reconstruccion: 45, nitidez: 25, piel: 52, sombras: 22, luces: 18, contraste: 6, saturacion: 5, temperatura: 6 } },
  estudio: { btn: btnModoEstudio, vals: { reconstruccion: 72, nitidez: 48, claridad: 35, ruido: 45, dehaze: 35, sombras: 30, luces: 22, contraste: 12, saturacion: 10 } },
  luz: { btn: btnAutoLuz, vals: { sombras: 38, luces: 30, dehaze: 22, brillo: 8, contraste: 10 } },
  nitidez: { btn: btnAutoNitidez, vals: { reconstruccion: 58, nitidez: 45, claridad: 24 } }
};

function recalcularSlidersDesdePresets() {
  const todos = [mejoraReconstruccion, mejoraNitidez, mejoraClaridad, mejoraPiel, mejoraRuido, mejoraAberracion, mejoraGrano, mejoraSombras, mejoraLuces, mejoraDehaze, mejoraBrillo, mejoraContraste, mejoraSaturacion, mejoraTemperatura];
  todos.forEach((el) => { if (el) el.value = 0; });
  const mapa = { reconstruccion: mejoraReconstruccion, nitidez: mejoraNitidez, claridad: mejoraClaridad, piel: mejoraPiel, ruido: mejoraRuido, aberracion: mejoraAberracion, grano: mejoraGrano, sombras: mejoraSombras, luces: mejoraLuces, dehaze: mejoraDehaze, brillo: mejoraBrillo, contraste: mejoraContraste, saturacion: mejoraSaturacion, temperatura: mejoraTemperatura };
  presetsActivos.forEach((clave) => {
    const def = definicionPresets[clave];
    if (!def) return;
    Object.entries(def.vals).forEach(([k, v]) => {
      if (mapa[k]) mapa[k].value = Math.min(Number(mapa[k].max), Math.max(Number(mapa[k].min), Number(mapa[k].value) + v));
    });
  });
  procesarImagenMejorador(false, false);
}

Object.entries(definicionPresets).forEach(([clave, def]) => {
  if (!def.btn) return;
  def.btn.addEventListener("click", () => {
    if (presetsActivos.has(clave)) { presetsActivos.delete(clave); def.btn.classList.remove("btn-activo-swap"); }
    else { presetsActivos.add(clave); def.btn.classList.add("btn-activo-swap"); }
    recalcularSlidersDesdePresets();
  });
});
function procesarImagenMejorador(reiniciarMascara = false, forzarFullRes = false) {
  actualizarEtiquetasPorcentaje();
  if (!canvasMejora || !ctxMejora) return;
  if (!imagenBaseInmutable) {
    canvasMejora.width = 900; canvasMejora.height = 600;
    ctxMejora.fillStyle = "#0F172A"; ctxMejora.fillRect(0, 0, 900, 600);
    ctxMejora.fillStyle = "#94A3B8"; ctxMejora.font = "bold 28px system-ui, sans-serif"; ctxMejora.textAlign = "center";
    ctxMejora.fillText("Subí una imagen para restaurar y mejorar con GPU", 450, 300);
    return;
  }

  const t0 = performance.now();
  const recorte = obtenerCanvasRecorteBase();
  const baseOrientada = adaptarOrientacionSinRecorte(recorte);
  const escala = parseInt(selectEscalaMejora?.value) || 1;
  const maxLado = forzarFullRes ? 4096 : perfilHardware.maxPreviewPx;
  const factorPreview = Math.min(1, maxLado / Math.max(baseOrientada.width * escala, baseOrientada.height * escala));

  const wFinal = Math.max(1, Math.round(baseOrientada.width * escala * factorPreview));
  const hFinal = Math.max(1, Math.round(baseOrientada.height * escala * factorPreview));

  if (reiniciarMascara || !canvasMascaraTrazos || canvasMascaraTrazos.width !== recorte.width || canvasMascaraTrazos.height !== recorte.height) {
    canvasMascaraTrazos = document.createElement("canvas");
    canvasMascaraTrazos.width = recorte.width; canvasMascaraTrazos.height = recorte.height;
  }

  canvasOriginalComparativa = document.createElement("canvas");
  canvasOriginalComparativa.width = wFinal; canvasOriginalComparativa.height = hFinal;
  const ctxOrig = canvasOriginalComparativa.getContext("2d");
  ctxOrig.imageSmoothingEnabled = true; ctxOrig.imageSmoothingQuality = "high";
  ctxOrig.drawImage(baseOrientada, 0, 0, wFinal, hFinal);

  const p = {
    reconstruccion: (parseInt(mejoraReconstruccion?.value) || 0) / 100,
    nitidez: (parseInt(mejoraNitidez?.value) || 0) / 100,
    claridad: (parseInt(mejoraClaridad?.value) || 0) / 100,
    piel: (parseInt(mejoraPiel?.value) || 0) / 100,
    ruido: (parseInt(mejoraRuido?.value) || 0) / 100,
    aberracion: (parseInt(mejoraAberracion?.value) || 0) / 100,
    grano: (parseInt(mejoraGrano?.value) || 0) / 100,
    sombras: (parseInt(mejoraSombras?.value) || 0) / 100,
    luces: (parseInt(mejoraLuces?.value) || 0) / 100,
    dehaze: (parseInt(mejoraDehaze?.value) || 0) / 100,
    brillo: parseInt(mejoraBrillo?.value) || 0,
    contraste: parseInt(mejoraContraste?.value) || 0,
    saturacion: parseInt(mejoraSaturacion?.value) || 0,
    temperatura: parseInt(mejoraTemperatura?.value) || 0
  };

  canvasResultadoFinal = motorWebGL ? motorWebGL.procesar(canvasOriginalComparativa, p) : canvasOriginalComparativa;
  tiempoUltimoProcesoMs = Math.round(performance.now() - t0);
  if (badgeGpu) badgeGpu.textContent = `⚡ ${perfilHardware.nombre} • ${perfilHardware.gpu} (${tiempoUltimoProcesoMs} ms)`;
  pintarVistaComparativa();
}
function pintarVistaComparativa() {
  if (!canvasMejora || !ctxMejora || !canvasOriginalComparativa || !canvasResultadoFinal) return;
  const w = canvasResultadoFinal.width, h = canvasResultadoFinal.height;
  const modo = selectVistaMejora ? selectVistaMejora.value : "lado";

  if (modo === "lado") {
    const gap = Math.max(8, Math.round(w * 0.012));
    canvasMejora.width = w * 2 + gap; canvasMejora.height = h;
    ctxMejora.fillStyle = "#0F172A"; ctxMejora.fillRect(0, 0, canvasMejora.width, h);
    ctxMejora.drawImage(canvasOriginalComparativa, 0, 0);
    ctxMejora.drawImage(canvasResultadoFinal, w + gap, 0);
  } else if (modo === "cortina") {
    canvasMejora.width = w; canvasMejora.height = h;
    ctxMejora.drawImage(canvasResultadoFinal, 0, 0);
    const corteX = Math.round(w * posicionCortina);
    ctxMejora.save(); ctxMejora.beginPath(); ctxMejora.rect(0, 0, corteX, h); ctxMejora.clip();
    ctxMejora.drawImage(canvasOriginalComparativa, 0, 0); ctxMejora.restore();
    ctxMejora.strokeStyle = "#38BDF8"; ctxMejora.lineWidth = Math.max(4, Math.round(w * 0.004));
    ctxMejora.beginPath(); ctxMejora.moveTo(corteX, 0); ctxMejora.lineTo(corteX, h); ctxMejora.stroke();
  } else {
    canvasMejora.width = w; canvasMejora.height = h;
    ctxMejora.drawImage(canvasResultadoFinal, 0, 0);
  }

  if (canvasMascaraTrazos && (modoPincel === "seleccionar" || modoPincel === "borrar")) {
    ctxMejora.save(); ctxMejora.globalAlpha = 0.45;
    ctxMejora.drawImage(canvasMascaraTrazos, 0, 0, w, h);
    ctxMejora.restore();
  }
  if (modoPincel === "clonar" && origenClon) {
    ctxMejora.save(); ctxMejora.strokeStyle = "#38BDF8"; ctxMejora.lineWidth = 4;
    ctxMejora.beginPath(); ctxMejora.arc(origenClon.x, origenClon.y, 18, 0, Math.PI * 2); ctxMejora.stroke();
    ctxMejora.restore();
  }
  if (modoCropActivo && inicioArrastreCrop) {
    const x = Math.min(inicioArrastreCrop.x1, inicioArrastreCrop.x2), y = Math.min(inicioArrastreCrop.y1, inicioArrastreCrop.y2);
    const cw = Math.abs(inicioArrastreCrop.x2 - inicioArrastreCrop.x1), ch = Math.abs(inicioArrastreCrop.y2 - inicioArrastreCrop.y1);
    ctxMejora.save(); ctxMejora.strokeStyle = "#FACC15"; ctxMejora.lineWidth = 4; ctxMejora.setLineDash([]);
    ctxMejora.strokeRect(x, y, cw, ch); ctxMejora.restore();
  }
  if (checkLupaMejora && checkLupaMejora.checked && puntoLupa && !modoPincel && !modoCropActivo) {
    const r = Math.max(55, Math.round(Math.min(w, h) * 0.11));
    const sx = Math.max(0, Math.min(w - r / 2, puntoLupa.normX * w - r / 4));
    const sy = Math.max(0, Math.min(h - r / 2, puntoLupa.normY * h - r / 4));
    ctxMejora.save(); ctxMejora.beginPath(); ctxMejora.arc(puntoLupa.canvasX, puntoLupa.canvasY, r, 0, Math.PI * 2); ctxMejora.clip();
    ctxMejora.drawImage(canvasResultadoFinal, sx, sy, r / 2, r / 2, puntoLupa.canvasX - r, puntoLupa.canvasY - r, r * 2, r * 2);
    ctxMejora.strokeStyle = "#38BDF8"; ctxMejora.lineWidth = 5; ctxMejora.stroke();
    ctxMejora.restore();
  }
}
function activarModoHerramienta(modo) {
  if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
  modoPincel = modoPincel === modo ? null : modo;
  modoCropActivo = false; origenClon = null; offsetClon = null;
  if (btnPincelSeleccionar) btnPincelSeleccionar.classList.toggle("btn-activo-swap", modoPincel === "seleccionar");
  if (btnBorradorMagico) btnBorradorMagico.classList.toggle("btn-activo-swap", modoPincel === "borrar");
  if (btnPincelClonar) btnPincelClonar.classList.toggle("btn-activo-swap", modoPincel === "clonar");
  if (btnModoCrop) { btnModoCrop.classList.remove("btn-activo-swap"); btnModoCrop.textContent = "✂️ Recorte Manual"; }
  pintarVistaComparativa();
}

if (btnReconstruirEntorno) btnReconstruirEntorno.addEventListener("click", () => { cacheFondoReconstruido = null; procesarImagenMejorador(false, false); });
if (btnPincelSeleccionar) btnPincelSeleccionar.addEventListener("click", () => activarModoHerramienta("seleccionar"));
if (btnBorradorMagico) btnBorradorMagico.addEventListener("click", () => activarModoHerramienta("borrar"));
if (btnPincelClonar) btnPincelClonar.addEventListener("click", () => activarModoHerramienta("clonar"));
if (btnLimpiarTrazos) btnLimpiarTrazos.addEventListener("click", () => { if (canvasMascaraTrazos) canvasMascaraTrazos.getContext("2d").clearRect(0, 0, canvasMascaraTrazos.width, canvasMascaraTrazos.height); origenClon = null; offsetClon = null; pintarVistaComparativa(); });

if (btnAplicarPincel) {
  btnAplicarPincel.addEventListener("click", () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    if (modoPincel === "clonar") { modoPincel = null; origenClon = null; offsetClon = null; if (btnPincelClonar) btnPincelClonar.classList.remove("btn-activo-swap"); procesarImagenMejorador(true, false); return; }
    if (!canvasMascaraTrazos) return alert("Primero pintá con el pincel sobre la imagen.");
    const rec = obtenerCanvasRecorteBase();
    if (modoPincel === "borrar") {
      canvasImagenLimpiaInpaint = ejecutarInpaintingMagico(rec, canvasMascaraTrazos);
      cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 }; cacheFondoReconstruido = null;
      canvasMascaraTrazos.getContext("2d").clearRect(0, 0, canvasMascaraTrazos.width, canvasMascaraTrazos.height);
      modoPincel = null; if (btnBorradorMagico) btnBorradorMagico.classList.remove("btn-activo-swap");
      procesarImagenMejorador(true, false);
    }
  });
}

if (btnModoCrop) {
  btnModoCrop.addEventListener("click", () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    modoCropActivo = !modoCropActivo; modoPincel = null;
    btnModoCrop.classList.toggle("btn-activo-swap", modoCropActivo);
    btnModoCrop.textContent = modoCropActivo ? "✂️ Arrastrá el cuadro..." : "✂️ Recorte Manual";
    pintarVistaComparativa();
  });
}
function trazarEnMascara(cx, cy) {
  if (!canvasMascaraTrazos || !canvasMejora) return;
  const ctxM = canvasMascaraTrazos.getContext("2d");
  const mx = (cx / canvasMejora.width) * canvasMascaraTrazos.width;
  const my = (cy / canvasMejora.height) * canvasMascaraTrazos.height;
  const radio = ((parseInt(rangoTamanoPincel?.value) || 35) / 2) * (canvasMascaraTrazos.width / 800);
  ctxM.fillStyle = modoPincel === "borrar" ? "#FF4D6D" : "#00F5D4";
  ctxM.beginPath(); ctxM.arc(mx, my, radio, 0, Math.PI * 2); ctxM.fill();
}

function clonarEnCanvas(cx, cy) {
  if (!canvasImagenLimpiaInpaint || !origenClon || !offsetClon || !canvasMejora) return;
  const ctxC = canvasImagenLimpiaInpaint.getContext("2d");
  const destX = (cx / canvasMejora.width) * canvasImagenLimpiaInpaint.width;
  const destY = (cy / canvasMejora.height) * canvasImagenLimpiaInpaint.height;
  const srcX = destX + offsetClon.dx, srcY = destY + offsetClon.dy;
  const radio = ((parseInt(rangoTamanoPincel?.value) || 35) / 2) * (canvasImagenLimpiaInpaint.width / 800);
  ctxC.save(); ctxC.beginPath(); ctxC.arc(destX, destY, radio, 0, Math.PI * 2); ctxC.clip();
  ctxC.drawImage(canvasImagenLimpiaInpaint, srcX - radio, srcY - radio, radio * 2, radio * 2, destX - radio, destY - radio, radio * 2, radio * 2);
  ctxC.restore();
}

if (canvasMejora) {
  canvasMejora.addEventListener("pointerdown", (e) => {
    if (!imagenBaseInmutable || !canvasResultadoFinal) return;
    const rect = canvasMejora.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvasMejora.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvasMejora.height / rect.height);
    if (modoPincel === "clonar") {
      if (!origenClon) { origenClon = { x: cx, y: cy }; pintarVistaComparativa(); return; }
      const destX = (cx / canvasMejora.width) * canvasImagenLimpiaInpaint.width;
      const destY = (cy / canvasMejora.height) * canvasImagenLimpiaInpaint.height;
      if (!offsetClon) offsetClon = { dx: ((origenClon.x / canvasMejora.width) * canvasImagenLimpiaInpaint.width) - destX, dy: ((origenClon.y / canvasMejora.height) * canvasImagenLimpiaInpaint.height) - destY };
      pintandoConPincel = true; clonarEnCanvas(cx, cy); pintarVistaComparativa(); return;
    }
    if (modoPincel) { pintandoConPincel = true; trazarEnMascara(cx, cy); pintarVistaComparativa(); return; }
    if (modoCropActivo) inicioArrastreCrop = { x1: cx, y1: cy, x2: cx, y2: cy };
    else { arrastrandoCortina = true; posicionCortina = Math.min(0.98, Math.max(0.02, cx / canvasMejora.width)); pintarVistaComparativa(); }
  });

  canvasMejora.addEventListener("pointermove", (e) => {
    if (!imagenBaseInmutable || !canvasResultadoFinal) return;
    const rect = canvasMejora.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvasMejora.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvasMejora.height / rect.height);
    puntoLupa = { canvasX: cx, canvasY: cy, normX: cx / canvasMejora.width, normY: cy / canvasMejora.height };
    if (modoPincel === "clonar") { if (pintandoConPincel) clonarEnCanvas(cx, cy); pintarVistaComparativa(); return; }
    if (modoPincel) { if (pintandoConPincel) trazarEnMascara(cx, cy); pintarVistaComparativa(); return; }
    if (modoCropActivo) { if (inicioArrastreCrop) { inicioArrastreCrop.x2 = cx; inicioArrastreCrop.y2 = cy; } pintarVistaComparativa(); return; }
    const modo = selectVistaMejora ? selectVistaMejora.value : "lado";
    if (arrastrandoCortina && modo === "cortina") posicionCortina = Math.min(0.98, Math.max(0.02, cx / canvasMejora.width));
    let normX = cx / canvasResultadoFinal.width;
    if (modo === "lado" && cx > canvasResultadoFinal.width) normX = (cx - (canvasMejora.width - canvasResultadoFinal.width)) / canvasResultadoFinal.width;
    puntoLupa.normX = Math.min(1, Math.max(0, normX)); pintarVistaComparativa();
  });

  canvasMejora.addEventListener("pointerup", () => {
    pintandoConPincel = false;
    if (modoCropActivo && inicioArrastreCrop) {
      const w = canvasMejora.width, h = canvasMejora.height;
      const xMin = Math.max(0, Math.min(inicioArrastreCrop.x1, inicioArrastreCrop.x2)), xMax = Math.min(w, Math.max(inicioArrastreCrop.x1, inicioArrastreCrop.x2));
      const yMin = Math.max(0, Math.min(inicioArrastreCrop.y1, inicioArrastreCrop.y2)), yMax = Math.min(h, Math.max(inicioArrastreCrop.y1, inicioArrastreCrop.y2));
      if (xMax - xMin > 25 && yMax - yMin > 25) {
        cajaCropNorm = { x: cajaCropNorm.x + (xMin / w) * cajaCropNorm.w, y: cajaCropNorm.y + (yMin / h) * cajaCropNorm.h, w: ((xMax - xMin) / w) * cajaCropNorm.w, h: ((yMax - yMin) / h) * cajaCropNorm.h };
        cacheFondoReconstruido = null;
      }
      inicioArrastreCrop = null; modoCropActivo = false;
      if (btnModoCrop) { btnModoCrop.classList.remove("btn-activo-swap"); btnModoCrop.textContent = "✂️ Recorte Manual"; }
      procesarImagenMejorador(true, false);
    }
    arrastrandoCortina = false;
  });

  canvasMejora.addEventListener("pointerleave", () => { pintandoConPincel = false; puntoLupa = null; pintarVistaComparativa(); });
}
if (rangoTamanoPincel) rangoTamanoPincel.addEventListener("input", () => { actualizarEtiquetasPorcentaje(); pintarVistaComparativa(); });

if (btnRestaurarMejora) {
  btnRestaurarMejora.addEventListener("click", () => {
    presetsActivos.clear(); cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 };
    modoPincel = null; modoCropActivo = false; canvasImagenLimpiaInpaint = null; cacheFondoReconstruido = null; origenClon = null; offsetClon = null;
    if (selectOrientacionMejora) selectOrientacionMejora.value = "original";
    selectEscalaMejora.value = "1";
    [mejoraReconstruccion, mejoraNitidez, mejoraClaridad, mejoraPiel, mejoraRuido, mejoraAberracion, mejoraGrano, mejoraSombras, mejoraLuces, mejoraDehaze, mejoraBrillo, mejoraContraste, mejoraSaturacion, mejoraTemperatura].forEach((el) => { if (el) el.value = 0; });
    Object.values(definicionPresets).forEach((d) => { if (d.btn) d.btn.classList.remove("btn-activo-swap"); });
    procesarImagenMejorador(false, false);
  });
}

if (inputFotoMejora) {
  inputFotoMejora.addEventListener("change", (e) => {
    const archivo = e.target.files.item(0);
    if (!archivo) return; e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => { imagenBaseInmutable = img; cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 }; puntoLupa = null; canvasImagenLimpiaInpaint = null; cacheFondoReconstruido = null; origenClon = null; offsetClon = null; procesarImagenMejorador(true, false); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(archivo);
  });
}
[mejoraReconstruccion, mejoraNitidez, mejoraClaridad, mejoraPiel, mejoraRuido, mejoraAberracion, mejoraGrano, mejoraSombras, mejoraLuces, mejoraDehaze, mejoraBrillo, mejoraContraste, mejoraSaturacion, mejoraTemperatura, selectEscalaMejora].forEach((ctrl) => { if (ctrl) ctrl.addEventListener("input", () => procesarImagenMejorador(false, false)); });
[selectOrientacionMejora, selectModoExtension].forEach((sel) => { if (sel) sel.addEventListener("change", () => procesarImagenMejorador(false, false)); });
if (selectVistaMejora) selectVistaMejora.addEventListener("change", () => pintarVistaComparativa());
if (checkLupaMejora) checkLupaMejora.addEventListener("change", () => pintarVistaComparativa());

function enviarResultadoAInput(idInputDestino, targetTab) {
  if (!imagenBaseInmutable) return alert("Primero procesá una imagen.");
  const inputDestino = document.getElementById(idInputDestino);
  if (!inputDestino) return;
  procesarImagenMejorador(false, true);
  canvasResultadoFinal.toBlob((blob) => {
    procesarImagenMejorador(false, false);
    if (!blob) return;
    const archivo = new File([blob], "LiveStudio-Mejorada.png", { type: "image/png" });
    const dt = new DataTransfer(); dt.items.add(archivo);
    inputDestino.files = dt.files; inputDestino.dispatchEvent(new Event("change", { bubbles: true }));
    document.querySelector(`.tab-btn[data-target="${targetTab}"]`)?.click();
  }, "image/png");
}

if (btnEnviarAdaptador) btnEnviarAdaptador.addEventListener("click", () => enviarResultadoAInput("input-imagen", "sec-adaptador"));
if (btnEnviarCollage) btnEnviarCollage.addEventListener("click", () => enviarResultadoAInput("input-foto-collage", "sec-collage"));
if (btnEnviarPoca) btnEnviarPoca.addEventListener("click", () => enviarResultadoAInput("input-foto-poca", "sec-photocards"));
if (btnEnviarCal) btnEnviarCal.addEventListener("click", () => enviarResultadoAInput("input-foto-cal", "sec-calendario"));
if (btnDescargarMejora) {
  btnDescargarMejora.addEventListener("click", () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    procesarImagenMejorador(false, true);
    const link = document.createElement("a");
    link.download = `LiveStudio-Estudio-${selectEscalaMejora.value}x.png`;
    link.href = canvasResultadoFinal.toDataURL("image/png", 1.0);
    link.click();
    procesarImagenMejorador(false, false);
  });
}

function cambiarNivelMejorador(esAvanzado) {
  document.querySelectorAll("#sec-mejorador .solo-avanzado").forEach((el) => { el.hidden = !esAvanzado; });
  if (btnNivelPrincipiante) btnNivelPrincipiante.className = esAvanzado ? "btn-secundario" : "btn-primario";
  if (btnNivelAvanzado) btnNivelAvanzado.className = esAvanzado ? "btn-primario" : "btn-secundario";
}

if (btnNivelPrincipiante) btnNivelPrincipiante.addEventListener("click", () => cambiarNivelMejorador(false));
if (btnNivelAvanzado) btnNivelAvanzado.addEventListener("click", () => cambiarNivelMejorador(true));
const badgeIaLocal = document.getElementById("badge-ia-local");
const textoDiagnosticoIa = document.getElementById("texto-diagnostico-ia");
const btnAutoIaMejorador = document.getElementById("btn-auto-ia-mejorador");
const btnCopiarPromptIa = document.getElementById("btn-copiar-prompt-ia");
const inputApiKeyGemini = document.getElementById("input-api-key-gemini");
const btnGuardarKeyGemini = document.getElementById("btn-guardar-key-gemini");

(async function verificarChromeAi() {
  try {
    const api = window.LanguageModel || (window.ai && window.ai.languageModel);
    if (api && typeof api.availability === "function") {
      const estado = await api.availability();
      if (estado === "available" || estado === "readily") {
        if (badgeIaLocal) badgeIaLocal.textContent = "🧠 Chrome Built-in AI (Gemini Nano) detectado en PC";
      }
    }
  } catch (e) {}
  const keyGuardada = localStorage.getItem("livestudio_gemini_key");
  if (keyGuardada && inputApiKeyGemini) inputApiKeyGemini.value = keyGuardada;
})();
if (btnGuardarKeyGemini && inputApiKeyGemini) {
  btnGuardarKeyGemini.addEventListener("click", () => {
    const val = inputApiKeyGemini.value.trim();
    if (!val) {
      localStorage.removeItem("livestudio_gemini_key");
      return alert("Clave eliminada. El Mejorador seguirá usando el motor GPU local.");
    }
    localStorage.setItem("livestudio_gemini_key", val);
    alert("✅ API Key guardada localmente en tu dispositivo.");
  });
}

function generarMiniaturaBase64(maxLado = 512) {
  const c = document.createElement("canvas");
  const escala = Math.min(1, maxLado / Math.max(imagenBaseInmutable.width, imagenBaseInmutable.height));
  c.width = Math.max(1, Math.round(imagenBaseInmutable.width * escala));
  c.height = Math.max(1, Math.round(imagenBaseInmutable.height * escala));
  c.getContext("2d").drawImage(imagenBaseInmutable, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7).replace(/^data:image\/jpeg;base64,/, "");
}
function aplicarConfiguracionIa(cfg) {
  if (!cfg) return;
  if (textoDiagnosticoIa && cfg.diagnostico) {
    textoDiagnosticoIa.style.display = "block";
    textoDiagnosticoIa.textContent = `🤖 IA: ${cfg.diagnostico}`;
  }
  presetsActivos.clear();
  Object.values(definicionPresets).forEach((d) => { if (d.btn) d.btn.classList.remove("btn-activo-swap"); });

  if (Array.isArray(cfg.presets)) {
    const mapaNombres = { "Reconstructor Sub-Píxel HD": "reconstructor", "Retrato Natural": "retrato", "Salvar Difícil": "estudio", "Rescate HDR": "luz", "Luma Sharpen": "nitidez" };
    cfg.presets.forEach((nombre) => {
      const clave = Object.keys(mapaNombres).find((k) => nombre.toLowerCase().includes(k.toLowerCase()));
      if (clave && definicionPresets[mapaNombres[clave]]) {
        presetsActivos.add(mapaNombres[clave]);
        definicionPresets[mapaNombres[clave]].btn?.classList.add("btn-activo-swap");
      }
    });
  }

  const mapaSliders = { reconstruccion: mejoraReconstruccion, nitidez: mejoraNitidez, claridad: mejoraClaridad, piel: mejoraPiel, ruido: mejoraRuido, sombras: mejoraSombras, luces: mejoraLuces, dehaze: mejoraDehaze, brillo: mejoraBrillo, contraste: mejoraContraste, saturacion: mejoraSaturacion, temperatura: mejoraTemperatura };
  Object.entries(mapaSliders).forEach(([k, el]) => {
    if (el && typeof cfg[k] === "number") el.value = Math.max(Number(el.min), Math.min(Number(el.max), Math.round(cfg[k])));
  });
  procesarImagenMejorador(false, false);
}
if (btnAutoIaMejorador) {
  btnAutoIaMejorador.addEventListener("click", async () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen en el Mejorador.");
    const apiKey = (inputApiKeyGemini?.value || localStorage.getItem("livestudio_gemini_key") || "").trim();
    if (!apiKey) return alert("Pegá tu API Key gratuita de Google AI Studio (AQ... o AIzaSy...) o usá el botón 'Copiar Foto + Prompt para Gemini'.");

    const textoOrig = btnAutoIaMejorador.textContent;
    btnAutoIaMejorador.disabled = true;
    btnAutoIaMejorador.textContent = "⏳ Analizando iluminación y ruido...";

    try {
      const base64Img = generarMiniaturaBase64(512);
      const promptSistema = `Analizá esta foto (iluminación, ruido, nitidez y rostros) y devolvé SOLO un objeto JSON válido con: "diagnostico" (1 oración corta en español), "presets" (array de strings elegidos entre: "Reconstructor Sub-Píxel HD", "Retrato Natural", "Salvar Difícil", "Rescate HDR", "Luma Sharpen"), y valores numéricos enteros recomendados para: "reconstruccion" (0-100), "nitidez" (0-100), "claridad" (0-100), "piel" (0-100), "ruido" (0-100), "sombras" (0-100), "luces" (0-100), "dehaze" (0-100), "brillo" (-50 a 50), "contraste" (-50 a 50), "saturacion" (-50 a 50), "temperatura" (-50 a 50).`;
      const urlApi = "https://googleapis.com" + encodeURIComponent(apiKey);
      const resp = await fetch(urlApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptSistema }, { inline_data: { mime_type: "image/jpeg", data: base64Img } }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error?.message || "Error al conectar con Google AI Studio.");
      const primerCandidato = Array.isArray(data?.candidates) ? data.candidates.at(0) : null;
      const primeraParte = Array.isArray(primerCandidato?.content?.parts) ? primerCandidato.content.parts.at(0) : null;
      const jsonTexto = primeraParte?.text;
      if (!jsonTexto) throw new Error("La IA no devolvió parámetros.");
      aplicarConfiguracionIa(JSON.parse(jsonTexto));
    } catch (err) {
      alert(`No se pudo completar el análisis IA: ${err.message}`);
    } finally {
      btnAutoIaMejorador.disabled = false;
      btnAutoIaMejorador.textContent = textoOrig;
    }
  });
}
if (btnCopiarPromptIa) {
  btnCopiarPromptIa.addEventListener("click", async () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    const promptManual = "Actuá como editor fotográfico profesional. Analizá la iluminación, ruido y nitidez de esta foto e indicame qué valores (de 0 a 100) recomiendás para: Nitidez, Claridad, Suavizado de piel, Reducción de ruido, Sombras, Luces, Brillo, Contraste y Saturación.";
    try {
      await navigator.clipboard.writeText(promptManual);
      alert("📋 Prompt fotográfico copiado al portapapeles. Se abrirá Gemini para que pegues tu foto y el prompt.");
    } catch (e) {}
    window.open("https://google.com", "_blank");
  });
}

window.addEventListener("DOMContentLoaded", () => procesarImagenMejorador(false, false));
