import { asset } from '../App';

// Scroll-scrubbed footage is served as a pre-extracted JPEG sequence drawn to a
// canvas. Seeking an H.264 <video> by currentTime stutters because the source
// files have only a handful of keyframes; still frames scrub perfectly in both
// directions. Regenerate with:
//   ffmpeg -i video.mp4 -q:v 5 -start_number 1 public/assets/sequence/<name>/frame-%03d.jpg
export const frameSrc = (folder, i) => asset(`sequence/${folder}`, `frame-${String(i + 1).padStart(3, '0')}.jpg`);

// Lazily loads `count` frames from `folder` and draws them object-fit: cover
// into `canvas`. Returns { seek(index), destroy() }.
export function createFrameSequence(canvas, folder, count) {
  const context = canvas.getContext('2d', { alpha: false });
  const frames = new Array(count);
  const loaded = new Uint8Array(count);
  let current = 0;
  let drawn = -1;
  let cancelled = false;

  // Nearest frame that has finished loading, so scrubbing never shows a gap
  // while the sequence is still streaming in.
  const nearestLoaded = (index) => {
    for (let d = 0; d < count; d += 1) {
      if (loaded[index - d]) return index - d;
      if (loaded[index + d]) return index + d;
    }
    return -1;
  };

  const draw = () => {
    const i = nearestLoaded(current);
    if (i < 0 || i === drawn) return;
    const img = frames[i];
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    context.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    drawn = i;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    drawn = -1; // resizing clears the canvas
    draw();
  };

  // Frame 0 first, then coarse-to-fine passes (every 16th, 8th, ... frame) so the
  // whole clip is scrubbable early and gains detail as the rest arrives.
  const order = [];
  const seen = new Set();
  [16, 8, 4, 2, 1].forEach((step) => {
    for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  });
  let cursor = 0;
  const loadNext = () => {
    if (cancelled || cursor >= order.length) return;
    const i = order[cursor++];
    const img = new Image();
    img.decoding = 'async';
    img.src = frameSrc(folder, i);
    frames[i] = img;
    img.decode()
      .then(() => {
        if (cancelled) return;
        loaded[i] = 1;
        if (drawn < 0 || Math.abs(i - current) < Math.abs(drawn - current)) { drawn = -1; draw(); }
      })
      .catch(() => {})
      .finally(loadNext);
  };
  // Start downloading only once the section is within ~2 screens, so sequences
  // further down the page don't compete with the ones the visitor sees first.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    for (let n = 0; n < 6; n += 1) loadNext();
  }, { rootMargin: '200% 0px' });
  observer.observe(canvas);

  window.addEventListener('resize', resize);
  resize();

  return {
    seek(index) {
      current = Math.max(0, Math.min(count - 1, index));
      draw();
    },
    destroy() {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', resize);
    }
  };
}
