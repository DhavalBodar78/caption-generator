window.CG = window.CG || {};

(function () {
  const EMOJI_RE = /\p{Extended_Pictographic}/u;

  const GUJLISH_WORDS = new Set([
    'che', 'chhe', 'chu', 'chhu', 'cho', 'chho', 'su', 'shu', 'kem', 'bau', 'bahu', 'tame', 'tamne', 'tamaru', 'tamari',
    'nathi', 'hatu', 'hati', 'mane', 'maru', 'mari', 'aapde', 'apde', 'jovu', 'joie', 'joiye', 'kevi', 'kevu', 'divas',
    'saru', 'majama', 'kai', 'kyare', 'pachi', 'karvu', 'karyu', 'thayu', 'aavse', 'jaie', 'kahu', 'ene', 'aavo', 'mast',
  ]);
  const HINGLISH_WORDS = new Set([
    'hai', 'hain', 'kya', 'nahi', 'nahin', 'bohot', 'bahut', 'mera', 'meri', 'tum', 'tera', 'teri', 'yaar', 'kaise',
    'kyun', 'kyu', 'accha', 'acha', 'hoga', 'tha', 'thi', 'raha', 'rahe', 'rahi', 'mujhe', 'apna', 'bhi', 'aur', 'karo',
    'kar', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'hum', 'humein', 'dekho', 'karna', 'chahiye', 'kuch', 'sab',
  ]);

  const TONE_KEYWORDS = {
    funny: ['funny', 'lol', 'meme', 'comedy', 'joke', 'prank', 'fail', 'mazak', 'majak', 'hasi', 'मज़ाक', 'હસવું'],
    savage: ['savage', 'truth', 'hot take', 'unpopular', 'stop', 'wrong', 'attitude', 'sach', 'सच'],
    motivational: ['gym', 'fitness', 'workout', 'success', 'motivation', 'study', 'hustle', 'goal', 'discipline', 'grind',
      'mehnat', 'sapna', 'mahenat', 'मेहनत', 'सपना', 'મહેનત', 'સપનું'],
    emotional: ['love', 'miss', 'mom', 'mother', 'dad', 'father', 'maa', 'papa', 'family', 'sad', 'breakup', 'memories',
      'yaad', 'pyaar', 'prem', 'याद', 'प्यार', 'माँ', 'યાદ', 'પ્રેમ', 'મમ્મી'],
    roast: ['roast', 'cringe', 'monday', 'lazy', 'excuse', 'bahana', 'bahanu'],
    storytelling: ['story', 'journey', 'tried', 'days', 'experience', 'kahani', 'vaarta', 'कहानी', 'વાર્તા'],
    informative: ['tips', 'how to', 'guide', 'facts', 'learn', 'hack', 'ways', 'steps', 'explained', 'why', 'tarika',
      'tarike', 'टिप्स', 'ટિપ્સ'],
    trendy: ['trend', 'trending', 'vibe', 'aesthetic', 'outfit', 'fashion', 'style', 'garba', 'navratri', 'festival',
      'party', 'travel', 'song', 'dance'],
  };

  const STOP = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on', 'for', 'with', 'this', 'that',
    'it', 'its', 'i', 'you', 'we', 'they', 'he', 'she', 'my', 'your', 'our', 'me', 'so', 'just', 'be', 'at', 'as', 'do',
    'have', 'has', 'had', 'not', 'if', 'then', 'what', 'when', 'how', 'all', 'can', 'will', 'from', 'about', 'like',
    'hai', 'hain', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'aur', 'bhi', 'to', 'toh', 'ye', 'woh', 'che', 'chhe', 'ne', 'ma',
    'nu', 'ni', 'no', 'na', 'ane', 'pan', 'j', 'aa', 'e', 'है', 'हैं', 'का', 'की', 'के', 'को', 'से', 'में', 'और', 'भी',
    'છે', 'ને', 'માં', 'નું', 'ની', 'નો', 'અને', 'પણ', 'જ', 'આ', 'એ',
  ]);

  const CTA_WORDS = [
    'follow', 'share', 'save', 'comment', 'subscribe', 'like', 'tag', 'फॉलो', 'शेयर', 'सेव', 'कमेंट', 'ફોલો', 'શેર', 'સેવ', 'કમેન્ટ',
  ];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const round2 = (n) => Math.round(n * 100) / 100;
  const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean);
  const cleanWord = (w) => w.replace(/[^\p{L}\p{N}\p{M}'’-]/gu, '');

  function detectLanguage(text) {
    if (!text) return 'en';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    const ws = (text.toLowerCase().match(/[a-z]+/g) || []);
    let g = 0;
    let h = 0;
    ws.forEach((w) => {
      if (GUJLISH_WORDS.has(w)) g++;
      if (HINGLISH_WORDS.has(w)) h++;
    });
    if (g > 0 && g > h) return 'gujlish';
    if (h > 0) return 'hinglish';
    return 'en';
  }

  function detectTone(text) {
    const t = (text || '').toLowerCase();
    let best = 'trendy';
    let bestScore = 0;
    for (const tone of CG.TONES) {
      const score = TONE_KEYWORDS[tone].reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
      if (score > bestScore) {
        best = tone;
        bestScore = score;
      }
    }
    return best;
  }

  function toneColor(tone, override) {
    if (override && override !== 'auto') return override;
    return tone === 'savage' || tone === 'roast' ? 'red' : 'yellow';
  }

  function withEmojis(line, tone, n = 2, used = new Set()) {
    if (EMOJI_RE.test(line)) return line;
    const picks = shuffle(CG.TONE_EMOJIS[tone].filter((e) => !used.has(e))).slice(0, n);
    picks.forEach((e) => used.add(e));
    return `${line} ${picks.join('')}`;
  }

  function captionLines(lines, tone) {
    const used = new Set();
    return lines.map((l) => withEmojis(l, tone, 2, used));
  }

  function topicTag(topic) {
    const ws = words(topic).map(cleanWord).filter((w) => w && !STOP.has(w.toLowerCase())).slice(0, 3);
    if (!ws.length) return null;
    const tag = ws.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return tag.length > 1 ? `#${tag.slice(0, 28)}` : null;
  }

  function buildHashtags(topic, tone, lang) {
    const tags = [];
    const tt = topicTag(topic);
    if (tt) tags.push(tt);
    tags.push(CG.TONE_TAGS[tone]);
    for (const t of CG.LANG_TAGS[lang]) {
      if (tags.length >= 5) break;
      if (!tags.includes(t)) tags.push(t);
    }
    return tags.slice(0, 5);
  }

  function pickEmojis(tone) {
    return shuffle(CG.TONE_EMOJIS[tone]).slice(0, 7);
  }

  function timeCues(lines, color) {
    let t = 0;
    return lines.map((text) => {
      const n = words(text.replace(/\*/g, '')).length;
      const dur = round2(clamp(0.42 * n + 0.4, 0.9, 2.2));
      const cue = { start: round2(t), end: round2(t + dur), text, color };
      t += dur;
      return cue;
    });
  }

  function shortTopic(topic) {
    return words(topic).map(cleanWord).filter(Boolean).slice(0, 3).join(' ').toUpperCase();
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  /* ---------------- Mode A ---------------- */
  function fromTopic({ topic, lang, tone, color }) {
    const L = lang === 'auto' || !lang ? detectLanguage(topic) : lang;
    const Tn = tone === 'auto' || !tone ? detectTone(topic) : tone;
    const bank = CG.T[L];
    const fill = (s) => s.replace(/\{t\}/g, topic.trim()).replace(/\{T\}/g, shortTopic(topic));

    const isSentence = words(topic).length >= 5;
    const hook = isSentence ? capitalize(topic.trim()) : fill(rand(bank.hooks[Tn]));
    const line2 = rand(bank.lines[Tn]);

    const screen = bank.screen[Tn].map(fill);
    if (isSentence) screen[1] = markMoney(words(topic).slice(0, 4).join(' ').toUpperCase(), L);

    return {
      lang: L,
      tone: Tn,
      caption: captionLines([hook, line2], Tn),
      cta: bank.cta[CG.TONE_CTA[Tn]],
      hashtags: buildHashtags(topic, Tn, L),
      emojis: pickEmojis(Tn),
      cues: timeCues(screen, toneColor(Tn, color)),
    };
  }

  /* ---------------- Transcript parsing ---------------- */
  const TS = '(?:\\d{1,2}:)?\\d{1,2}:\\d{2}(?:[.,]\\d{1,3})?|\\d+(?:\\.\\d+)?';
  const TSC = '(?:\\d{1,2}:)?\\d{1,2}:\\d{2}(?:[.,]\\d{1,3})?';
  const RANGE_RE = new RegExp(`^\\s*\\[?\\s*(${TS})\\s*s?\\s*(?:-->|–|—|-|to)\\s*(${TS})\\s*s?\\s*\\]?\\s*(.*)$`);
  const SINGLE_RE = new RegExp(`^\\s*\\[?\\s*(${TSC})\\s*\\]?\\s*[-–:]?\\s*(.+)$`);

  function toSec(ts) {
    const parts = ts.replace(',', '.').split(':').map(parseFloat);
    return parts.reduce((acc, p) => acc * 60 + p, 0);
  }

  function parseTranscript(raw) {
    const segs = [];
    let cur = null;
    for (const line of (raw || '').split(/\r?\n/)) {
      const l = line.trim();
      if (!l) { cur = null; continue; }
      if (/^\d+$/.test(l)) continue;
      let m = l.match(RANGE_RE);
      if (m) {
        cur = { start: toSec(m[1]), end: toSec(m[2]), text: m[3] || '' };
        segs.push(cur);
        continue;
      }
      m = l.match(SINGLE_RE);
      if (m) {
        cur = { start: toSec(m[1]), end: null, text: m[2] };
        segs.push(cur);
        continue;
      }
      if (cur) cur.text += ` ${l}`;
      else segs.push((cur = { start: null, end: null, text: l }));
    }

    const timed = segs.some((s) => s.start !== null);
    const out = [];
    if (!timed) {
      let t = 0.2;
      for (const w of words(segs.map((s) => s.text).join(' '))) {
        out.push({ w, start: round2(t), end: round2(t + 0.34) });
        t += 0.37;
      }
      return { words: out, text: segs.map((s) => s.text).join(' '), timed: false };
    }

    segs.forEach((s, i) => {
      if (s.start === null) s.start = i > 0 ? segs[i - 1].end ?? segs[i - 1].start : 0;
      if (s.end === null) {
        const next = segs.slice(i + 1).find((x) => x.start !== null);
        s.end = next ? next.start : s.start + Math.max(1, words(s.text).length * 0.37);
      }
      const ws = words(s.text);
      const step = ws.length ? (s.end - s.start) / ws.length : 0;
      ws.forEach((w, j) => out.push({
        w,
        start: round2(s.start + j * step),
        end: round2(s.start + (j + 1) * step),
        segEnd: j === ws.length - 1,
      }));
    });
    return { words: out, text: segs.map((s) => s.text).join(' '), timed: true };
  }

  /* ---------------- Mode B ---------------- */
  function markMoney(text, lang) {
    if (text.includes('*')) return text;
    const ws = words(text);
    let bestIdx = -1;
    let bestScore = -1;
    ws.forEach((w, i) => {
      const c = cleanWord(w).toLowerCase();
      if (!c || STOP.has(c)) return;
      let score = c.length;
      if (CTA_WORDS.some((k) => c.startsWith(k))) score += 50;
      if (/\d/.test(c)) score += 6;
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    if (bestIdx < 0) bestIdx = ws.length - 1;
    ws[bestIdx] = `*${ws[bestIdx]}*`;
    return ws.join(' ');
  }

  /** Split into phrase runs (punctuation, pauses, segment ends), then balance each run into 2–4 word groups. */
  function groupWords(ws) {
    const runs = [];
    let cur = [];
    ws.forEach((w, i) => {
      cur.push(w);
      const next = ws[i + 1];
      const gap = next ? next.start - w.end : 0;
      if (!next || w.segEnd || /[.!?,;:।…]$/.test(w.w) || gap > 0.6) {
        runs.push(cur);
        cur = [];
      }
    });

    const groups = [];
    runs.forEach((run) => {
      const prev = groups[groups.length - 1];
      if (run.length === 1 && prev && prev.length < 4) {
        prev.push(run[0]);
        return;
      }
      const k = Math.ceil(run.length / 4);
      const base = Math.floor(run.length / k);
      let extra = run.length % k;
      let idx = 0;
      for (let j = 0; j < k; j++) {
        const size = base + (extra-- > 0 ? 1 : 0);
        groups.push(run.slice(idx, idx + size));
        idx += size;
      }
    });
    return groups;
  }

  function selectGroups(groups) {
    if (groups.length <= 12) return groups.map((g, i) => ({ g, i }));
    const scored = groups.map((g, i) => {
      const txt = g.map((x) => x.w).join(' ').toLowerCase();
      let s = Math.max(...g.map((x) => cleanWord(x.w).length));
      if (i === 0) s += 100;
      if (i === groups.length - 1) s += 80;
      if (/[!?]/.test(txt)) s += 6;
      if (CTA_WORDS.some((k) => txt.includes(k))) s += 50;
      if (/\d/.test(txt)) s += 4;
      return { g, i, s };
    });
    return scored.sort((a, b) => b.s - a.s).slice(0, 12).sort((a, b) => a.i - b.i);
  }

  function fromTranscript({ raw, lang, tone, color, words: givenWords, text: givenText }) {
    const parsed = givenWords ? { words: givenWords, text: givenText } : parseTranscript(raw);
    const text = parsed.text.replace(/\s+/g, ' ').trim();
    const L = lang === 'auto' || !lang ? detectLanguage(text) : lang;
    const Tn = tone === 'auto' || !tone ? detectTone(text) : tone;
    const bank = CG.T[L];

    const sentences = text.split(/(?<=[.!?।])\s+/).map((s) => s.trim()).filter(Boolean);
    const trim = (s, n = 12) => { const w = words(s); return w.length > n ? `${w.slice(0, n).join(' ')}…` : s; };
    const hook = trim(sentences[0] || text);
    const punch = sentences.slice(1).find((s) => s.includes('!')) || (sentences.length > 1 ? sentences[sentences.length - 1] : null);

    const groups = selectGroups(groupWords(parsed.words));
    const col = toneColor(Tn, color);
    const cues = groups.map(({ g }, k) => {
      const start = g[0].start;
      const nextStart = groups[k + 1] ? groups[k + 1].g[0].start : Infinity;
      const end = Math.min(Math.max(g[g.length - 1].end + 0.25, start + 0.6), nextStart);
      const phrase = g.map((x) => x.w.replace(/[,;:।…]+$/u, '').replace(/\.+$/, '')).join(' ').toUpperCase();
      return { start: round2(start), end: round2(end), text: markMoney(phrase, L), color: col };
    });

    const kw = topicFromText(text);
    return {
      lang: L,
      tone: Tn,
      caption: captionLines([hook, trim(punch || rand(bank.lines[Tn]))], Tn),
      cta: bank.cta[CG.TONE_CTA[Tn]],
      hashtags: buildHashtags(kw, Tn, L),
      emojis: pickEmojis(Tn),
      cues,
    };
  }

  function topicFromText(text) {
    const freq = new Map();
    for (const w of words(text)) {
      const c = cleanWord(w).toLowerCase();
      if (c.length < 4 || STOP.has(c)) continue;
      freq.set(c, (freq.get(c) || 0) + 1);
    }
    return [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, 2).map((e) => e[0]).join(' ');
  }

  function toSrt(cues) {
    const fmt = (s) => {
      const ms = Math.round(s * 1000);
      const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
      const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
      const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
      const milli = String(ms % 1000).padStart(3, '0');
      return `${h}:${m}:${sec},${milli}`;
    };
    return cues.map((c, i) => `${i + 1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text.replace(/\*/g, '')}\n`).join('\n');
  }

  CG.Gen = { detectLanguage, detectTone, fromTopic, fromTranscript, parseTranscript, markMoney, toneColor, toSrt, timeCues };
})();
