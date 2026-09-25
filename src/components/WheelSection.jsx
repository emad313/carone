import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function WheelSection({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.wheel__image', { scale: .92, opacity: 0 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 1 } });
      gsap.fromTo('.wheel__copy', { y: 40, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="wheel section-dark">
      <div className="wheel__media"><img className="wheel__image" src={asset('images','image-12-tyre.jpeg')} alt="Vehicle tyre detail" loading="lazy" /><video data-inview muted loop playsInline preload="metadata"><source src={asset('videos','wheel.mp4')} type="video/mp4" /></video></div>
      <div className="wheel__copy container"><p className="eyebrow">07 / TRACTION</p><h2>GRIP<br />THE ROAD.</h2></div>
    </section>
  );
}
