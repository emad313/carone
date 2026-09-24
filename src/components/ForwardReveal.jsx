import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

export default function ForwardReveal({ reducedMotion }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const progressDotRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reducedMotion) return undefined;

    // Ensure video is paused and muted
    video.muted = true;
    video.pause();

    // Prime frame 0 so the video is never black / empty on initial render
    const primeFrame = () => {
      if (video.currentTime === 0) {
        video.currentTime = 0.001;
      }
    };
    if (video.readyState >= 1) {
      primeFrame();
    } else {
      video.addEventListener('loadeddata', primeFrame, { once: true });
    }

    let targetTime = 0;
    let smoothTime = 0;
    let isSeeking = false;
    let rafId = null;

    // Silky smooth RAF loop:
    // Lerps smoothTime -> targetTime and updates video.currentTime with a seeking guard.
    // This allows buttery smooth scrubbing forward AND in reverse without decoder choke.
    const renderLoop = () => {
      const diff = targetTime - smoothTime;
      if (Math.abs(diff) > 0.001) {
        smoothTime += diff * 0.18;
      } else {
        smoothTime = targetTime;
      }

      // Only seek when the browser decoder has finished the previous seek
      if (!isSeeking && !video.seeking) {
        const delta = Math.abs(video.currentTime - smoothTime);
        if (delta > 0.02) {
          isSeeking = true;
          video.currentTime = smoothTime;
        }
      }

      // Visual progress dot scale
      const duration = video.duration || 10;
      if (progressDotRef.current) {
        const p = Math.min(Math.max(smoothTime / duration, 0), 1);
        progressDotRef.current.style.transform = `scale(${1.2 + p * 0.8})`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const onSeeked = () => {
      isSeeking = false;
    };
    video.addEventListener('seeked', onSeeked);

    // Start RAF loop immediately
    rafId = requestAnimationFrame(renderLoop);

    // Register ScrollTrigger synchronously in useLayoutEffect to preserve document order
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2400',
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const duration = video.duration || 10;
          // Progress goes 0 -> 1 on scroll down, 1 -> 0 on scroll back up
          targetTime = self.progress * duration;
        }
      });

      // Subtle parallax on text copy
      gsap.fromTo('.forward__copy',
        { y: 0, opacity: 0.9 },
        { y: -30, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: '+=2400', scrub: 1 } }
      );
    }, section);

    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadeddata', primeFrame);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="vehicle"
      ref={sectionRef}
      className={`forward section-dark${reducedMotion ? ' forward--reduced' : ''}`}
      aria-label="02 Approach"
    >
      <video
        ref={videoRef}
        className="forward__video"
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        loop={false}
        aria-label="Futuristic amphibious vehicle moving forward"
      >
        <source src={asset('videos', 'video-02.mp4')} type="video/mp4" />
      </video>

      <div className="forward__veil" />

      <div className="forward__copy container">
        <p className="eyebrow">02 / APPROACH</p>
        <h2>BUILT<br />FORWARD.</h2>
        <p>Every line has a purpose.<br />Every surface is shaped around motion.</p>
      </div>

      <div className="forward__progress mono" aria-hidden="true">
        <span>02</span>
        <span ref={progressDotRef} className="forward__dot is-active" />
      </div>
    </section>
  );
}
