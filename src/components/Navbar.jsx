import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="One Machine home">OM<span>/</span>01</a>
      <nav aria-label="Primary navigation">
        <a href="#vehicle">EXPLORE</a>
        <a href="#engineering">TECHNOLOGY</a>
        <a href="#contact">CONTACT</a>
      </nav>
    </header>
  );
}
