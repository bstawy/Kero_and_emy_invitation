const splashScreen = document.getElementById("splash-screen");
const invitation = document.getElementById("invitation");
const skipLink = document.querySelector(".skip-link");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const heroRevealItems = [
  "#invitation .hero > .top-flourish",
  "#invitation .hero > .eyebrow",
  "#invitation .hero > h1",
  "#invitation .hero .childhood-photo",
  "#invitation .hero > .ticker",
].map((selector) => document.querySelector(selector));
const heroQuestion = document.querySelector("#invitation .hero-note-right");
const heroAnswer = document.querySelector("#invitation .hero-note-left");
const revealItems = document.querySelectorAll(
  [
    "#invitation section:not(.hero) > *:not(.outfits):not(.palette)",
    "#invitation .outfits > img",
    "#invitation .palette > span",
    "#invitation .closing > *",
  ].join(","),
);

const heroRevealDelays = [0, 80, 160, 240, 320];
const heroIntroDuration = 1100;
const questionTransitionFallback = 800;
const answerReadingPause = 1000;

heroRevealItems.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty(
    "--reveal-delay",
    `${heroRevealDelays[index]}ms`,
  );
});

[heroQuestion, heroAnswer].forEach((element) => element.classList.add("reveal"));

revealItems.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
});

const startRevealAnimations = () => {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    heroRevealItems.forEach((element) => element.classList.add("is-visible"));
    heroQuestion.classList.add("is-visible");
    heroAnswer.classList.add("is-visible");
    revealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealHeroConversation = () => {
    let answerScheduled = false;

    const scheduleAnswer = () => {
      if (answerScheduled) return;

      answerScheduled = true;
      window.setTimeout(() => {
        heroAnswer.classList.add("is-visible");
      }, answerReadingPause);
    };

    heroQuestion.addEventListener("transitionend", scheduleAnswer, {
      once: true,
    });
    heroQuestion.classList.add("is-visible");

    // Guarantees the answer sequence even if a browser suppresses transition events.
    window.setTimeout(scheduleAnswer, questionTransitionFallback);
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      heroRevealItems.forEach((element) => element.classList.add("is-visible"));
      window.setTimeout(revealHeroConversation, heroIntroDuration);
      heroObserver.disconnect();
    },
    { threshold: 0.05 },
  );

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

  heroObserver.observe(document.querySelector("#invitation .hero"));
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
