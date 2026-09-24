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

export default function MorphExperience({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const road = q('.morph__road')[0];
      const air = q('.morph__air')[0];
      const water = q('.morph__water')[0];
      const wing = q('.morph__wing')[0];
      const jet = q('.morph__jet')[0];
      const title = q('.morph__title')[0];
      const mode = q('.morph__mode')[0];
      const headline = q('.morph__headline')[0];
      const desc = q('.morph__desc')[0];
      const dots = q('.morph__dot');
      const setState = (index) => {
        const s = states[index];
        title.textContent = s.title;
        mode.textContent = s.label;
        headline.textContent = s.headline;
        desc.textContent = s.desc;
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      };
      setState(0);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=3500', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
      });
      tl.to({}, { duration: .55 })
        .to(road, { opacity: 0, scale: 1.035, duration: .75, ease: 'power2.inOut' })
        .to(wing, { opacity: 1, scale: 1, rotation: 0, duration: .38, ease: 'power2.out' }, '<.1')
        .to(air, { opacity: 1, scale: 1, duration: .65, ease: 'power2.out', onStart: () => setState(1) }, '<.08')
        .to(wing, { opacity: 0, duration: .28 }, '>-0.08')
        .to({}, { duration: .55 })
        .to(air, { opacity: 0, scale: 1.035, duration: .75, ease: 'power2.inOut' })
        .to(jet, { opacity: 1, scale: 1, duration: .35, ease: 'power2.out' }, '<.1')
        .to(water, { opacity: 1, scale: 1, duration: .65, ease: 'power2.out', onStart: () => setState(2) }, '<.08')
        .to(jet, { opacity: 0, duration: .28 }, '>-0.08')
        .to({}, { duration: .65 });
      gsap.to(q('.morph__technical'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '+=3500', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="morph section-dark" aria-label="Road, air and water modes">
      <div className="morph__ambient" />
      <div className="morph__vehicle" aria-hidden="true">
        <img className="morph__layer morph__road" src={asset('transformation','png-01-road.png')} alt="" />
        <img className="morph__layer morph__air" src={asset('transformation','png-01-air.png')} alt="" />
        <img className="morph__overlay morph__wing" src={asset('transformation','png-04-air-wing.png')} alt="" />
        <img className="morph__layer morph__water" src={asset('transformation','png-03-water.png')} alt="" />
        <img className="morph__overlay morph__jet" src={asset('transformation','png-05-water-jet.png')} alt="" />
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
