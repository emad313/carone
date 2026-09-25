import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);

const states = [
  { key: 'road', title: 'ROAD.', label: 'ROAD MODE', headline: 'GROUND\nCONTROL.', desc: 'Four wheels. Low center of gravity. Maximum contact.' },
  { key: 'air', title: 'AIR.', label: 'AIR MODE', headline: 'RISE\nABOVE.', desc: 'Aerodynamic surfaces deploy as the vehicle leaves the ground.' },
  { key: 'water', title: 'WATER.', label: 'WATER MODE', headline: 'GO\nDEEPER.', desc: 'Sealed architecture and water propulsion turn the vehicle into a new kind of mobility.' }
];

// Every layer is a 2400x1340 canvas rendered from the same camera, so they
// stack pixel-aligned in one box. The air kit is split out of
// png-04-air-wing.png (an exploded view) into its three parts; `cx`/`cy` is
// each part's centre on that canvas, used to push it along its explode axis.
const CANVAS = { w: 2400, h: 1340 };
const CAR_CENTER = { x: 1252, y: 658 };
const wingParts = [
  { key: 'front', cx: 592, cy: 791 },
  { key: 'side', cx: 1547, cy: 793 },
  { key: 'rear', cx: 1814, cy: 412 }
];
// Offset (in % of the layer box) that moves a part `k` times further along the
// line from the car's centre through the part. k > 0 explodes, k < 0 mounts.
// Returned as per-target functions so one tween moves each part on its own axis.
const explode = (k) => ({
  xPercent: (i) => ((wingParts[i].cx - CAR_CENTER.x) / CANVAS.w) * 100 * k,
  yPercent: (i) => ((wingParts[i].cy - CAR_CENTER.y) / CANVAS.h) * 100 * k
});

export default function MorphExperience({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const [road] = q('.morph__road');
      const [air] = q('.morph__air');
      const [water] = q('.morph__water');
      const [jet] = q('.morph__jet');
      const parts = q('.morph__part');
      const [copy] = q('.morph__copy');
      const [title] = q('.morph__title');
      const [mode] = q('.morph__mode');
      const [headline] = q('.morph__headline');
      const [desc] = q('.morph__desc');
      const dots = q('.morph__dot');

      // Decode every layer up front so the first time one fades in doesn't stall
      // the main thread mid-scroll.
      q('.morph__stage img').forEach((img) => img.decode?.().catch(() => {}));

      let active = 0;
      // Mode text follows the timeline position, so it is correct whether the
      // user scrolls down or back up through the pin.
      const setState = (index) => {
        if (index === active) return;
        active = index;
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        gsap.killTweensOf(copy);
        gsap.timeline()
          .to(copy, { autoAlpha: 0, y: -14, duration: 0.18, ease: 'power2.in' })
          .add(() => {
            const s = states[index];
            title.textContent = s.title;
            mode.textContent = s.label;
            headline.textContent = s.headline;
            desc.textContent = s.desc;
          })
          .fromTo(copy, { y: 14 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power2.out' });
      };

      gsap.set([air, water, jet], { autoAlpha: 0 });
      gsap.set(parts, { autoAlpha: 0, ...explode(0.35) });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        },
        onUpdate: () => {
          const t = tl.time();
          setState(t >= tl.labels.water ? 2 : t >= tl.labels.air ? 1 : 0);
        }
      });

      tl.to({}, { duration: 0.5 })
        // AIR — the kit appears in its exploded layout around the road car...
        .to(road, { opacity: 0.45, duration: 0.5 }, 'explodeAir')
        .to(parts, { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 'explodeAir')
        .to({}, { duration: 0.2 })
        // ...then every part travels inward onto its mount as the air car resolves.
        .addLabel('air')
        .to(parts, { ...explode(-0.12), duration: 0.55, ease: 'power2.in' }, 'air')
        .to(parts, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 'air+=0.3')
        .to(air, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 'air+=0.25')
        .set(road, { autoAlpha: 0 })
        .to({}, { duration: 0.6 })
        // WATER — an x-ray pass of the propulsion module over the car...
        .to(air, { opacity: 0.45, duration: 0.45 }, 'xray')
        .fromTo(jet, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 0.9, scale: 1, duration: 0.55, ease: 'power3.out' }, 'xray')
        .to({}, { duration: 0.2 })
        // ...that settles into the sealed water body.
        .addLabel('water')
        .to(jet, { autoAlpha: 0, scale: 0.97, duration: 0.45, ease: 'power2.in' }, 'water')
        .to(water, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 'water+=0.15')
        .set(air, { autoAlpha: 0 })
        .to({}, { duration: 0.6 });

      gsap.to(q('.morph__technical'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * 4}`, scrub: 0.6 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  const layer = (file) => asset('transformation', file);

  return (
    <section ref={root} className="morph section-dark" aria-label="Road, air and water modes">
      <div className="morph__ambient" />
      <div className="morph__vehicle" aria-hidden="true">
        <div className="morph__stage">
          <img className="morph__layer morph__road" src={layer('road.webp')} alt="" />
          <img className="morph__layer morph__air" src={layer('air.webp')} alt="" />
          {wingParts.map((part) => (
            <img key={part.key} className="morph__layer morph__part" src={layer(`wing-${part.key}.webp`)} alt="" />
          ))}
          <img className="morph__layer morph__water" src={layer('water.webp')} alt="" />
          <img className="morph__layer morph__jet" src={layer('water-jet.webp')} alt="" />
        </div>
      </div>
      <div className="morph__technical">
        <div className="morph__copy">
          <p className="eyebrow morph__mode">ROAD MODE</p>
          <h2 className="morph__title">ROAD.</h2>
          <h3 className="morph__headline">GROUND<br />CONTROL.</h3>
          <p className="morph__desc">Four wheels. Low center of gravity. Maximum contact.</p>
        </div>
        <div className="morph__states mono" aria-label="Vehicle modes">
          {states.map((s, i) => <span key={s.key} className={`morph__dot ${i === 0 ? 'is-active' : ''}`}><b>0{i + 1}</b> {s.key.toUpperCase()}</span>)}
        </div>
        <div className="morph__rule" />
        <p className="morph__caption mono">ONE FORM / THREE WORLDS</p>
      </div>
    </section>
  );
}
