const splashScreen = document.getElementById("splash-screen");
const invitation = document.getElementById("invitation");
const skipLink = document.querySelector(".skip-link");

invitation.inert = true;
skipLink.inert = true;

window.setTimeout(() => {
  splashScreen.classList.add("is-hidden");
  document.body.classList.remove("is-splashing");
  invitation.inert = false;
  skipLink.inert = false;

  splashScreen.addEventListener("transitionend", () => splashScreen.remove(), {
    once: true,
  });
}, 2000);
