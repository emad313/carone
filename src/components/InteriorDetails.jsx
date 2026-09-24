import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset } from '../App';

gsap.registerPlugin(ScrollTrigger);
const cards = [
  ['image-08-dashboard.jpeg','CONTROL','EVERYTHING IN REACH.','Dashboard detail'],
  ['image-07-streering.jpeg','INTERFACE','INTUITIVE BY DESIGN.','Steering detail'],
  ['image-09-seat.jpeg','COMFORT','FORM MEETS FUNCTION.','Seat detail']
];

export default function InteriorDetails({ reducedMotion }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.detail-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);
  return (
    <section ref={root} className="details section-dark">
      <div className="container details__head">
        <p className="eyebrow">INTERIOR DETAILS</p>
        <p className="details__intro">A restrained interface built around visibility, control and movement.</p>
      </div>
      <div className="container details__grid">
        {cards.map(([image, label, title, alt]) => (
          <article className="detail-card" key={image}>
            <div className="detail-card__image-wrap"><img className="detail-card__image" src={asset('images', image)} alt={alt} loading="lazy" /></div>
            <div className="detail-card__copy"><p className="eyebrow">{label}</p><h3>{title}</h3></div>
          </article>
        ))}
      </div>
    </section>
  );
}
