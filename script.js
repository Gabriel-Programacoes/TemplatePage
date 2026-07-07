const root = document.documentElement;
const heroImage = document.querySelector(".hero-media img");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mapFrame = document.querySelector(".map-frame iframe[data-src]");

const revealTargets = [
  ...document.querySelectorAll(
    ".section-heading, .service-card, .reviews-band, .review-card, .about-section, .contact-panel, .map-frame"
  ),
];

revealTargets.forEach((element, index) => {
  element.classList.add("fade-card");
  element.style.transitionDelay = `${Math.min(index * 70, 360)}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealTargets.forEach((element) => revealObserver.observe(element));

if (mapFrame) {
  const mapObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mapFrame.src = mapFrame.dataset.src;
          mapObserver.disconnect();
        }
      });
    },
    {
      rootMargin: "320px 0px",
    }
  );

  mapObserver.observe(mapFrame);
}

let ticking = false;

function updateScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  root.style.setProperty("--scroll-progress", `${progress}%`);

  if (heroImage && !reduceMotion.matches && window.innerWidth > 768) {
    const parallax = Math.min(scrollTop * 0.22, 130);
    root.style.setProperty("--parallax-y", `${parallax}px`);
  } else {
    root.style.setProperty("--parallax-y", "0px");
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

updateScrollEffects();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
