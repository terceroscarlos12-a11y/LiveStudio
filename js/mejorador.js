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
const btnLimpiarTrazos = document.getElementById("btn-limpiar-trazos");
const btnModoCrop = document.getElementById("btn-modo-crop");
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
const ctxMejora = canvasMejora ? canvasMejora.getContext("2d") : null;

let imagenBaseInmutable = null;
let imagenRecortadaActual = null;
let imagenRecorteSinFondo = null;
let canvasResultadoFinal = null;

let modoPincel = null;
let pintandoConPincel = false;
let canvasMascaraTrazos = null;
let canvasImagenLimpiaInpaint = null;
let origenClon = null;
let offsetClon = null;
let modoCropActivo = false;
let cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 };
let inicioArrastreCrop = null;
let cacheFondoReconstruido = null;
let claveCacheEntorno = "";

let posicionCortina = 0.5;
let arrastrandoCortina = false;
let puntoLupa = null;
let nombreHardwareGpu = "CPU";
let presetsActivos = new Set();
let animacionCinebenchId = null;
const canvasGpu = document.createElement("canvas");
const gl = canvasGpu.getContext("webgl", { preserveDrawingBuffer: true, premultipliedAlpha: false })
  || canvasGpu.getContext("experimental-webgl", { preserveDrawingBuffer: true, premultipliedAlpha: false });
let progLanczos = null;
let progColorHsl = null;
let progDetalleFrec = null;

function detectarPerfilHardware() {
  const ua = navigator.userAgent || "";
  const esIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const esAndroid = /android/i.test(ua);
  const esMovil = esIOS || esAndroid;
  const nucleos = navigator.hardwareConcurrency || 4;
  const ramGb = navigator.deviceMemory || (esIOS ? 4 : (esAndroid ? 4 : 8));

  let maxTexGpu = 4096;
  let gpuNombre = "CPU";
  if (gl) {
    maxTexGpu = Math.min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096);
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const rawGpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "WebGL GPU";
    gpuNombre = rawGpu.replace(/ANGLE \(|, Direct3D.*|vs_.*|\)/g, "").trim();
  }

  if (esMovil && (ramGb <= 4 || nucleos <= 4)) {
    return { etiqueta: esIOS ? "iPhone" : "Android", gpuNombre, maxPreview: 960, maxExport: Math.min(maxTexGpu, 2560), maxBlur: 24 };
  }
  if (esMovil) {
    return { etiqueta: esIOS ? "iPhone Pro" : "Android Pro", gpuNombre, maxPreview: 1280, maxExport: Math.min(maxTexGpu, 4096), maxBlur: 32 };
  }
  return { etiqueta: "PC Estudio", gpuNombre, maxPreview: 1600, maxExport: Math.min(maxTexGpu, 6144), maxBlur: 48 };
}

const perfilDispositivo = detectarPerfilHardware();
nombreHardwareGpu = `${perfilDispositivo.etiqueta} • ${perfilDispositivo.gpuNombre}`;
if (badgeGpu) badgeGpu.textContent = gl ? `⚡ ${nombreHardwareGpu}` : `⚙️ ${perfilDispositivo.etiqueta} (CPU)`;
function actualizarEtiquetasPorcentaje() {
  const pares = [
    [mejoraReconstruccion, "val-reconstruccion", false], [mejoraNitidez, "val-nitidez", false],
    [mejoraClaridad, "val-claridad", false], [mejoraPiel, "val-piel", false],
    [mejoraRuido, "val-ruido", false], [mejoraAberracion, "val-aberracion", false],
    [mejoraGrano, "val-grano", false], [mejoraSombras, "val-sombras", false],
    [mejoraLuces, "val-luces", false], [mejoraDehaze, "val-dehaze", false],
    [mejoraBrillo, "val-brillo", true], [mejoraContraste, "val-contraste", true],
    [mejoraSaturacion, "val-saturacion", true], [mejoraTemperatura, "val-temperatura", true]
  ];
  pares.forEach(([inputEl, spanId, conSigno]) => {
    const span = document.getElementById(spanId);
    if (!inputEl || !span) return;
    const v = parseInt(inputEl.value) || 0;
    span.textContent = conSigno && v > 0 ? `+${v}%` : `${v}%`;
  });
  const spanPincel = document.getElementById("val-tamano-pincel");
  if (spanPincel && rangoTamanoPincel) spanPincel.textContent = `${rangoTamanoPincel.value}px`;
}
function obtenerCanvasRecorteBase() {
  if (!imagenBaseInmutable) return null;
  const fuente = canvasImagenLimpiaInpaint || imagenBaseInmutable;
  const sx = Math.round(cajaCropNorm.x * fuente.width);
  const sy = Math.round(cajaCropNorm.y * fuente.height);
  const sw = Math.max(16, Math.round(cajaCropNorm.w * fuente.width));
  const sh = Math.max(16, Math.round(cajaCropNorm.h * fuente.height));
  const c = document.createElement("canvas");
  c.width = sw; c.height = sh;
  c.getContext("2d").drawImage(fuente, sx, sy, sw, sh, 0, 0, sw, sh);
  return c;
}

