import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function FinalStatement({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.final__image', { scale: 1.12, opacity: .35 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 } });
      gsap.fromTo('.final__copy', { y: 50, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="final media-section section-dark">
      <img className="final__image media-cover" src={asset('images','image-14-master34-postion.jpeg')} alt="Amphibious vehicle in a dark environment" loading="lazy" />
      <div className="media-section__veil" />
      <div className="final__copy container"><p className="eyebrow">ROAD / AIR / WATER</p><h2>BEYOND<br />THE ROAD.</h2><p className="mono">© 2026</p></div>
    </section>
  );
}
