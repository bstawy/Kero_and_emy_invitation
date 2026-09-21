const splashScreen = document.getElementById("splash-screen");
const invitation = document.getElementById("invitation");
const skipLink = document.querySelector(".skip-link");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const revealItems = document.querySelectorAll(
  [
    "#invitation section > *:not(.outfits):not(.palette)",
    "#invitation .outfits > img",
    "#invitation .palette > span",
    "#invitation .closing > *",
  ].join(","),
);

revealItems.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
});

const startRevealAnimations = () => {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealItems.forEach((element) => observer.observe(element));
};

invitation.inert = true;
skipLink.inert = true;

const splashTotalDuration = 2000;
const splashExitDuration = prefersReducedMotion ? 0 : 650;

window.setTimeout(() => {
  splashScreen.classList.add("is-hidden");
  startRevealAnimations();
}, splashTotalDuration - splashExitDuration);

window.setTimeout(() => {
  document.documentElement.classList.remove("is-splashing");
  document.body.classList.remove("is-splashing");
  invitation.inert = false;
  skipLink.inert = false;
  splashScreen.remove();
}, splashTotalDuration);
