window.CG = window.CG || {};

(function () {
  const W = 1080;
  const H = 1920;
  const SAFE_X = 70;
  const SAFE_BOTTOM = 320;
  const MAX_TEXT_W = W - SAFE_X * 2 - 40;
  const COLORS = { white: '#FFFFFF', yellow: '#FFE500', red: '#FF2D2D' };
  const BG = { black: '#000000', green: '#00FF00' };

  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  function fontFor(text, size) {
    if (/[\u0A80-\u0AFF]/.test(text)) return `900 ${size}px "Noto Sans Gujarati", sans-serif`;
    if (/[\u0900-\u097F]/.test(text)) return `900 ${size}px "Noto Sans Devanagari", sans-serif`;
    return `${size}px "Anton", Impact, "Arial Black", sans-serif`;
  }

  /** "HELLO *BIG* WORLD" -> [{w:'HELLO',hl:false},{w:'BIG',hl:true},...] */
  function tokenize(text) {
    const out = [];
    text.split('*').forEach((part, i) => {
      part.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, hl: i % 2 === 1 }));
    });
    return out;
  }

  function popScale(age) {
    if (age < 0.1) return 0.6 + 0.45 * easeOut(age / 0.1);
    if (age < 0.2) return 1.05 - 0.05 * easeInOut((age - 0.1) / 0.1);
    return 1;
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.cues = [];
      this.bg = 'black';
      this.position = 'lower';
      this.showSafe = false;
      this.video = null;
      this.layoutCache = new Map();
    }

    setCues(cues) {
      this.cues = cues.slice().sort((a, b) => a.start - b.start);
      this.layoutCache.clear();
    }

    duration() {
      if (!this.cues.length) return 3;
      return Math.max(...this.cues.map((c) => c.end)) + 0.4;
    }

    activeIndex(t) {
      return this.cues.findIndex((c) => t >= c.start && t < c.end);
    }

    layout(text) {
      const key = text;
      if (this.layoutCache.has(key)) return this.layoutCache.get(key);
      const ctx = this.ctx;
      const tokens = tokenize(text);
      let size = 150;
      let lines;
      for (;;) {
        ctx.font = fontFor(text, size);
        const space = ctx.measureText(' ').width;
        lines = [];
        let line = [];
        let lw = 0;
        let overflow = false;
        for (const tk of tokens) {
          const w = ctx.measureText(tk.w).width;
          if (w > MAX_TEXT_W) overflow = true;
          const add = line.length ? space + w : w;
          if (line.length && lw + add > MAX_TEXT_W) {
            lines.push({ tokens: line, width: lw });
            line = [];
            lw = 0;
          }
          tk.width = w;
          line.push(tk);
          lw += line.length > 1 ? space + w : w;
        }
        if (line.length) lines.push({ tokens: line, width: lw });
        const maxLines = tokens.length <= 4 ? 2 : 3;
        if ((!overflow && lines.length <= maxLines) || size <= 64) {
          const result = { size, space, lines, lineH: size * 1.12 };
          this.layoutCache.set(key, result);
          return result;
        }
        size -= 6;
      }
    }

    drawBackground(ctx) {
      if (this.bg === 'footage' && this.video && this.video.videoWidth) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        const v = this.video;
        const s = Math.max(W / v.videoWidth, H / v.videoHeight);
        const dw = v.videoWidth * s;
        const dh = v.videoHeight * s;
        ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else {
        ctx.fillStyle = BG[this.bg] || (this.bg === 'footage' ? '#111' : BG.black);
        ctx.fillRect(0, 0, W, H);
      }
    }

    drawCue(ctx, cue, t) {
      const age = t - cue.start;
      const left = cue.end - t;
      const alpha = Math.max(0, Math.min(1, age / 0.06, left / 0.06));
      const scale = popScale(age);
      const L = this.layout(cue.text);
      const blockH = L.lines.length * L.lineH;
      const cy = this.position === 'center' ? H / 2 : H - SAFE_BOTTOM - 40 - blockH / 2;
      const outline = Math.max(8, Math.min(12, L.size * 0.08));
      const hl = COLORS[cue.color] || COLORS.yellow;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(W / 2, cy);
      ctx.scale(scale, scale);
      ctx.translate(-W / 2, -cy);
      ctx.font = fontFor(cue.text, L.size);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;

      const placed = [];
      L.lines.forEach((line, li) => {
        let x = W / 2 - line.width / 2;
        const y = cy - blockH / 2 + L.lineH * (li + 0.5);
        line.tokens.forEach((tk) => {
          placed.push({ tk, x, y });
          x += tk.width + L.space;
        });
      });

      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;
      ctx.shadowBlur = 4;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = outline * 2;
      placed.forEach(({ tk, x, y }) => ctx.strokeText(tk.w, x, y));

      ctx.shadowColor = 'transparent';
      placed.forEach(({ tk, x, y }) => {
        ctx.fillStyle = tk.hl ? hl : COLORS.white;
        ctx.fillText(tk.w, x, y);
      });
      ctx.restore();
    }

    drawSafeZones(ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,45,45,0.18)';
      ctx.fillRect(0, 0, SAFE_X, H);
      ctx.fillRect(W - SAFE_X, 0, SAFE_X, H);
      ctx.fillRect(SAFE_X, H - SAFE_BOTTOM, W - SAFE_X * 2, SAFE_BOTTOM);
      ctx.strokeStyle = 'rgba(255,229,0,0.7)';
      ctx.setLineDash([18, 12]);
      ctx.lineWidth = 3;
      ctx.strokeRect(SAFE_X, 0, W - SAFE_X * 2, H - SAFE_BOTTOM);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '600 30px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UI SAFE ZONE (captions, buttons)', W / 2, H - SAFE_BOTTOM / 2);
      ctx.restore();
    }

    draw(t, { guides = true } = {}) {
      const ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      this.drawBackground(ctx);
      const i = this.activeIndex(t);
      if (i >= 0) this.drawCue(ctx, this.cues[i], t);
      if (guides && this.showSafe) this.drawSafeZones(ctx);
      return i;
    }
  }

  function pickMime() {
    const candidates = [
      'video/mp4;codecs=avc1.640028',
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    return candidates.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
  }

  /** Real-time render of the caption layer on a solid background. */
  function exportVideo({ cues, bg, position, onProgress }) {
    return new Promise((resolve, reject) => {
      if (!window.MediaRecorder) return reject(new Error('This browser cannot record video (MediaRecorder missing). Use Chrome or Edge.'));
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;';
      document.body.appendChild(canvas);

      const r = new Renderer(canvas);
      r.bg = bg;
      r.position = position;
      r.setCues(cues);
      r.draw(0, { guides: false });

      const mime = pickMime();
      const stream = canvas.captureStream(30);
      let rec;
      try {
        rec = new MediaRecorder(stream, { mimeType: mime || undefined, videoBitsPerSecond: 12_000_000 });
      } catch (e) {
        canvas.remove();
        return reject(e);
      }
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        canvas.remove();
        const type = rec.mimeType || mime || 'video/webm';
        resolve({ blob: new Blob(chunks, { type }), ext: type.includes('mp4') ? 'mp4' : 'webm' });
      };
      rec.onerror = (e) => { canvas.remove(); reject(e.error || new Error('Recording failed')); };

      const dur = r.duration();
      rec.start(250);
      const t0 = performance.now();
      const tick = () => {
        const t = (performance.now() - t0) / 1000;
        r.draw(Math.min(t, dur), { guides: false });
        onProgress && onProgress(Math.min(1, t / dur));
        if (t < dur) requestAnimationFrame(tick);
        else setTimeout(() => rec.stop(), 120);
      };
      requestAnimationFrame(tick);
    });
  }

  CG.Renderer = Renderer;
  CG.exportVideo = exportVideo;
  CG.pickMime = pickMime;
})();
