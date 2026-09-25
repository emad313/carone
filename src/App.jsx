import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Loader from './components/Loader';
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
  const [revealed, setRevealed] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  // Always start at the top behind the loader; scrolling is locked until the
  // hero is revealed.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !revealed);
    if (revealed) window.lenis?.start();
    else window.lenis?.stop();
  }, [revealed]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  // One smooth-scroll engine drives the whole page. Lenis is stepped from GSAP's
  // ticker so scroll position and every ScrollTrigger update land in the same
  // frame; lagSmoothing(0) stops GSAP from "catching up" after a slow frame.
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      autoRaf: false,
      anchors: { offset: 0 },
    });

    window.lenis = lenis;
    if (document.documentElement.classList.contains('is-loading')) lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      delete window.lenis;
      lenis.destroy();
    };
  }, [reducedMotion]);

  // Ambient looping videos only decode while on screen. Five full-screen videos
  // playing at once off-screen is the main source of dropped frames elsewhere.
  useEffect(() => {
    const videos = Array.from(appRef.current.querySelectorAll('video[data-inview]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => {});
        else target.pause();
      });
    }, { rootMargin: '25% 0px' });
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

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
    <div ref={appRef} className={`site${reducedMotion ? ' reduced-motion' : ''}${revealed ? '' : ' is-loading'}`}>
      {!loaderDone && (
        <Loader reducedMotion={reducedMotion} onReveal={() => setRevealed(true)} onDone={() => setLoaderDone(true)} />
      )}
      <Navbar />
      <main>
        <Hero reducedMotion={reducedMotion} revealed={revealed} />
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
