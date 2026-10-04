window.CG = window.CG || {};

(function () {
  const KEY = 'rcs.apiKey';
  const MODEL = 'rcs.model';

  const settings = {
    get key() { return localStorage.getItem(KEY) || ''; },
    set key(v) { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); },
    get model() { return localStorage.getItem(MODEL) || 'gpt-4o-mini'; },
    set model(v) { v ? localStorage.setItem(MODEL, v) : localStorage.removeItem(MODEL); },
  };

  const SYSTEM = `You are an expert social-media caption generator and on-screen typography designer for Instagram Reels, TikTok, YouTube Shorts and Facebook Reels.

Rules:
- Languages: "en" English, "hi" Hindi (Devanagari script), "gu" Gujarati (Gujarati script), "hinglish" Hindi in Roman letters, "gujlish" Gujarati in Roman letters. Detect from the user's input when language is "auto"; never switch language unasked.
- Tones: funny, savage, motivational, emotional, roast, storytelling, informative, trendy.
- caption: 1-3 short lines, the first line is a scroll-stopping hook, catchy and natural, with a few matching emojis.
- cta: one line (Save this / Tag a friend / Comment / Follow / Share) in the same language.
- hashtags: 3-5 highly relevant hashtags.
- emojis: 5-10 emojis matching the mood (no spam).
- onscreen: 5-12 punchy word-groups, 2-4 words each (max 6), ALL CAPS for Latin script, NEVER a full sentence. Wrap exactly one "money word" (or short phrase) per line in *stars*. color is "yellow" or "red" (red for savage/roast punches). Times in seconds, sequential, non-overlapping. If word timestamps are given, lock each group to the moment the words are spoken; otherwise time ~0.9-2.0s per group. The last group should be a CTA.

Reply with ONLY a JSON object:
{"language":"en|hi|gu|hinglish|gujlish","tone":"...","caption":["..."],"cta":"...","hashtags":["#..."],"emojis":["..."],"onscreen":[{"start":0,"end":1.1,"text":"AAJ NO *DIVAS*","color":"yellow"}]}`;

  async function call(path, init) {
    if (!settings.key) throw new Error('Add your OpenAI API key in AI settings first.');
    const res = await fetch(`https://api.openai.com/v1/${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${settings.key}`, ...(init.headers || {}) },
    });
    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try { msg = (await res.json()).error?.message || msg; } catch (_) { /* keep status text */ }
      throw new Error(`OpenAI error: ${msg}`);
    }
    return res.json();
  }

  async function generate({ mode, topic, transcript, words, lang, tone }) {
    let user = `Mode: ${mode === 'A' ? 'A (topic)' : 'B (media transcript)'}\nLanguage: ${lang}\nTone: ${tone}\n`;
    if (mode === 'A') user += `Topic: ${topic}`;
    else {
      user += `Transcript: ${transcript}`;
      if (words && words.length) {
        user += `\nWord timestamps (word@start-end):\n${words.slice(0, 600).map((w) => `${w.w}@${w.start}-${w.end}`).join(' ')}`;
      }
    }
    const data = await call('chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: settings.model,
        temperature: 0.9,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
      }),
    });
    const j = JSON.parse(data.choices[0].message.content);
    const L = CG.LANG_NAMES[j.language] ? j.language : (lang !== 'auto' ? lang : 'en');
    const T = CG.TONES.includes(j.tone) ? j.tone : (tone !== 'auto' ? tone : 'trendy');
    const cues = (j.onscreen || []).map((c) => ({
      start: Math.round(Number(c.start) * 100) / 100 || 0,
      end: Math.round(Number(c.end) * 100) / 100 || 0,
      text: CG.Gen.markMoney(String(c.text || '').trim(), L),
      color: c.color === 'red' ? 'red' : 'yellow',
    })).filter((c) => c.text && c.end > c.start);
    return {
      lang: L,
      tone: T,
      caption: [].concat(j.caption || []).slice(0, 3),
      cta: j.cta || CG.T[L].cta[CG.TONE_CTA[T]],
      hashtags: [].concat(j.hashtags || []).slice(0, 5).map((h) => (h.startsWith('#') ? h : `#${h}`)),
      emojis: [].concat(j.emojis || []).slice(0, 10),
      cues: cues.length ? cues : CG.Gen.timeCues(CG.T[L].screen[T], CG.Gen.toneColor(T)),
    };
  }

  async function transcribe(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error('Whisper accepts files up to 25 MB. Trim or compress the file, or paste the transcript.');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('model', 'whisper-1');
    fd.append('response_format', 'verbose_json');
    fd.append('timestamp_granularities[]', 'word');
    fd.append('timestamp_granularities[]', 'segment');
    const data = await call('audio/transcriptions', { method: 'POST', body: fd });
    const words = (data.words || []).map((w) => ({ w: w.word, start: +w.start.toFixed(2), end: +w.end.toFixed(2) }));
    return { text: data.text || '', words, language: data.language || '' };
  }

  CG.AI = { settings, generate, transcribe };
})();
