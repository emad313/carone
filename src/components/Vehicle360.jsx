import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createFrameSequence, frameSrc } from './frameSequence';

gsap.registerPlugin(ScrollTrigger);

// 360-degree.mp4 (10s @ 24fps turntable) scrubbed as an image sequence.
const FRAME_COUNT = 240;
const FPS = 24;
const DURATION = FRAME_COUNT / FPS;
const SCROLL_PER_SECOND = 0.5; // viewport heights of scroll per second of footage

// Which side of the car faces the camera, by footage time (seconds).
const views = ['FRONT', 'PROFILE', 'REAR'];
const viewAt = (t) => (t < 1.5 || t >= 9.5 ? 0 : t >= 6.5 && t < 8 ? 2 : 1);

export default function Vehicle360({ reducedMotion }) {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const degreeRef = useRef(null);
  const ringRef = useRef(null);

  useLayoutEffect(() => {
    const section = root.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || reducedMotion) return undefined;

    const sequence = createFrameSequence(canvas, '360', FRAME_COUNT);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const labels = q('.vehicle360__labels span');
      const playhead = { time: 0 };
      let activeView = -1;

      // Reveal while the section scrolls into view, before the pin starts.
      gsap.fromTo('.vehicle360__copy', { x: -50, opacity: 0 }, { x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 75%', end: 'top top', scrub: 0.5 } });
      gsap.fromTo(canvas, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 80%', end: 'top top', scrub: 0.5 } });

      // Pinned turntable: timeline units are seconds of footage.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * SCROLL_PER_SECOND * DURATION}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(playhead, {
        time: DURATION,
        duration: DURATION,
        onUpdate: () => {
          const t = playhead.time;
          const p = t / DURATION;
          sequence.seek(Math.round(t * FPS));
          if (degreeRef.current) degreeRef.current.textContent = `${String(Math.round(p * 360)).padStart(3, '0')}°`;
          if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - p);
          const view = viewAt(t);
          if (view !== activeView) {
            activeView = view;
            labels.forEach((label, i) => label.classList.toggle('is-active', i === view));
          }
        }
      }, 0);
    }, section);

    return () => {
      sequence.destroy();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={root} className="vehicle360 section-dark">
      <div className="vehicle360__visual">
        {reducedMotion ? (
          <img className="vehicle360__canvas" src={frameSrc('360', 60)} alt="Vehicle turntable view" />
        ) : (
          <canvas ref={canvasRef} className="vehicle360__canvas" role="img" aria-label="Vehicle rotating through 360 degrees" />
        )}
      </div>
      <div className="vehicle360__copy container">
        <p className="eyebrow">06 / FORM</p>
        <h2>ONE<br />FORM.</h2>
        <p className="vehicle360__body">Every angle shaped as one<br />continuous surface.</p>
      </div>
      {!reducedMotion && (
        <div className="vehicle360__dial mono" aria-hidden="true">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" pathLength="1" className="vehicle360__track" />
            <circle ref={ringRef} cx="22" cy="22" r="20" pathLength="1" className="vehicle360__ring" />
          </svg>
          <span ref={degreeRef}>000°</span>
        </div>
      )}
      <div className="vehicle360__labels mono">
        {views.map((view, i) => <span key={view} className={i === 0 ? 'is-active' : ''}>{view}</span>)}
      </div>
    </section>
  );
}
