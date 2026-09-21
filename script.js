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

const splashTotalDuration = 2500;
const splashExitDuration = prefersReducedMotion ? 0 : 650;
const heroRevealDelays = [0, 360, 720, 1080, 1440].map(
  (delay) => delay + splashExitDuration,
);
const heroIntroDuration = 2900 + splashExitDuration;
const questionTransitionFallback = 1300;
const answerTransitionFallback = 1300;
const answerReadingPause = 150;

heroRevealItems.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${heroRevealDelays[index]}ms`);
});

[heroQuestion, heroAnswer].forEach((element) =>
  element.classList.add("reveal"),
);

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

  let followingSectionsStarted = false;

  const revealFollowingSections = () => {
    if (followingSectionsStarted) return;

    followingSectionsStarted = true;
    revealItems.forEach((element) => observer.observe(element));
  };

  const revealHeroConversation = () => {
    let answerScheduled = false;

    const scheduleAnswer = () => {
      if (answerScheduled) return;

      answerScheduled = true;
      window.setTimeout(() => {
        heroAnswer.addEventListener("transitionend", revealFollowingSections, {
          once: true,
        });
        heroAnswer.classList.add("is-visible");
      }, answerReadingPause);
    };

    heroQuestion.addEventListener("transitionend", scheduleAnswer, {
      once: true,
    });
    heroQuestion.classList.add("is-visible");

    // Guarantees the answer sequence even if a browser suppresses transition events.
    window.setTimeout(scheduleAnswer, questionTransitionFallback);
    window.setTimeout(
      revealFollowingSections,
      questionTransitionFallback +
        answerReadingPause +
        answerTransitionFallback,
    );
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

  heroObserver.observe(document.querySelector("#invitation .hero"));
};

invitation.inert = true;
skipLink.inert = true;

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
