import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function Interior({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.interior__image', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.interior__copy', { y: 50, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="interior media-section section-dark">
      <img className="interior__image media-cover" src={asset('images','image-06-cockpit.jpeg')} alt="Futuristic vehicle cockpit interior" loading="lazy" />
      <div className="media-section__veil" />
      <div className="interior__copy container">
        <p className="eyebrow">04 / INSIDE</p>
        <h2>THE<br />COCKPIT.</h2>
        <p>Everything you need.<br />Nothing you don't.</p>
      </div>
    </section>
  );
}
