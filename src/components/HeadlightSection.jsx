import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createFrameSequence, frameSrc } from './frameSequence';

gsap.registerPlugin(ScrollTrigger);

// headlight.mp4 (10s @ 24fps: dark → lights ignite) scrubbed as an image sequence.
const FRAME_COUNT = 240;
const FPS = 24;
const DURATION = FRAME_COUNT / FPS;
const SCROLL_PER_SECOND = 0.3; // viewport heights of scroll per second of footage

export default function HeadlightSection({ reducedMotion }) {
  const root = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const section = root.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || reducedMotion) return undefined;

    const sequence = createFrameSequence(canvas, 'headlight', FRAME_COUNT);

    const ctx = gsap.context(() => {
      const playhead = { time: 0 };
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
        onUpdate: () => sequence.seek(Math.round(playhead.time * FPS))
      }, 0)
        .fromTo(canvas, { scale: 1.08 }, { scale: 1, duration: DURATION }, 0)
        // Copy arrives as the lights come on (~5s into the footage).
        .fromTo('.headlight__copy > *', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, stagger: 0.25, ease: 'power2.out' }, 4.6)
        .fromTo('.headlight__line', { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 5.2);
    }, section);

    return () => {
      sequence.destroy();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={root} className="headlight section-dark">
      {reducedMotion ? (
        <img className="headlight__canvas" src={frameSrc('headlight', 200)} alt="Vehicle headlight detail" />
      ) : (
        <canvas ref={canvasRef} className="headlight__canvas" role="img" aria-label="Vehicle headlights switching on" />
      )}
      <div className="headlight__veil" />
      <div className="headlight__copy container">
        <p className="eyebrow">08 / VISION</p>
        <h2>SEE<br />WHAT'S NEXT.</h2>
        <span className="headlight__line" aria-hidden="true" />
        <p>Light that leads the way,<br />through dark, rain and spray.</p>
      </div>
    </section>
  );
}
