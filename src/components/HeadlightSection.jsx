import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function HeadlightSection({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.headlight__image', { scale: 1.08, x: 20 }, { scale: 1, x: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.headlight__copy', { y: 50, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="headlight media-section section-dark">
      <img className="headlight__image media-cover" src={asset('images','image-13-headlight.jpeg')} alt="Vehicle headlight detail" loading="lazy" />
      <video className="headlight__video media-cover" autoPlay muted loop playsInline preload="metadata"><source src={asset('videos','headlight.mp4')} type="video/mp4" /></video>
      <div className="media-section__veil" />
      <div className="headlight__copy container"><p className="eyebrow">08 / VISION</p><h2>SEE<br />WHAT'S NEXT.</h2></div>
    </section>
  );
}