async function generarOutpaintingPixelAPixel(fuenteCanvas, dstW, dstH) {
  const srcW = fuenteCanvas.width, srcH = fuenteCanvas.height;
  const dx = Math.round((dstW - srcW) / 2), dy = Math.round((dstH - srcH) / 2);
  const out = document.createElement("canvas");
  out.width = dstW; out.height = dstH;
  const ctxO = out.getContext("2d");

  const radioBlur = Math.min(perfilDispositivo.maxBlur, Math.max(18, Math.round(Math.max(dstW, dstH) * 0.025)));
  ctxO.save();
  ctxO.filter = `blur(${radioBlur}px) brightness(96%)`;
  ctxO.drawImage(fuenteCanvas, -40, -40, dstW + 80, dstH + 80);
  ctxO.restore();
  ctxO.drawImage(fuenteCanvas, dx, dy);
  return out;
}
function adaptarOrientacionSinRecorte(fuenteCanvas) {
  const orientacion = selectOrientacionMejora ? selectOrientacionMejora.value : "original";
  if (orientacion === "original") return fuenteCanvas;

  const ratios = { "16:9": 16 / 9, "4:3": 4 / 3, "9:16": 9 / 16, "1:1": 1 };
  const targetRatio = ratios[orientacion];
  if (!targetRatio) return fuenteCanvas;

  const srcW = fuenteCanvas.width, srcH = fuenteCanvas.height;
  const srcRatio = srcW / srcH;
  if (Math.abs(srcRatio - targetRatio) < 0.02) return fuenteCanvas;

  let dstW = srcW, dstH = srcH;
  if (targetRatio > srcRatio) dstW = Math.round(srcH * targetRatio);
  else dstH = Math.round(srcW / targetRatio);

  const modo = selectModoExtension ? selectModoExtension.value : "content";
  const claveActual = `${srcW}x${srcH}_${dstW}x${dstH}_${cajaCropNorm.x.toFixed(3)}_${cajaCropNorm.w.toFixed(3)}`;
  if (modo === "ia_outpaint" && cacheFondoReconstruido && claveCacheEntorno === claveActual) {
    return cacheFondoReconstruido;
  }

  const out = document.createElement("canvas");
  out.width = dstW; out.height = dstH;
  const ctxO = out.getContext("2d");

  if (modo === "content") {
    if (dstW > srcW) {
      const coreW = Math.round(srcW * 0.72), sideSrcW = Math.floor((srcW - coreW) / 2), sideDstW = Math.floor((dstW - coreW) / 2);
      ctxO.drawImage(fuenteCanvas, 0, 0, sideSrcW, srcH, 0, 0, sideDstW, dstH);
      ctxO.drawImage(fuenteCanvas, sideSrcW, 0, coreW, srcH, sideDstW, 0, coreW, dstH);
      ctxO.drawImage(fuenteCanvas, srcW - sideSrcW, 0, sideSrcW, srcH, sideDstW + coreW, 0, dstW - sideDstW - coreW, dstH);
    } else {
      const coreH = Math.round(srcH * 0.72), topSrcH = Math.floor((srcH - coreH) / 2), topDstH = Math.floor((dstH - coreH) / 2);
      ctxO.drawImage(fuenteCanvas, 0, 0, srcW, topSrcH, 0, 0, dstW, topDstH);
      ctxO.drawImage(fuenteCanvas, 0, topSrcH, srcW, coreH, 0, topDstH, dstW, coreH);
      ctxO.drawImage(fuenteCanvas, 0, srcH - topSrcH, srcW, topSrcH, 0, topDstH + coreH, dstW, dstH - topDstH - coreH);
    }
    return out;
  }
  const dx = Math.round((dstW - srcW) / 2), dy = Math.round((dstH - srcH) / 2);
  const radioBlur = Math.min(perfilDispositivo.maxBlur, Math.max(12, Math.round(Math.max(dstW, dstH) * 0.018)));
  if (modo === "espejo") {
    ctxO.save();
    ctxO.filter = `blur(${Math.max(6, Math.round(radioBlur * 0.5))}px)`;
    if (dstW > srcW) {
      ctxO.save(); ctxO.translate(dx, 0); ctxO.scale(-1, 1);
      ctxO.drawImage(fuenteCanvas, 0, 0, srcW, srcH, 0, 0, dx + 10, dstH); ctxO.restore();
      ctxO.save(); ctxO.translate(dx + srcW + dx, 0); ctxO.scale(-1, 1);
      ctxO.drawImage(fuenteCanvas, 0, 0, srcW, srcH, 0, 0, dx + 10, dstH); ctxO.restore();
    } else {
      ctxO.save(); ctxO.translate(0, dy); ctxO.scale(1, -1);
      ctxO.drawImage(fuenteCanvas, 0, 0, srcW, srcH, 0, 0, dstW, dy + 10); ctxO.restore();
      ctxO.save(); ctxO.translate(0, dy + srcH + dy); ctxO.scale(1, -1);
      ctxO.drawImage(fuenteCanvas, 0, 0, srcW, srcH, 0, 0, dstW, dy + 10); ctxO.restore();
    }
    ctxO.restore();
  } else {
    ctxO.save();
    ctxO.filter = `blur(${radioBlur}px) brightness(86%)`;
    ctxO.drawImage(fuenteCanvas, -24, -24, dstW + 48, dstH + 48);
    ctxO.restore();
  }

  ctxO.drawImage(fuenteCanvas, dx, dy);
  return out;
}
if (btnReconstruirEntorno) {
  btnReconstruirEntorno.addEventListener("click", async () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    const orientacion = selectOrientacionMejora ? selectOrientacionMejora.value : "original";
    if (orientacion === "original") return alert("Elegí primero un formato (ej: Horizontal 16:9 o Vertical 9:16).");

    btnReconstruirEntorno.disabled = true;
    btnReconstruirEntorno.textContent = "⏳ Reconstruyendo píxel a píxel...";
    try {
      const base = obtenerCanvasRecorteBase();
      const ratios = { "16:9": 16 / 9, "4:3": 4 / 3, "9:16": 9 / 16, "1:1": 1 };
      const targetRatio = ratios[orientacion];
      let dstW = base.width, dstH = base.height;
      if (targetRatio > base.width / base.height) dstW = Math.round(base.height * targetRatio);
      else dstH = Math.round(base.width / targetRatio);

      cacheFondoReconstruido = await generarOutpaintingPixelAPixel(base, dstW, dstH);
      claveCacheEntorno = `${base.width}x${base.height}_${dstW}x${dstH}_${cajaCropNorm.x.toFixed(3)}_${cajaCropNorm.w.toFixed(3)}`;
      if (selectModoExtension) selectModoExtension.value = "ia_outpaint";
      procesarImagenMejorador(true, false);
    } catch (err) { alert("Error al reconstruir entorno: " + err.message); }
    btnReconstruirEntorno.disabled = false;
    btnReconstruirEntorno.textContent = "🪄 Reconstruir Fondo Píxel a Píxel";
  });
}
function crearProgramaShader(vsSource, fsSource) {
  const compilar = (tipo, src) => {
    const sh = gl.createShader(tipo);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compilar(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(prog);
  return prog;
}

function inicializarShadersGpu() {
  if (!gl || (progLanczos && progColorHsl && progDetalleFrec)) return;

  const vsSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;
  const fsLanczos = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform vec2 u_srcSize;
    uniform vec2 u_px;
    varying vec2 v_uv;

    float lanczosW(float x) {
      if (x == 0.0) return 1.0;
      if (abs(x) >= 3.0) return 0.0;
      float pix = 3.14159265 * x;
      return (sin(pix) / pix) * (sin(pix / 3.0) / (pix / 3.0));
    }

    void main() {
      vec2 coord = v_uv * u_srcSize - 0.5;
      vec2 baseIdx = floor(coord);
      vec2 f = coord - baseIdx;
      vec3 sum = vec3(0.0);
      float totalW = 0.0;
      float alphaCentro = texture2D(u_tex, v_uv).a;
      vec3 minCol = vec3(1.0);
      vec3 maxCol = vec3(0.0);

      for (int j = -2; j <= 3; j++) {
        float wy = lanczosW(float(j) - f.y);
        for (int i = -2; i <= 3; i++) {
          float wx = lanczosW(float(i) - f.x);
          float w = wx * wy;
          vec2 uvMuestra = (baseIdx + vec2(float(i), float(j)) + 0.5) * u_px;
          vec3 c = texture2D(u_tex, clamp(uvMuestra, 0.0, 1.0)).rgb;
          sum += c * w;
          totalW += w;
          if (i >= 0 && i <= 1 && j >= 0 && j <= 1) { minCol = min(minCol, c); maxCol = max(maxCol, c); }
        }
      }
      vec3 rec = clamp(sum / max(totalW, 0.0001), minCol - 0.03, maxCol + 0.03);
      gl_FragColor = vec4(clamp(rec, 0.0, 1.0), alphaCentro);
    }
  `;
  const fsColorHsl = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform float u_dehaze;
    uniform float u_sombras;
    uniform float u_luces;
    uniform float u_brillo;
    uniform float u_contraste;
    uniform float u_saturacion;
    uniform float u_temp;
    varying vec2 v_uv;

    vec3 rgb2hsl(vec3 c) {
      float maxC = max(c.r, max(c.g, c.b));
      float minC = min(c.r, min(c.g, c.b));
      float l = (maxC + minC) * 0.5;
      float s = 0.0, h = 0.0;
      if (maxC != minC) {
        float d = maxC - minC;
        s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC);
        if (maxC == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
        else if (maxC == c.g) h = (c.b - c.r) / d + 2.0;
        else h = (c.r - c.g) / d + 4.0;
        h *= 60.0;
      }
      return vec3(h, s, l);
    }
    float hue2rgb(float p, float q, float t) {
      if (t < 0.0) t += 1.0;
      if (t > 1.0) t -= 1.0;
      if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
      if (t < 0.5) return q;
      if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
      return p;
    }

    vec3 hsl2rgb(vec3 hsl) {
      float h = hsl.x / 360.0, s = clamp(hsl.y, 0.0, 1.0), l = clamp(hsl.z, 0.0, 1.0);
      if (s == 0.0) return vec3(l);
      float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
      float p = 2.0 * l - q;
      return vec3(hue2rgb(p, q, h + 1.0 / 3.0), hue2rgb(p, q, h), hue2rgb(p, q, h - 1.0 / 3.0));
    }
    void main() {
      vec4 base = texture2D(u_tex, v_uv);
      vec3 col = base.rgb;
      if (u_dehaze > 0.0) {
        float minC = min(col.r, min(col.g, col.b));
        col = (col - minC * u_dehaze * 0.28) / (1.0 - u_dehaze * 0.20);
      }
      vec3 hsl = rgb2hsl(clamp(col, 0.0, 1.0));
      float esPiel = (hsl.x >= 0.0 && hsl.x <= 42.0 && hsl.y > 0.12 && hsl.y < 0.78 && hsl.z > 0.20) ? 1.0 : 0.0;

      float L = hsl.z;
      if (u_sombras > 0.0 && L < 0.35) L += L * pow(1.0 - (L / 0.35), 2.0) * (u_sombras * 0.75);
      if (u_luces > 0.0 && L > 0.78) L -= (L - 0.78) * pow((L - 0.78) / 0.22, 1.8) * (u_luces * 0.65);

      L = clamp(L + u_brillo, 0.0, 1.0);
      if (u_contraste != 0.0) L = mix(L, L * L * (3.0 - 2.0 * L), u_contraste * 0.80);
      hsl.z = clamp(L, 0.0, 1.0);

      if (u_saturacion != 0.0) {
        float factorPiel = mix(1.0, 0.28, esPiel);
        float vibrancia = u_saturacion > 0.0 ? u_saturacion * (1.0 - hsl.y) * factorPiel : u_saturacion;
        hsl.y = clamp(hsl.y * (1.0 + vibrancia), 0.0, 1.0);
      }

      col = hsl2rgb(hsl);
      float factorTemp = mix(1.0, 0.30, esPiel);
      col.r += u_temp * 0.12 * factorTemp;
      col.b -= u_temp * 0.12 * factorTemp;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), base.a);
    }
  `;
  const fsDetalleFrec = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform vec2 u_px;
    uniform float u_escala;
    uniform float u_reconstruccion;
    uniform float u_nitidez;
    uniform float u_claridad;
    uniform float u_piel;
    uniform float u_ruido;
    uniform float u_aberracion;
    uniform float u_grano;
    varying vec2 v_uv;

    float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

    float detectarPiel(vec3 c) {
      float maxC = max(c.r, max(c.g, c.b));
      float minC = min(c.r, min(c.g, c.b));
      if (c.r > 0.35 && c.g > 0.18 && c.b > 0.10 && (maxC - minC) > 0.05 && c.r > c.g && c.r > c.b) {
        return clamp((c.r - c.g) * 3.5, 0.0, 1.0);
      }
      return 0.0;
    }

    float ruidoPseudoAleatorio(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }
    void main() {
      vec4 base = texture2D(u_tex, v_uv);
      vec3 col = base.rgb;

      if (u_aberracion > 0.0) {
        vec2 dirCentro = (v_uv - 0.5) * u_aberracion * 0.006;
        col.r = texture2D(u_tex, clamp(v_uv - dirCentro, 0.0, 1.0)).r;
        col.b = texture2D(u_tex, clamp(v_uv + dirCentro, 0.0, 1.0)).b;
      }

      float esPiel = detectarPiel(col);
      vec2 pasoPx = u_px * max(1.0, u_escala * 0.65);

      if (u_ruido > 0.0 || u_piel > 0.0) {
        float mezcla = max(u_ruido * 0.88, u_piel * esPiel * 0.94);
        if (mezcla > 0.0) {
          vec3 sum = col * 2.5;
          float wSum = 2.5;
          float sens = mix(17.0, 10.0, esPiel * u_piel);
          for (int dy = -2; dy <= 2; dy++) {
            for (int dx = -2; dx <= 2; dx++) {
              if (dx == 0 && dy == 0) continue;
              vec3 v = texture2D(u_tex, v_uv + vec2(float(dx), float(dy)) * pasoPx).rgb;
              float peso = exp(-float(dx * dx + dy * dy) * 0.25) * exp(-length(v - col) * sens);
              sum += v * peso;
              wSum += peso;
            }
          }
          col = mix(col, sum / wSum, mezcla);
        }
      }
      vec3 n = texture2D(u_tex, v_uv + vec2(0.0, -pasoPx.y)).rgb;
      vec3 s = texture2D(u_tex, v_uv + vec2(0.0,  pasoPx.y)).rgb;
      vec3 e = texture2D(u_tex, v_uv + vec2( pasoPx.x, 0.0)).rgb;
      vec3 w = texture2D(u_tex, v_uv + vec2(-pasoPx.x, 0.0)).rgb;

      if (u_nitidez > 0.0) col += (col - (n + s + e + w) * 0.25) * (u_nitidez * 1.45 * (1.0 - esPiel * 0.45));

      if (u_claridad > 0.0) {
        vec2 rM = pasoPx * 5.0;
        vec3 mBlur = (texture2D(u_tex, v_uv + vec2(-rM.x, -rM.y)).rgb + texture2D(u_tex, v_uv + vec2(rM.x, -rM.y)).rgb
                    + texture2D(u_tex, v_uv + vec2(-rM.x, rM.y)).rgb + texture2D(u_tex, v_uv + vec2(rM.x, rM.y)).rgb) * 0.25;
        col += vec3((luma(col) - luma(mBlur)) * (u_claridad * 0.90 * (1.0 - esPiel * 0.55)));
      }

      if (u_reconstruccion > 0.0) {
        float lBlur = (luma(n) + luma(s) + luma(e) + luma(w)) * 0.25;
        col += vec3((luma(col) - lBlur) * (u_reconstruccion * 2.1 * (1.0 - esPiel * 0.40)));
      }

      if (u_grano > 0.0) col += vec3(ruidoPseudoAleatorio(v_uv * 1000.0) * (u_grano * 0.045));
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), base.a);
    }
  `;
  progLanczos = crearProgramaShader(vsSource, fsLanczos);
  progColorHsl = crearProgramaShader(vsSource, fsColorHsl);
  progDetalleFrec = crearProgramaShader(vsSource, fsDetalleFrec);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  [progLanczos, progColorHsl, progDetalleFrec].forEach((prog) => {
    gl.useProgram(prog);
    const locPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);
  });
}
function ejecutarShaderSobreImagen(programa, fuenteCanvas, anchoSalida, altoSalida, setUniforms) {
  gl.useProgram(programa);
  canvasGpu.width = anchoSalida; canvasGpu.height = altoSalida;
  gl.viewport(0, 0, anchoSalida, altoSalida);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fuenteCanvas);

  const locPx = gl.getUniformLocation(programa, "u_px");
  if (locPx) gl.uniform2f(locPx, 1.0 / fuenteCanvas.width, 1.0 / fuenteCanvas.height);
  if (setUniforms) setUniforms(programa);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.deleteTexture(tex);

  const salida = document.createElement("canvas");
  salida.width = anchoSalida; salida.height = altoSalida;
  salida.getContext("2d").drawImage(canvasGpu, 0, 0);
  return salida;
}
function aplicarFondoAislado(canvasSujeto, fuenteOriginal) {
  const tipoFondo = selectFondoAislado ? selectFondoAislado.value : "original";
  if (tipoFondo === "original" || !imagenRecorteSinFondo) return canvasSujeto;

  const w = canvasSujeto.width, h = canvasSujeto.height;
  const compuesto = document.createElement("canvas");
  compuesto.width = w; compuesto.height = h;
  const ctxC = compuesto.getContext("2d");

  if (tipoFondo === "bokeh") {
    const radioBlur = Math.min(perfilDispositivo.maxBlur, Math.max(12, Math.round(w * 0.015)));
    ctxC.save();
    ctxC.filter = `blur(${radioBlur}px) brightness(88%)`;
    ctxC.drawImage(fuenteOriginal, -20, -20, w + 40, h + 40);
    ctxC.restore();
  } else if (tipoFondo === "photocard") {
    const grad = ctxC.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#FFE5EC");
    grad.addColorStop(1, "#E0C3FC");
    ctxC.fillStyle = grad;
    ctxC.fillRect(0, 0, w, h);
  }
  ctxC.drawImage(canvasSujeto, 0, 0);
  return compuesto;
}
function procesarImagenMejorador(animarBloques = false, modoExportacion = false) {
  actualizarEtiquetasPorcentaje();
  if (!canvasMejora || !ctxMejora) return;
  if (!imagenBaseInmutable) {
    canvasMejora.width = 1100; canvasMejora.height = 900;
    ctxMejora.fillStyle = "#1E263B";
    ctxMejora.fillRect(0, 0, canvasMejora.width, canvasMejora.height);
    ctxMejora.fillStyle = "#C6DCF3";
    ctxMejora.font = "bold 34px system-ui, sans-serif";
    ctxMejora.textAlign = "center";
    ctxMejora.fillText("Subí una foto para mejorarla con GPU", canvasMejora.width / 2, canvasMejora.height / 2);
    return;
  }

  const t0 = performance.now();
  const escala = parseInt(selectEscalaMejora.value) || 1;
  const baseOriginal = obtenerCanvasRecorteBase();
  const baseActiva = (selectFondoAislado && selectFondoAislado.value !== "original" && imagenRecorteSinFondo) ? imagenRecorteSinFondo : baseOriginal;

  const maxLado = modoExportacion ? perfilDispositivo.maxExport : perfilDispositivo.maxPreview;
  const ajuste = Math.max(baseActiva.width * escala, baseActiva.height * escala) > maxLado
    ? maxLado / Math.max(baseActiva.width * escala, baseActiva.height * escala)
    : 1;
  const wFinal = Math.max(16, Math.round(baseActiva.width * escala * ajuste));
  const hFinal = Math.max(16, Math.round(baseActiva.height * escala * ajuste));

  imagenRecortadaActual = adaptarOrientacionSinRecorte(baseOriginal);
  if (gl) {
    inicializarShadersGpu();
    let etapa1 = (wFinal !== baseActiva.width || hFinal !== baseActiva.height)
      ? ejecutarShaderSobreImagen(progLanczos, baseActiva, wFinal, hFinal, (p) => gl.uniform2f(gl.getUniformLocation(p, "u_srcSize"), baseActiva.width, baseActiva.height))
      : baseActiva;
    const etapa2 = ejecutarShaderSobreImagen(progColorHsl, etapa1, wFinal, hFinal, (p) => {
      gl.uniform1f(gl.getUniformLocation(p, "u_dehaze"), parseInt(mejoraDehaze.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_sombras"), parseInt(mejoraSombras.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_luces"), parseInt(mejoraLuces.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_brillo"), parseInt(mejoraBrillo.value) / 180);
      gl.uniform1f(gl.getUniformLocation(p, "u_contraste"), parseInt(mejoraContraste.value) / 50);
      gl.uniform1f(gl.getUniformLocation(p, "u_saturacion"), parseInt(mejoraSaturacion.value) / 60);
      gl.uniform1f(gl.getUniformLocation(p, "u_temp"), parseInt(mejoraTemperatura.value) / 100);
    });
    const etapa3 = ejecutarShaderSobreImagen(progDetalleFrec, etapa2, wFinal, hFinal, (p) => {
      gl.uniform1f(gl.getUniformLocation(p, "u_escala"), escala);
      gl.uniform1f(gl.getUniformLocation(p, "u_reconstruccion"), parseInt(mejoraReconstruccion.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_nitidez"), parseInt(mejoraNitidez.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_claridad"), parseInt(mejoraClaridad.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_piel"), parseInt(mejoraPiel.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_ruido"), parseInt(mejoraRuido.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_aberracion"), parseInt(mejoraAberracion.value) / 100);
      gl.uniform1f(gl.getUniformLocation(p, "u_grano"), parseInt(mejoraGrano.value) / 100);
    });
    const conFondo = aplicarFondoAislado(etapa3, baseOriginal);
    canvasResultadoFinal = adaptarOrientacionSinRecorte(conFondo);

    const wReal = Math.min(perfilDispositivo.maxExport, Math.round(baseActiva.width * escala));
    const hReal = Math.min(perfilDispositivo.maxExport, Math.round(baseActiva.height * escala));
    if (badgeGpu) badgeGpu.textContent = `⚡ ${nombreHardwareGpu} (${Math.round(performance.now() - t0)} ms • Salida ${wReal}x${hReal})`;
  }

  if (animarBloques && selectVistaMejora && selectVistaMejora.value === "lado") iniciarAnimacionBloquesGpu();
  else pintarVistaComparativa(1);
}
function dibujarLupaSubpixel(wVista, hVista, wImg, hImg) {
  if (!checkLupaMejora || !checkLupaMejora.checked || !puntoLupa || modoCropActivo || Boolean(modoPincel)) return;
  const radioLupa = Math.max(70, Math.round(Math.min(wVista, hVista) * 0.14));
  const zoomLupa = 4;
  const srcX = Math.max(0, Math.min(wImg - 1, puntoLupa.normX * wImg));
  const srcY = Math.max(0, Math.min(hImg - 1, puntoLupa.normY * hImg));
  const tamMuestra = (radioLupa * 2) / zoomLupa;
  const centroX = Math.min(wVista - radioLupa - 16, Math.max(radioLupa + 16, puntoLupa.canvasX));
  const centroY = Math.min(hVista - radioLupa - 16, Math.max(radioLupa + 16, puntoLupa.canvasY));

  ctxMejora.save();
  ctxMejora.beginPath(); ctxMejora.arc(centroX, centroY, radioLupa, 0, Math.PI * 2); ctxMejora.clip();
  ctxMejora.imageSmoothingEnabled = false;
  ctxMejora.drawImage(imagenRecortadaActual, (srcX / wImg) * imagenRecortadaActual.width - (tamMuestra / zoomLupa), (srcY / hImg) * imagenRecortadaActual.height - (tamMuestra / 2) * (imagenRecortadaActual.height / hImg), tamMuestra * (imagenRecortadaActual.width / wImg), tamMuestra * (imagenRecortadaActual.height / hImg), centroX - radioLupa, centroY - radioLupa, radioLupa * 2, radioLupa * 2);
  ctxMejora.beginPath(); ctxMejora.rect(centroX, centroY - radioLupa, radioLupa, radioLupa * 2); ctxMejora.clip();
  ctxMejora.drawImage(canvasResultadoFinal, srcX - tamMuestra / 2, srcY - tamMuestra / 2, tamMuestra, tamMuestra, centroX - radioLupa, centroY - radioLupa, radioLupa * 2, radioLupa * 2);
  ctxMejora.strokeStyle = "#FFFFFF"; ctxMejora.lineWidth = 3;
  ctxMejora.beginPath(); ctxMejora.moveTo(centroX, centroY - radioLupa); ctxMejora.lineTo(centroX, centroY + radioLupa); ctxMejora.stroke();
  ctxMejora.restore();

  ctxMejora.strokeStyle = "#083090"; ctxMejora.lineWidth = 6;
  ctxMejora.beginPath(); ctxMejora.arc(centroX, centroY, radioLupa, 0, Math.PI * 2); ctxMejora.stroke();
}
function pintarVistaComparativa(progresoTiles = 1) {
  if (!canvasMejora || !ctxMejora || !imagenRecortadaActual || !canvasResultadoFinal) return;
  const editandoSeleccion = modoCropActivo || Boolean(modoPincel);
  const imgTrabajo = editandoSeleccion ? obtenerCanvasRecorteBase() : imagenRecortadaActual;
  const imgDerecha = editandoSeleccion ? imgTrabajo : canvasResultadoFinal;
  const w = imgDerecha.width, h = imgDerecha.height;
  const modo = editandoSeleccion ? "unica" : (selectVistaMejora ? selectVistaMejora.value : "lado");

  if (modo === "lado") {
    const gap = Math.max(12, Math.round(w * 0.01));
    canvasMejora.width = w * 2 + gap; canvasMejora.height = h;
    ctxMejora.fillStyle = "#0B0F19"; ctxMejora.fillRect(0, 0, canvasMejora.width, h);
    ctxMejora.imageSmoothingEnabled = false; ctxMejora.drawImage(imgTrabajo, 0, 0, w, h);
    const destX = w + gap; ctxMejora.drawImage(imgTrabajo, destX, 0, w, h);
    const cols = 8, filas = 8;
    const bloquesListos = Math.floor(cols * filas * progresoTiles);
    const tileW = w / cols, tileH = h / filas;
    for (let b = 0; b < bloquesListos; b++) {
      const col = b % cols, fila = Math.floor(b / cols);
      ctxMejora.drawImage(imgDerecha, col * tileW, fila * tileH, tileW, tileH, destX + col * tileW, fila * tileH, tileW, tileH);
    }
    if (progresoTiles >= 1 && !editandoSeleccion) dibujarLupaSubpixel(canvasMejora.width, h, w, h);
  } else if (modo === "cortina") {
    canvasMejora.width = w; canvasMejora.height = h; ctxMejora.drawImage(imgDerecha, 0, 0);
    const corteX = Math.round(w * posicionCortina);
    ctxMejora.save(); ctxMejora.beginPath(); ctxMejora.rect(0, 0, corteX, h); ctxMejora.clip();
    ctxMejora.imageSmoothingEnabled = false; ctxMejora.drawImage(imgTrabajo, 0, 0, w, h); ctxMejora.restore();
    ctxMejora.strokeStyle = "#FFFFFF"; ctxMejora.lineWidth = Math.max(4, Math.round(w * 0.004));
    ctxMejora.beginPath(); ctxMejora.moveTo(corteX, 0); ctxMejora.lineTo(corteX, h); ctxMejora.stroke();
    if (!editandoSeleccion) dibujarLupaSubpixel(w, h, w, h);
  } else {
    canvasMejora.width = w; canvasMejora.height = h; ctxMejora.drawImage(imgDerecha, 0, 0);
    if (!editandoSeleccion) dibujarLupaSubpixel(w, h, w, h);
  }
  if (modoPincel && modoPincel !== "clonar" && canvasMascaraTrazos) {
    ctxMejora.save(); ctxMejora.globalAlpha = 0.52;
    ctxMejora.drawImage(canvasMascaraTrazos, 0, 0, w, h); ctxMejora.restore();
  }
  if (modoPincel === "clonar" && origenClon) {
    ctxMejora.save(); ctxMejora.strokeStyle = "#52B788"; ctxMejora.lineWidth = 3;
    ctxMejora.beginPath(); ctxMejora.arc(origenClon.x, origenClon.y, 12, 0, Math.PI * 2);
    ctxMejora.moveTo(origenClon.x - 18, origenClon.y); ctxMejora.lineTo(origenClon.x + 18, origenClon.y);
    ctxMejora.moveTo(origenClon.x, origenClon.y - 18); ctxMejora.lineTo(origenClon.x, origenClon.y + 18);
    ctxMejora.stroke(); ctxMejora.restore();
  }
  if (modoPincel && puntoLupa) {
    const radioPincel = ((parseInt(rangoTamanoPincel?.value) || 35) / 2) * (w / 800);
    ctxMejora.strokeStyle = modoPincel === "borrar" ? "#FF4D6D" : (modoPincel === "clonar" ? "#52B788" : "#00F5D4");
    ctxMejora.lineWidth = 3; ctxMejora.beginPath();
    ctxMejora.arc(puntoLupa.canvasX, puntoLupa.canvasY, radioPincel, 0, Math.PI * 2); ctxMejora.stroke();
  }

  if (modoCropActivo && inicioArrastreCrop) {
    const rx = Math.min(inicioArrastreCrop.x1, inicioArrastreCrop.x2), ry = Math.min(inicioArrastreCrop.y1, inicioArrastreCrop.y2);
    const rw = Math.abs(inicioArrastreCrop.x2 - inicioArrastreCrop.x1), rh = Math.abs(inicioArrastreCrop.y2 - inicioArrastreCrop.y1);
    ctxMejora.save(); ctxMejora.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctxMejora.beginPath(); ctxMejora.rect(0, 0, canvasMejora.width, canvasMejora.height); ctxMejora.rect(rx, ry, rw, rh); ctxMejora.fill("evenodd");
    ctxMejora.strokeStyle = "#00F5D4"; ctxMejora.lineWidth = 4; ctxMejora.strokeRect(rx, ry, rw, rh); ctxMejora.restore();
  }
}

function iniciarAnimacionBloquesGpu() {
  if (animacionCinebenchId) cancelAnimationFrame(animacionCinebenchId);
  let paso = 0;
  function cuadro() {
    paso++; const prog = Math.min(1, paso / 14);
    pintarVistaComparativa(prog);
    if (prog < 1) animacionCinebenchId = requestAnimationFrame(cuadro);
    else animacionCinebenchId = null;
  }
  animacionCinebenchId = requestAnimationFrame(cuadro);
}
function asegurarCanvasMascara(w, h) {
  if (!canvasMascaraTrazos || canvasMascaraTrazos.width !== w || canvasMascaraTrazos.height !== h) {
    canvasMascaraTrazos = document.createElement("canvas");
    canvasMascaraTrazos.width = w; canvasMascaraTrazos.height = h;
  }
  return canvasMascaraTrazos;
}

function ejecutarInpaintingMagico(fuenteCanvas, maskCanvas) {
  const w = fuenteCanvas.width, h = fuenteCanvas.height;
  const res = document.createElement("canvas"); res.width = w; res.height = h;
  const ctxR = res.getContext("2d"); ctxR.drawImage(fuenteCanvas, 0, 0);
  const imgData = ctxR.getImageData(0, 0, w, h);
  const mData = maskCanvas.getContext("2d").getImageData(0, 0, w, h).data;
  const d = imgData.data;

  const mascara = new Uint8Array(w * h);
  let pendientes = 0;
  for (let i = 0; i < w * h; i++) { if (mData[i * 4 + 3] > 20) { mascara[i] = 1; pendientes++; } }
  if (pendientes === 0) return res;

  let iter = 0;
  while (pendientes > 0 && iter < 260) {
    iter++; const siguiente = new Uint8Array(mascara);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (mascara[idx] !== 1) continue;
        let r = 0, g = 0, b = 0, cnt = 0;
        const vecinos = [idx - 1, idx + 1, idx - w, idx + w, idx - w - 1, idx - w + 1, idx + w - 1, idx + w + 1];
        for (let k = 0; k < 8; k++) { const nb = vecinos[k]; if (mascara[nb] === 0) { r += d[nb * 4]; g += d[nb * 4 + 1]; b += d[nb * 4 + 2]; cnt++; } }
        if (cnt > 0) {
          const ruido = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 4;
          d[idx * 4] = Math.min(255, Math.max(0, (r / cnt) + ruido));
          d[idx * 4 + 1] = Math.min(255, Math.max(0, (g / cnt) + ruido));
          d[idx * 4 + 2] = Math.min(255, Math.max(0, (b / cnt) + ruido));
          d[idx * 4 + 3] = 255; siguiente[idx] = 0; pendientes--;
        }
      }
    }
    mascara.set(siguiente);
  }
  ctxR.putImageData(imgData, 0, 0);
  return res;
}
const definicionPresets = {
  reconstructor: { btn: btnReconstructorHd, deltas: { "mejora-reconstruccion": 70, "mejora-nitidez": 45, "mejora-claridad": 25, "mejora-piel": 40, "mejora-ruido": 35, "mejora-aberracion": 25, "mejora-grano": 15, "mejora-sombras": 20, "mejora-luces": 15, "mejora-contraste": 12, "mejora-saturacion": 8 }, escala: "2" },
  retrato: { btn: btnRetratoNatural, deltas: { "mejora-piel": 45, "mejora-nitidez": 35, "mejora-claridad": 15, "mejora-ruido": 25, "mejora-grano": 12, "mejora-sombras": 15, "mejora-luces": 12, "mejora-brillo": 3, "mejora-contraste": 8, "mejora-saturacion": 5 }, escala: "2" },
  estudio: { btn: btnModoEstudio, deltas: { "mejora-reconstruccion": 45, "mejora-nitidez": 45, "mejora-claridad": 25, "mejora-piel": 30, "mejora-ruido": 30, "mejora-aberracion": 35, "mejora-dehaze": 20, "mejora-sombras": 25, "mejora-luces": 20, "mejora-contraste": 14, "mejora-saturacion": 8 }, escala: "2" },
  hdr: { btn: btnAutoLuz, deltas: { "mejora-dehaze": 20, "mejora-sombras": 28, "mejora-luces": 20, "mejora-brillo": 4, "mejora-contraste": 12, "mejora-saturacion": 6 } },
  sobel: { btn: btnAutoNitidez, deltas: { "mejora-reconstruccion": 45, "mejora-nitidez": 45, "mejora-claridad": 25, "mejora-ruido": 20 } }
};

Object.entries(definicionPresets).forEach(([clave, def]) => {
  if (!def.btn) return;
  def.btn.addEventListener("click", () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    if (presetsActivos.has(clave)) presetsActivos.delete(clave); else presetsActivos.add(clave);
    [mejoraReconstruccion, mejoraNitidez, mejoraClaridad, mejoraPiel, mejoraRuido, mejoraAberracion, mejoraGrano, mejoraSombras, mejoraLuces, mejoraDehaze, mejoraBrillo, mejoraContraste, mejoraSaturacion, mejoraTemperatura].forEach((el) => { if (el) el.value = 0; });
    let esc = "1";
    presetsActivos.forEach((k) => {
      const d = definicionPresets[k];
      if (d.escala && parseInt(d.escala) > parseInt(esc)) esc = d.escala;
      Object.entries(d.deltas).forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.value = Math.min(parseInt(el.max) || 100, Math.max(parseInt(el.min) || 0, (parseInt(el.value) || 0) + v)); });
    });
    if (presetsActivos.size > 0 && selectEscalaMejora.value === "1") selectEscalaMejora.value = esc;
    Object.entries(definicionPresets).forEach(([k, d]) => { if (d.btn) d.btn.classList.toggle("btn-activo-swap", presetsActivos.has(k)); });
    procesarImagenMejorador(true, false);
  });
});

function activarModoHerramienta(nuevoModo) {
  if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
  modoPincel = (modoPincel === nuevoModo) ? null : nuevoModo;
  modoCropActivo = false;
  if (btnPincelSeleccionar) btnPincelSeleccionar.classList.toggle("btn-activo-swap", modoPincel === "seleccionar");
  if (btnBorradorMagico) btnBorradorMagico.classList.toggle("btn-activo-swap", modoPincel === "borrar");
  if (btnPincelClonar) btnPincelClonar.classList.toggle("btn-activo-swap", modoPincel === "clonar");
  if (btnModoCrop) { btnModoCrop.classList.remove("btn-activo-swap"); btnModoCrop.textContent = "✂️ Recorte Manual"; }
  if (modoPincel === "clonar") { origenClon = null; offsetClon = null; if (!canvasImagenLimpiaInpaint) canvasImagenLimpiaInpaint = obtenerCanvasRecorteBase(); }
  else if (modoPincel) { const rec = obtenerCanvasRecorteBase(); asegurarCanvasMascara(rec.width, rec.height); }
  pintarVistaComparativa(1);
}
if (btnPincelSeleccionar) btnPincelSeleccionar.addEventListener("click", () => activarModoHerramienta("seleccionar"));
if (btnBorradorMagico) btnBorradorMagico.addEventListener("click", () => activarModoHerramienta("borrar"));
if (btnPincelClonar) btnPincelClonar.addEventListener("click", () => activarModoHerramienta("clonar"));

if (btnLimpiarTrazos) {
  btnLimpiarTrazos.addEventListener("click", () => {
    if (canvasMascaraTrazos) canvasMascaraTrazos.getContext("2d").clearRect(0, 0, canvasMascaraTrazos.width, canvasMascaraTrazos.height);
    origenClon = null; offsetClon = null; pintarVistaComparativa(1);
  });
}
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
    } else {
      const salida = document.createElement("canvas"); salida.width = rec.width; salida.height = rec.height;
      const ctxS = salida.getContext("2d"); ctxS.drawImage(rec, 0, 0);
      const imgD = ctxS.getImageData(0, 0, rec.width, rec.height);
      const mD = canvasMascaraTrazos.getContext("2d").getImageData(0, 0, rec.width, rec.height).data;
      for (let i = 0; i < mD.length; i += 4) imgD.data[i + 3] = mD[i + 3] > 20 ? 255 : 0;
      ctxS.putImageData(imgD, 0, 0);
      const imgFinal = new Image();
      imgFinal.onload = () => {
        imagenRecorteSinFondo = imgFinal;
        if (selectFondoAislado && selectFondoAislado.value === "original") selectFondoAislado.value = "bokeh";
        canvasMascaraTrazos.getContext("2d").clearRect(0, 0, canvasMascaraTrazos.width, canvasMascaraTrazos.height);
        modoPincel = null; if (btnPincelSeleccionar) btnPincelSeleccionar.classList.remove("btn-activo-swap");
        procesarImagenMejorador(true, false);
      };
      imgFinal.src = salida.toDataURL("image/png");
    }
  });
}
if (btnModoCrop) {
  btnModoCrop.addEventListener("click", () => {
    if (!imagenBaseInmutable) return alert("Primero subí una imagen.");
    modoCropActivo = !modoCropActivo; modoPincel = null;
    btnModoCrop.classList.toggle("btn-activo-swap", modoCropActivo);
    btnModoCrop.textContent = modoCropActivo ? "✂️ Arrastrá el cuadro..." : "✂️ Recorte Manual";
    if (btnPincelSeleccionar) btnPincelSeleccionar.classList.remove("btn-activo-swap");
    if (btnBorradorMagico) btnBorradorMagico.classList.remove("btn-activo-swap");
    if (btnPincelClonar) btnPincelClonar.classList.remove("btn-activo-swap");
    pintarVistaComparativa(1);
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
      if (!origenClon) { origenClon = { x: cx, y: cy }; pintarVistaComparativa(1); return; }
      const destX = (cx / canvasMejora.width) * canvasImagenLimpiaInpaint.width;
      const destY = (cy / canvasMejora.height) * canvasImagenLimpiaInpaint.height;
      if (!offsetClon) offsetClon = { dx: ((origenClon.x / canvasMejora.width) * canvasImagenLimpiaInpaint.width) - destX, dy: ((origenClon.y / canvasMejora.height) * canvasImagenLimpiaInpaint.height) - destY };
      pintandoConPincel = true; clonarEnCanvas(cx, cy); pintarVistaComparativa(1); return;
    }
    if (modoPincel) { pintandoConPincel = true; trazarEnMascara(cx, cy); pintarVistaComparativa(1); return; }
    if (modoCropActivo) inicioArrastreCrop = { x1: cx, y1: cy, x2: cx, y2: cy };
    else { arrastrandoCortina = true; posicionCortina = Math.min(0.98, Math.max(0.02, cx / canvasMejora.width)); pintarVistaComparativa(1); }
  });
  canvasMejora.addEventListener("pointermove", (e) => {
    if (!imagenBaseInmutable || !canvasResultadoFinal) return;
    const rect = canvasMejora.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvasMejora.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvasMejora.height / rect.height);
    puntoLupa = { canvasX: cx, canvasY: cy, normX: cx / canvasMejora.width, normY: cy / canvasMejora.height };
    if (modoPincel === "clonar") { if (pintandoConPincel) clonarEnCanvas(cx, cy); pintarVistaComparativa(1); return; }
    if (modoPincel) { if (pintandoConPincel) trazarEnMascara(cx, cy); pintarVistaComparativa(1); return; }
    if (modoCropActivo) { if (inicioArrastreCrop) { inicioArrastreCrop.x2 = cx; inicioArrastreCrop.y2 = cy; } pintarVistaComparativa(1); return; }
    const modo = selectVistaMejora ? selectVistaMejora.value : "lado";
    if (arrastrandoCortina && modo === "cortina") posicionCortina = Math.min(0.98, Math.max(0.02, cx / canvasMejora.width));
    let normX = cx / canvasResultadoFinal.width;
    if (modo === "lado" && cx > canvasResultadoFinal.width) normX = (cx - (canvasMejora.width - canvasResultadoFinal.width)) / canvasResultadoFinal.width;
    puntoLupa.normX = Math.min(1, Math.max(0, normX)); pintarVistaComparativa(1);
  });

  canvasMejora.addEventListener("pointerup", () => {
    pintandoConPincel = false;
    if (modoCropActivo && inicioArrastreCrop) {
      const w = canvasMejora.width, h = canvasMejora.height;
      const xMin = Math.max(0, Math.min(inicioArrastreCrop.x1, inicioArrastreCrop.x2)), xMax = Math.min(w, Math.max(inicioArrastreCrop.x1, inicioArrastreCrop.x2));
      const yMin = Math.max(0, Math.min(inicioArrastreCrop.y1, inicioArrastreCrop.y2)), yMax = Math.min(h, Math.max(inicioArrastreCrop.y1, inicioArrastreCrop.y2));
      if (xMax - xMin > 25 && yMax - yMin > 25) {
        cajaCropNorm = { x: cajaCropNorm.x + (xMin / w) * cajaCropNorm.w, y: cajaCropNorm.y + (yMin / h) * cajaCropNorm.h, w: ((xMax - xMin) / w) * cajaCropNorm.w, h: ((yMax - yMin) / h) * cajaCropNorm.h };
        imagenRecorteSinFondo = null; cacheFondoReconstruido = null;
      }
      inicioArrastreCrop = null; modoCropActivo = false;
      if (btnModoCrop) { btnModoCrop.classList.remove("btn-activo-swap"); btnModoCrop.textContent = "✂️ Recorte Manual"; }
      procesarImagenMejorador(true, false);
    }
    arrastrandoCortina = false;
  });

  canvasMejora.addEventListener("pointerleave", () => { pintandoConPincel = false; puntoLupa = null; pintarVistaComparativa(1); });
}
if (rangoTamanoPincel) rangoTamanoPincel.addEventListener("input", () => { actualizarEtiquetasPorcentaje(); pintarVistaComparativa(1); });

if (btnRestaurarMejora) {
  btnRestaurarMejora.addEventListener("click", () => {
    presetsActivos.clear(); cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 }; imagenRecorteSinFondo = null;
    modoPincel = null; modoCropActivo = false; canvasImagenLimpiaInpaint = null; cacheFondoReconstruido = null; origenClon = null; offsetClon = null;
    if (selectFondoAislado) selectFondoAislado.value = "original";
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
      img.onload = () => { imagenBaseInmutable = img; cajaCropNorm = { x: 0, y: 0, w: 1, h: 1 }; imagenRecorteSinFondo = null; puntoLupa = null; canvasImagenLimpiaInpaint = null; cacheFondoReconstruido = null; origenClon = null; offsetClon = null; procesarImagenMejorador(true, false); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(archivo);
  });
}
[mejoraReconstruccion, mejoraNitidez, mejoraClaridad, mejoraPiel, mejoraRuido, mejoraAberracion, mejoraGrano, mejoraSombras, mejoraLuces, mejoraDehaze, mejoraBrillo, mejoraContraste, mejoraSaturacion, mejoraTemperatura, selectEscalaMejora].forEach((ctrl) => { if (ctrl) ctrl.addEventListener("input", () => procesarImagenMejorador(false, false)); });
[selectFondoAislado, selectOrientacionMejora, selectModoExtension].forEach((sel) => { if (sel) sel.addEventListener("change", () => procesarImagenMejorador(false, false)); });
if (selectVistaMejora) selectVistaMejora.addEventListener("change", () => pintarVistaComparativa(1));
if (checkLupaMejora) checkLupaMejora.addEventListener("change", () => pintarVistaComparativa(1));

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

window.addEventListener("DOMContentLoaded", () => procesarImagenMejorador(false, false));
