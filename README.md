# Amphibious Car — Cinematic React + GSAP Experience

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
amphibious-car/
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

- Road / Air / Water is a pinned GSAP ScrollTrigger timeline using the five supplied PNG transformation assets; it does not use video.
- Hero, engine, 360°, wheel and headlight sections use the specified videos.
- No product specifications are invented in the UI.
- Reduced-motion support skips the cinematic ScrollTrigger sequences while leaving the content available normally.
- The implementation uses semantic sections, lazy loading for secondary imagery, responsive positioning, and transform/opacity-based animation where practical.

### Forward Reveal video

The `ForwardReveal` section uses `public/assets/videos/video-02.mp4` as a scroll-controlled cinematic sequence. The section is pinned with GSAP ScrollTrigger, and the video's `currentTime` is mapped to scroll progress. The supporting copy changes through three stages while scrolling. Once the pinned timeline reaches 100%, normal scrolling continues into the Road / Air / Water section.

Make sure `video-02.mp4` is present at:

```text
public/assets/videos/video-02.mp4
```
