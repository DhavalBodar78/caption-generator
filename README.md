# ReelCaption Studio

Viral caption generator and on-screen typography designer for Instagram Reels, TikTok, YouTube Shorts and Facebook Reels.

## Run

No install needed. Open `index.html` in **Chrome or Edge (v126+)**.
(Optional: serve the folder, e.g. `npx serve .` or `python -m http.server`.)

## Features

- **Mode A – Topic:** type an idea and get the caption, CTA, 3–5 hashtags, emojis and timed on-screen text.
- **Mode B – Media:** paste a transcript (plain text, `0.00–1.10 text`, `[0:05] text` or SRT). Upload a video/audio file to preview the captions over it, or transcribe it with Whisper (word-level timestamps) if an OpenAI key is set.
- **Languages:** English, Hindi (Devanagari), Gujarati (ગુજરાતી), Hinglish, Gujlish. Language is auto-detected and is never switched unless you choose another.
- **Tones:** Funny, Savage, Motivational, Emotional, Roast, Storytelling, Informative, Trendy.
- **Typography:** ALL CAPS, heavy bold, money word in yellow `#FFE500` or red `#FF2D2D` with the rest white, 8–12px black outline, 6px drop shadow, pop-in 60% → 105% → 100% in 0.2s with 60ms fades. Lower-third or centre placement inside the 70px side / 320px bottom safe zone.
- **Export:** black `#000000` and green `#00FF00` screen overlay videos, 1080×1920 at 30fps. Chrome/Edge save H.264 MP4; other browsers save WebM. Also exports `.srt`.
- Edit any on-screen line, timing or highlight colour live. Wrap the money word in `*stars*`.

## AI (optional)

Click **AI settings** and paste an OpenAI API key. The key is stored only in your browser's localStorage. Without a key, the built-in template engine is used.

## Notes

- Export renders in real time, so keep the tab visible until it finishes.
- Browsers cannot download from YouTube/TikTok/Instagram links. Paste the transcript or upload the downloaded file instead.
- To convert a WebM export to MP4: `ffmpeg -i in.webm -c:v libx264 -pix_fmt yuv420p -r 30 out.mp4`
