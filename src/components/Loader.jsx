import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { asset } from '../App';

const MIN_VISIBLE = 900; // ms — avoid a flash on fast/cached loads
const MAX_WAIT = 7000; // ms — never hold the visitor hostage to a slow asset

const whenImageReady = (src) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
};

const whenVideoReady = (video) => new Promise((resolve) => {
  if (!video || video.readyState >= 3) return resolve();
  video.addEventListener('canplay', resolve, { once: true });
  video.addEventListener('error', resolve, { once: true });
});

// Covers the page until the hero is actually ready to play (fonts, hero video,
// the first frames of the next sections), then wipes away. Calls onReveal as
// the wipe starts so the hero intro plays underneath it.
export default function Loader({ reducedMotion, onReveal, onDone }) {
  const root = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);

  useLayoutEffect(() => {
    let cancelled = false;
    const progress = { value: 0 };
    const render = () => {
      if (countRef.current) countRef.current.textContent = String(Math.round(progress.value)).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.value / 100})`;
    };

    const tasks = [
      document.fonts?.ready,
      whenVideoReady(document.querySelector('.hero__video')),
      whenImageReady(asset('transformation', 'road.webp')),
      whenImageReady(asset('sequence/forward', 'frame-001.jpg'))
    ].filter(Boolean);

    let done = 0;
    const advance = () => {
      done += 1;
      gsap.to(progress, { value: (done / tasks.length) * 100, duration: 0.6, ease: 'power2.out', onUpdate: render, overwrite: true });
    };
    tasks.forEach((task) => task.then(advance, advance));

    const ready = Promise.all([
      Promise.race([Promise.allSettled(tasks), new Promise((r) => setTimeout(r, MAX_WAIT))]),
      new Promise((r) => setTimeout(r, MIN_VISIBLE))
    ]);

    let tl;
    ready.then(() => {
      if (cancelled) return;
      tl = gsap.timeline({ onComplete: onDone });
      tl.to(progress, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: render, overwrite: true })
        .to('.loader__inner', { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=0.1')
        .add(onReveal);
      if (reducedMotion) tl.to(root.current, { autoAlpha: 0, duration: 0.3 });
      else tl.to(root.current, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' });
    });

    return () => {
      cancelled = true;
      tl?.kill();
      gsap.killTweensOf(progress);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading">
      <div className="loader__inner">
        <p className="loader__brand">CARONE<span>/</span>01</p>
        <div className="loader__bar"><span ref={barRef} /></div>
        <div className="loader__meta mono">
          <span>ROAD / AIR / WATER</span>
          <span ref={countRef}>000</span>
        </div>
      </div>
    </div>
  );
}
