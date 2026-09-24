import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      tl.to('.hero__video', { scale: 1.12, opacity: 0, filter: 'blur(8px)', ease: 'none' }, 0)
        .to('.hero__copy', { y: -80, opacity: 0, ease: 'none' }, 0)
        .to('.hero__scroll', { opacity: 0, y: 20, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section id="top" ref={root} className="hero section-dark">
      <video className="hero__video media-cover" autoPlay muted loop playsInline preload="metadata" poster={asset('images','image-01-Master-Front34.jpeg')}>
        <source src={asset('videos','video-01.mp4')} type="video/mp4" />
      </video>
      <div className="hero__veil" />
      <div className="hero__copy container">
        <p className="eyebrow">NEXT GENERATION MOBILITY / 01</p>
        <h1>ONE<br /><span>MACHINE.</span></h1>
        <p className="hero__support">ROAD / AIR / WATER</p>
        <p className="hero__description">A vehicle designed to move beyond the road.</p>
      </div>
      <div className="hero__scroll mono"><span className="scroll-line" />SCROLL TO ENTER</div>
    </section>
  );
}
