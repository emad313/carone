import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createFrameSequence, frameSrc } from './frameSequence';

gsap.registerPlugin(ScrollTrigger);

// video-02.mp4 (10s @ 24fps) scrubbed as an image sequence; see frameSequence.js.
const FRAME_COUNT = 240;
const FPS = 24;
const DURATION = FRAME_COUNT / FPS; // 10 seconds
const SCROLL_PER_SECOND = 0.6; // viewport heights of scroll per second of footage

// Copy beats keyed to what the footage shows at that moment (seconds).
const stages = [
  { from: 0, eyebrow: '02 / APPROACH', title: ['BUILT', 'FORWARD.'], body: ['Every line has a purpose.', 'Every surface is shaped around motion.'] },
  { from: 2.6, eyebrow: '02.1 / LIGHT', title: ['EYES ON', 'THE ROAD.'], body: ['A light signature that reads', 'the way ahead before you reach it.'] },
  { from: 5, eyebrow: '02.2 / SURFACE', title: ['SHAPED', 'BY AIR.'], body: ['Continuous surfaces guide the flow', 'from the nose to the tail.'] },
  { from: 7.8, eyebrow: '02.3 / PROFILE', title: ['PURE', 'MOTION.'], body: ['Low, wide and planted.', 'Designed to be seen moving.'] },
  { from: 9, eyebrow: '02.4 / DEPARTURE', title: ['READY', 'FOR MORE.'], body: ['The road is only the beginning.'] }
];

const formatTime = (s) => `00:${String(Math.min(Math.floor(s), 10)).padStart(2, '0')}`;

export default function ForwardReveal({ reducedMotion }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const timeRef = useRef(null);
  const fillRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || reducedMotion) return undefined;

    const sequence = createFrameSequence(canvas, 'forward', FRAME_COUNT);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const stageEls = q('.forward__stage');
      const ticks = q('.forward__tick');
      const playhead = { time: 0 };

      gsap.set(stageEls.slice(1), { autoAlpha: 0, y: 40 });

      // Timeline units are seconds of footage, so scroll maps 1:1 onto the video.
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
          sequence.seek(Math.round(t * FPS));
          if (timeRef.current) timeRef.current.textContent = formatTime(t);
          if (fillRef.current) fillRef.current.style.transform = `scaleY(${t / DURATION})`;
          const second = Math.floor(t);
          ticks.forEach((tick, i) => tick.classList.toggle('is-active', i <= second));
        }
      }, 0);

      // Slow push-in over the whole sequence for depth.
      tl.fromTo(canvas, { scale: 1.06 }, { scale: 1, duration: DURATION }, 0);

      // Cross-fade copy beats at their timestamps.
      stages.forEach((stage, i) => {
        if (i === 0) return;
        const prev = stageEls[i - 1];
        const next = stageEls[i];
        const at = stage.from - 0.3;
        tl.to(prev, { autoAlpha: 0, y: -40, duration: 0.35, ease: 'power2.in' }, at)
          .to(next, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at + 0.3);
      });
    }, section);

    return () => {
      sequence.destroy();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="vehicle"
      ref={sectionRef}
      className={`forward section-dark${reducedMotion ? ' forward--reduced' : ''}`}
      aria-label="02 Approach"
    >
      {reducedMotion ? (
        <img className="forward__canvas" src={frameSrc('forward', 150)} alt="Futuristic amphibious vehicle moving forward" />
      ) : (
        <canvas ref={canvasRef} className="forward__canvas" role="img" aria-label="Futuristic amphibious vehicle moving forward" />
      )}

      <div className="forward__veil" />

      <div className="forward__copy container">
        {(reducedMotion ? stages.slice(0, 1) : stages).map((stage) => (
          <div className="forward__stage" key={stage.eyebrow}>
            <p className="eyebrow">{stage.eyebrow}</p>
            <h2>{stage.title[0]}<br />{stage.title[1]}</h2>
            <p>{stage.body.map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}{line}</React.Fragment>)}</p>
          </div>
        ))}
      </div>

      {!reducedMotion && (
        <div className="forward__progress mono" aria-hidden="true">
          <span ref={timeRef} className="forward__time">00:00</span>
          <div className="forward__rail">
            <span ref={fillRef} className="forward__fill" />
            {Array.from({ length: 10 }, (_, i) => <span key={i} className={`forward__tick${i === 0 ? ' is-active' : ''}`} />)}
          </div>
          <span>00:10</span>
        </div>
      )}
    </section>
  );
}
