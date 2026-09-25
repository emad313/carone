# CARONE — Cinematic React + GSAP Experience

Production-oriented Vite/React/GSAP implementation based on the supplied development specification.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Supplied assets

The application references the exact filenames from the specification. Copy the supplied asset files into:

```text
public/assets/images/
public/assets/videos/
public/assets/transformation/
```

Expected filenames are listed in the specification and are intentionally not renamed or replaced.

## Structure

```text
carone/
├── package.json
├── index.html
├── README.md
├── public/
│   └── assets/
│       ├── images/
│       ├── videos/
│       └── transformation/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── ForwardReveal.jsx
    │   ├── MorphExperience.jsx
    │   ├── Interior.jsx
    │   ├── InteriorDetails.jsx
    │   ├── Engine.jsx
    │   ├── Vehicle360.jsx
    │   ├── WheelSection.jsx
    │   ├── HeadlightSection.jsx
    │   ├── FinalStatement.jsx
    │   └── Footer.jsx
    └── styles/
        ├── global.css
        └── site.css
```

## Notes

- Road / Air / Water is a pinned GSAP ScrollTrigger timeline built from the five supplied PNG transformation assets, converted to WebP (`road/air/water/water-jet.webp`). `png-04-air-wing.png` is an exploded view, so it is split into `wing-front/side/rear.webp`; each part animates along its own explode axis onto the car. The original PNGs are kept as sources.
- A loader covers the page until fonts, the hero video and the first frames of the following sections are ready (max 7s), then reveals the hero.
- Hero, engine, 360°, wheel and headlight sections use the specified videos.
- No product specifications are invented in the UI.
- Reduced-motion support skips the cinematic ScrollTrigger sequences while leaving the content available normally.
- The implementation uses semantic sections, lazy loading for secondary imagery, responsive positioning, and transform/opacity-based animation where practical.

### Scroll-scrubbed sequences

The `ForwardReveal` (02), `Vehicle360` (06) and `HeadlightSection` (08) sections scrub `video-02.mp4`, `360-degree.mp4` and `headlight.mp4` on scroll. Because seeking an H.264 video by `currentTime` stutters (the file has very few keyframes), each video is pre-extracted to 240 JPEG frames (10s @ 24fps) that are drawn to a `<canvas>` (see `src/components/frameSequence.js`):

```text
public/assets/sequence/forward/frame-001.jpg … frame-240.jpg   (video-02.mp4)
public/assets/sequence/360/frame-001.jpg … frame-240.jpg       (360-degree.mp4)
public/assets/sequence/headlight/frame-001.jpg … frame-240.jpg (headlight.mp4)
```

Each second of footage maps to a fixed amount of scroll (0.6, 0.5 and 0.3 viewport heights respectively). To regenerate frames after replacing a video:

```bash
ffmpeg -i public/assets/videos/video-02.mp4 -q:v 5 -start_number 1 public/assets/sequence/forward/frame-%03d.jpg
```
