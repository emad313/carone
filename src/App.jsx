import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ForwardReveal from './components/ForwardReveal';
import MorphExperience from './components/MorphExperience';
import Interior from './components/Interior';
import InteriorDetails from './components/InteriorDetails';
import Engine from './components/Engine';
import Vehicle360 from './components/Vehicle360';
import WheelSection from './components/WheelSection';
import HeadlightSection from './components/HeadlightSection';
import FinalStatement from './components/FinalStatement';
import Footer from './components/Footer';

export const ASSET_BASE = '/assets';
export const asset = (folder, file) => `${ASSET_BASE}/${folder}/${file}`;

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const appRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  // One smooth-scroll engine drives the whole page. ScrollTrigger receives
  // Lenis' smoothed scroll position, so wheel/touch movement stays cinematic
  // without fighting the browser's native scrolling.
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.05,
      syncTouch: false,
      autoRaf: false,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      delete window.lenis;
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });
      const images = Array.from(document.images);
      let pending = images.length;
      if (!pending) refresh();
      images.forEach((img) => {
        if (img.complete) {
          pending -= 1;
          if (!pending) refresh();
        } else {
          img.addEventListener('load', () => { pending -= 1; if (!pending) refresh(); }, { once: true });
          img.addEventListener('error', () => { pending -= 1; if (!pending) refresh(); }, { once: true });
        }
      });
      return () => window.removeEventListener('load', refresh);
    }, appRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className={reducedMotion ? 'site reduced-motion' : 'site'}>
      <Navbar />
      <main>
        <Hero reducedMotion={reducedMotion} />
        <ForwardReveal reducedMotion={reducedMotion} />
        <MorphExperience reducedMotion={reducedMotion} />
        <Interior reducedMotion={reducedMotion} />
        <InteriorDetails reducedMotion={reducedMotion} />
        <Engine reducedMotion={reducedMotion} />
        <Vehicle360 reducedMotion={reducedMotion} />
        <WheelSection reducedMotion={reducedMotion} />
        <HeadlightSection reducedMotion={reducedMotion} />
        <FinalStatement reducedMotion={reducedMotion} />
      </main>
      <Footer />
    </div>
  );
}
