import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function Vehicle360({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.vehicle360__copy', { x: -50, opacity: 0 }, { x: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 50%', scrub: 1 } });
      gsap.fromTo('.vehicle360__video', { scale: .94, opacity: 0 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 50%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="vehicle360 section-dark">
      <div className="vehicle360__copy container">
        <p className="eyebrow">06 / FORM</p>
        <h2>ONE<br />FORM.</h2>
      </div>
      <div className="vehicle360__visual">
        <video className="vehicle360__video" autoPlay muted loop playsInline preload="metadata" poster={asset('images','image-01-Master-Front34.jpeg')}>
          <source src={asset('videos','360-degree.mp4')} type="video/mp4" />
        </video>
        <div className="vehicle360__labels mono"><span>ROAD</span><span>AIR</span><span>WATER</span></div>
      </div>
    </section>
  );
}
