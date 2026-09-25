import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function Engine({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.engine__video', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.engine__copy', { y: 70, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section id="engineering" ref={root} className="engine media-section section-dark">
      <video className="engine__video media-cover" data-inview muted loop playsInline preload="metadata" poster={asset('images','image-10-engine.jpeg')}>
        <source src={asset('videos','engine-video.mp4')} type="video/mp4" />
      </video>
      <div className="media-section__veil" />
      <div className="engine__copy container">
        <p className="eyebrow">05 / POWER</p>
        <h2>THE<br />HEART.</h2>
        <p>Precision propulsion engineered for three worlds.</p>
      </div>
      <div className="engine__detail container">
        <img src={asset('images','image-11-engine-detail-view.jpeg')} alt="Engine detail" loading="lazy" />
        <div className="technical-list mono"><span>PROPULSION / SYSTEM</span><span>ENERGY / DISTRIBUTION</span><span>THERMAL / CONTROL</span><span>ADVANCED / DRIVE</span></div>
      </div>
    </section>
  );
}
