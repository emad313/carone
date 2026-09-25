import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ reducedMotion, revealed }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      tl.to('.hero__video', { scale: 1.12, opacity: 0, ease: 'none' }, 0)
        .to('.hero__copy', { y: -80, opacity: 0, ease: 'none' }, 0)
        .to('.hero__scroll', { opacity: 0, y: 20, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Intro as the loader wipes away. Animates the media wrapper and the copy's
  // children so it never fights the scroll timeline above.
  useLayoutEffect(() => {
    if (!revealed || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero__media', { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
        .fromTo('.hero__copy > *', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, stagger: 0.12 }, 0.35)
        .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.1);
    }, root);
    return () => ctx.revert();
  }, [revealed, reducedMotion]);

  return (
    <section id="top" ref={root} className="hero section-dark">
      <div className="hero__media">
        <video className="hero__video media-cover" data-inview autoPlay muted loop playsInline preload="auto">
          <source src={asset('videos','video-01.mp4')} type="video/mp4" />
        </video>
      </div>
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
