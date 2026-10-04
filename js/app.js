(function () {
  const $ = (id) => document.getElementById(id);
  const els = {
    tabs: document.querySelectorAll('.tab'),
    modeA: $('modeA'), modeB: $('modeB'),
    topic: $('topic'), transcript: $('transcript'), mediaLink: $('mediaLink'),
    mediaFile: $('mediaFile'), pickFile: $('pickFile'), drop: $('drop'), fileName: $('fileName'),
    transcribeBtn: $('transcribeBtn'), transcribeHint: $('transcribeHint'),
    lang: $('lang'), tone: $('tone'), position: $('position'), hlColor: $('hlColor'),
    useAI: $('useAI'), generateBtn: $('generateBtn'), alert: $('alert'),
    outputCard: $('outputCard'), cuesCard: $('cuesCard'), chips: $('chips'),
    outCaption: $('outCaption'), outCta: $('outCta'), outTags: $('outTags'), outEmojis: $('outEmojis'),
    regenBtn: $('regenBtn'), copyAll: $('copyAll'),
    cueTable: $('cueTable'), addCue: $('addCue'), downloadSrt: $('downloadSrt'),
    canvas: $('preview'), playBtn: $('playBtn'), scrub: $('scrub'), timeLabel: $('timeLabel'),
    bgSeg: $('bgSeg'), footageBtn: $('footageBtn'), safeToggle: $('safeToggle'),
    exportBlack: $('exportBlack'), exportGreen: $('exportGreen'),
    progress: $('progress'), progressBar: $('progressBar'), progressText: $('progressText'), exportHint: $('exportHint'),
    settingsBtn: $('settingsBtn'), aiDot: $('aiDot'), settings: $('settings'),
    apiKey: $('apiKey'), apiModel: $('apiModel'), saveKey: $('saveKey'), clearKey: $('clearKey'),
    toast: $('toast'),
  };

  const state = {
    mode: 'A',
    result: null,
    whisper: null,
    media: null,
    mediaUrl: null,
    playing: false,
    t: 0,
    last: 0,
    exporting: false,
  };

  const renderer = new CG.Renderer(els.canvas);
  renderer.setCues([
    { start: 0, end: 1.4, text: 'YOUR *CAPTION*', color: 'yellow' },
    { start: 1.4, end: 2.8, text: 'POPS UP *HERE*', color: 'yellow' },
    { start: 2.8, end: 4.2, text: 'TYPE A *TOPIC*', color: 'red' },
  ]);

  /* ---------- helpers ---------- */
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }
  function showAlert(msg, info = false) {
    els.alert.innerHTML = msg;
    els.alert.classList.toggle('info', info);
    els.alert.classList.remove('hidden');
  }
  function hideAlert() { els.alert.classList.add('hidden'); }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function refreshAiDot() { els.aiDot.classList.toggle('on', !!CG.AI.settings.key); }

  /* ---------- tabs ---------- */
  els.tabs.forEach((tab) => tab.addEventListener('click', () => {
    els.tabs.forEach((t) => t.classList.toggle('active', t === tab));
    state.mode = tab.dataset.mode;
    els.modeA.classList.toggle('hidden', state.mode !== 'A');
    els.modeB.classList.toggle('hidden', state.mode !== 'B');
    hideAlert();
  }));

  /* ---------- media ---------- */
  function loadMedia(file) {
    if (!file) return;
    if (state.mediaUrl) URL.revokeObjectURL(state.mediaUrl);
    if (state.media) state.media.pause();
    state.whisper = null;
    state.mediaUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video') || /\.(mp4|mov|mkv|webm)$/i.test(file.name);
    const el = document.createElement(isVideo ? 'video' : 'audio');
    el.src = state.mediaUrl;
    el.preload = 'auto';
    el.playsInline = true;
    el.onerror = () => showAlert('This browser can’t play/read that file. Please paste the transcript instead (or convert it to MP4/MP3).');
    state.media = el;
    state.file = file;
    renderer.video = isVideo ? el : null;
    els.footageBtn.disabled = !isVideo;
    els.fileName.textContent = `${file.name} · ${(file.size / 1048576).toFixed(1)} MB`;
    updateTranscribeHint();
    if (isVideo) setBg('footage');
  }
  els.pickFile.addEventListener('click', () => els.mediaFile.click());
  els.mediaFile.addEventListener('change', () => loadMedia(els.mediaFile.files[0]));
  ['dragenter', 'dragover'].forEach((ev) => els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.remove('over'); }));
  els.drop.addEventListener('drop', (e) => loadMedia(e.dataTransfer.files[0]));

  function updateTranscribeHint() {
    els.transcribeBtn.disabled = !state.file;
    if (!state.file) els.transcribeHint.textContent = 'Upload a file first.';
    else if (!CG.AI.settings.key) els.transcribeHint.textContent = 'Needs an OpenAI key (AI settings) — or paste the transcript.';
    else els.transcribeHint.textContent = 'Word-level timestamps via Whisper.';
  }

  async function transcribe() {
    if (!state.file) return;
    if (!CG.AI.settings.key) {
      els.settings.showModal();
      return;
    }
    els.transcribeBtn.disabled = true;
    els.transcribeHint.textContent = 'Transcribing…';
    try {
      const r = await CG.AI.transcribe(state.file);
      if (!r.text.trim()) throw new Error('No speech found in this file. Please paste the transcript.');
      state.whisper = r;
      els.transcript.value = r.text.trim();
      els.transcribeHint.textContent = `Done · ${r.words.length} words${r.language ? ` · ${r.language}` : ''}`;
      return r;
    } catch (e) {
      els.transcribeHint.textContent = '';
      showAlert(escapeHtml(e.message));
      throw e;
    } finally {
      els.transcribeBtn.disabled = false;
    }
  }
  els.transcribeBtn.addEventListener('click', () => transcribe().catch(() => {}));

  /* ---------- generate ---------- */
  async function generate() {
    hideAlert();
    const opts = { lang: els.lang.value, tone: els.tone.value, color: els.hlColor.value };
    let input;

    if (state.mode === 'A') {
      const topic = els.topic.value.trim();
      if (!topic) {
        showAlert('Give me a topic (Mode A) or switch to Mode B to upload media / paste a link.', true);
        els.topic.focus();
        return;
      }
      input = { mode: 'A', topic };
    } else {
      let transcript = els.transcript.value.trim();
      if (!transcript && state.file && CG.AI.settings.key) {
        try { await transcribe(); } catch (_) { return; }
        transcript = els.transcript.value.trim();
      }
      if (!transcript) {
        if (els.mediaLink.value.trim()) {
          showAlert('I can’t read YouTube / TikTok / Instagram links from the browser. Please paste the transcript (YouTube: <b>… More → Show transcript</b>), or download the video and upload it here.', true);
        } else if (state.file) {
          showAlert('I can’t transcribe this file without an OpenAI key. Please paste the transcript, or add a key in <b>AI settings</b>.', true);
        } else {
          showAlert('Upload a video/audio file, paste a link, or paste the transcript.', true);
        }
        return;
      }
      const w = state.whisper && state.whisper.text.trim() === transcript ? state.whisper : null;
      input = w
        ? { mode: 'B', transcript, words: w.words, text: w.text }
        : { mode: 'B', transcript, ...CG.Gen.parseTranscript(transcript) };
    }

    els.generateBtn.disabled = true;
    const label = els.generateBtn.textContent;
    els.generateBtn.textContent = 'Generating…';
    try {
      let result = null;
      if (els.useAI.checked) {
        if (!CG.AI.settings.key) {
          showAlert('“Use AI” is on but no API key is set — using the built-in generator instead.', true);
        } else {
          try {
            result = await CG.AI.generate({ ...input, lang: opts.lang, tone: opts.tone });
            if (opts.color !== 'auto') result.cues.forEach((c) => { c.color = opts.color; });
          } catch (e) {
            showAlert(`${escapeHtml(e.message)}<br>Using the built-in generator instead.`);
          }
        }
      }
      if (!result) {
        result = input.mode === 'A'
          ? CG.Gen.fromTopic({ topic: input.topic, ...opts })
          : CG.Gen.fromTranscript({ raw: input.transcript, words: input.words, text: input.text || input.transcript, ...opts });
      }
      showResult(result);
    } finally {
      els.generateBtn.disabled = false;
      els.generateBtn.textContent = label;
    }
  }
  els.generateBtn.addEventListener('click', generate);
  els.regenBtn.addEventListener('click', generate);
  els.topic.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
  });

  function showResult(r) {
    state.result = r;
    els.outputCard.classList.remove('hidden');
    els.cuesCard.classList.remove('hidden');
    els.chips.innerHTML = `<span class="chip y">${CG.LANG_NAMES[r.lang]}</span><span class="chip">${r.tone[0].toUpperCase() + r.tone.slice(1)}</span>`;
    els.outCaption.textContent = r.caption.join('\n');
    els.outCta.textContent = r.cta;
    els.outTags.textContent = r.hashtags.join(' ');
    els.outEmojis.textContent = r.emojis.join(' ');
    renderCueTable();
    syncCues();
    els.exportBlack.disabled = false;
    els.exportGreen.disabled = false;
    seek(0);
    play(true);
  }

  /* ---------- cue table ---------- */
  function renderCueTable() {
    const cues = state.result.cues;
    els.cueTable.innerHTML = `<div class="cue-head"><span class="idx">#</span><span>Start</span><span>End</span><span>Text</span><span class="c">Highlight</span><span></span></div>`;
    cues.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'cue';
      row.dataset.i = i;
      row.innerHTML = `
        <span class="idx">${i + 1}</span>
        <input type="number" step="0.05" min="0" class="start" value="${c.start.toFixed(2)}" aria-label="Start (s)" />
        <input type="number" step="0.05" min="0" class="end" value="${c.end.toFixed(2)}" aria-label="End (s)" />
        <input type="text" class="text" value="${escapeHtml(c.text)}" aria-label="Text" />
        <select class="color" aria-label="Highlight colour">
          <option value="yellow"${c.color === 'yellow' ? ' selected' : ''}>Yellow</option>
          <option value="red"${c.color === 'red' ? ' selected' : ''}>Red</option>
        </select>
        <button class="del" type="button" aria-label="Delete">×</button>`;
      row.querySelector('.start').addEventListener('input', (e) => { c.start = parseFloat(e.target.value) || 0; syncCues(); });
      row.querySelector('.end').addEventListener('input', (e) => { c.end = parseFloat(e.target.value) || 0; syncCues(); });
      row.querySelector('.text').addEventListener('input', (e) => { c.text = e.target.value.toUpperCase(); syncCues(); });
      row.querySelector('.color').addEventListener('change', (e) => { c.color = e.target.value; syncCues(); });
      row.querySelector('.del').addEventListener('click', () => { cues.splice(i, 1); renderCueTable(); syncCues(); });
      row.addEventListener('focusin', () => { if (!state.playing) seek(c.start + 0.25); });
      els.cueTable.appendChild(row);
    });
  }
  els.addCue.addEventListener('click', () => {
    if (!state.result) return;
    const cues = state.result.cues;
    const start = cues.length ? Math.max(...cues.map((c) => c.end)) : 0;
    cues.push({ start: +start.toFixed(2), end: +(start + 1.2).toFixed(2), text: 'NEW *LINE*', color: CG.Gen.toneColor(state.result.tone, els.hlColor.value) });
    renderCueTable();
    syncCues();
  });
  function syncCues() {
    renderer.setCues(state.result.cues.filter((c) => c.end > c.start && c.text.trim()));
    updateTime();
  }

  els.hlColor.addEventListener('change', () => {
    if (!state.result) return;
    state.result.cues.forEach((c) => { c.color = CG.Gen.toneColor(state.result.tone, els.hlColor.value); });
    renderCueTable();
    syncCues();
  });
  els.position.addEventListener('change', () => { renderer.position = els.position.value; });

  /* ---------- copy ---------- */
  document.querySelectorAll('.copy').forEach((b) => b.addEventListener('click', () => {
    navigator.clipboard.writeText($(b.dataset.copy).innerText.trim()).then(() => toast('Copied!'));
  }));

  function fullText() {
    const r = state.result;
    const cues = r.cues.slice().sort((a, b) => a.start - b.start);
    const pad = Math.max(...cues.map((c) => c.text.replace(/\*/g, '').length), 10) + 4;
    const list = cues.map((c) => {
      const t = `${c.start.toFixed(2)}–${c.end.toFixed(2)}`;
      const plain = c.text.replace(/\*/g, '');
      const money = (c.text.match(/\*([^*]+)\*/) || [])[1];
      return `${t}  ${plain.padEnd(pad)}(${money ? `${c.color} highlight: ${money}` : 'white'})`;
    }).join('\n');
    return [
      'Caption', els.outCaption.innerText.trim(), '',
      els.outCta.innerText.trim(), '',
      els.outTags.innerText.trim(), '',
      els.outEmojis.innerText.trim(), '',
      'On-screen text:', list, '',
      'Screen variants: BLACK (#000000) + GREEN (#00FF00), 1080×1920, 30fps.',
    ].join('\n');
  }
  els.copyAll.addEventListener('click', () => navigator.clipboard.writeText(fullText()).then(() => toast('Full output copied!')));

  els.downloadSrt.addEventListener('click', () => {
    if (!state.result) return;
    const cues = state.result.cues.slice().sort((a, b) => a.start - b.start);
    download(new Blob([CG.Gen.toSrt(cues)], { type: 'text/plain;charset=utf-8' }), 'on-screen-captions.srt');
  });

  /* ---------- preview player ---------- */
  function timelineDuration() {
    const md = state.media && isFinite(state.media.duration) ? state.media.duration : 0;
    return Math.max(renderer.duration(), md);
  }
  function seek(t) {
    state.t = Math.max(0, Math.min(t, timelineDuration()));
    if (state.media && isFinite(state.media.duration)) state.media.currentTime = Math.min(state.t, state.media.duration);
    updateTime();
  }
  function play(on) {
    state.playing = on;
    els.playBtn.textContent = on ? '❚❚' : '▶';
    if (state.media) {
      if (on) state.media.play().catch(() => {});
      else state.media.pause();
    }
    state.last = performance.now();
  }
  els.playBtn.addEventListener('click', () => {
    if (!state.playing && state.t >= timelineDuration() - 0.05) seek(0);
    play(!state.playing);
  });
  els.scrub.addEventListener('input', () => seek((els.scrub.value / 1000) * timelineDuration()));

  let lastActive = -2;
  function updateTime() {
    const d = timelineDuration();
    els.scrub.value = String(Math.round((state.t / d) * 1000));
    els.timeLabel.textContent = `${state.t.toFixed(2)}s`;
  }

  function loop(now) {
    if (state.playing) {
      if (state.media && !state.media.paused) state.t = state.media.currentTime;
      else state.t += (now - state.last) / 1000;
      state.last = now;
      const d = timelineDuration();
      if (state.t >= d) {
        if (state.media) { play(false); state.t = d; } else state.t = 0;
      }
      updateTime();
    }
    const i = renderer.draw(state.t);
    if (state.result && i !== lastActive) {
      lastActive = i;
      const cue = renderer.cues[i];
      const idx = cue ? state.result.cues.indexOf(cue) : -1;
      els.cueTable.querySelectorAll('.cue').forEach((row) => row.classList.toggle('active', +row.dataset.i === idx));
    }
    requestAnimationFrame(loop);
  }

  function setBg(bg) {
    renderer.bg = bg;
    els.bgSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.bg === bg));
  }
  els.bgSeg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.disabled) setBg(b.dataset.bg);
  });
  els.safeToggle.addEventListener('change', () => { renderer.showSafe = els.safeToggle.checked; });

  /* ---------- export ---------- */
  async function doExport(bg) {
    if (!state.result || state.exporting) return;
    state.exporting = true;
    els.exportBlack.disabled = els.exportGreen.disabled = true;
    els.progress.classList.remove('hidden');
    const cues = renderer.cues.map((c) => ({ ...c }));
    try {
      const { blob, ext } = await CG.exportVideo({
        cues,
        bg,
        position: renderer.position,
        onProgress: (p) => {
          els.progressBar.style.width = `${p * 100}%`;
          els.progressText.textContent = `Rendering ${bg} screen… ${Math.round(p * 100)}%`;
        },
      });
      download(blob, `reel-captions-${bg}-1080x1920-30fps.${ext}`);
      if (ext === 'webm') {
        els.exportHint.innerHTML = 'Your browser saved <b>WebM</b>. For H.264 MP4 use Chrome/Edge 126+, or convert: <code>ffmpeg -i in.webm -c:v libx264 -pix_fmt yuv420p -r 30 out.mp4</code>';
      }
      toast(`${bg === 'green' ? 'Green' : 'Black'} screen ${ext.toUpperCase()} downloaded`);
    } catch (e) {
      showAlert(`Export failed: ${escapeHtml(e.message || String(e))}`);
    } finally {
      state.exporting = false;
      els.exportBlack.disabled = els.exportGreen.disabled = false;
      setTimeout(() => els.progress.classList.add('hidden'), 800);
    }
  }
  els.exportBlack.addEventListener('click', () => doExport('black'));
  els.exportGreen.addEventListener('click', () => doExport('green'));

  /* ---------- settings ---------- */
  els.settingsBtn.addEventListener('click', () => {
    els.apiKey.value = CG.AI.settings.key;
    els.apiModel.value = CG.AI.settings.model;
    els.settings.showModal();
  });
  els.saveKey.addEventListener('click', () => {
    CG.AI.settings.key = els.apiKey.value.trim();
    CG.AI.settings.model = els.apiModel.value.trim();
    if (CG.AI.settings.key) els.useAI.checked = true;
    refreshAiDot();
    updateTranscribeHint();
    toast('Settings saved');
  });
  els.clearKey.addEventListener('click', () => {
    CG.AI.settings.key = '';
    els.apiKey.value = '';
    els.useAI.checked = false;
    refreshAiDot();
    updateTranscribeHint();
    toast('Key cleared');
  });

  /* ---------- init ---------- */
  const mime = CG.pickMime();
  if (!mime.includes('mp4')) {
    els.exportHint.textContent = 'This browser exports WebM. Use Chrome or Edge (v126+) for direct H.264 MP4. Keep the tab visible while exporting.';
  }
  els.useAI.checked = !!CG.AI.settings.key;
  refreshAiDot();
  updateTranscribeHint();

  Promise.all([
    document.fonts.load('150px "Anton"'),
    document.fonts.load('900 150px "Noto Sans Devanagari"', 'अ'),
    document.fonts.load('900 150px "Noto Sans Gujarati"', 'અ'),
  ]).catch(() => {}).finally(() => renderer.layoutCache.clear());
  document.fonts.addEventListener('loadingdone', () => renderer.layoutCache.clear());

  play(true);
  requestAnimationFrame(loop);
})();
