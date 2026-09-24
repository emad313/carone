import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="footer section-dark">
      <div className="container footer__main">
        <p className="eyebrow">NEXT GENERATION MOBILITY</p>
        <h2>MOVE<br />WITHOUT<br />LIMITS.</h2>
      </div>
      <div className="container footer__bottom">
        <nav aria-label="Footer navigation"><a href="#vehicle">VEHICLE</a><a href="#top">INTERIOR</a><a href="#engineering">ENGINEERING</a><a href="#contact">CONTACT</a></nav>
        <p className="mono">ROAD / AIR / WATER</p>
        <p className="mono">© 2026</p>
      </div>
    </footer>
  );
}
