/* Motion is progressive enhancement: native scrolling and readable static content remain. */
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let customMotion = null;
try {
  customMotion = localStorage.getItem("otis-motion");
} catch {}
let motionEnabled = !motionPreference.matches && customMotion !== "off";
const motionToggle = document.querySelector(".motion-toggle");
const activeAnimations = new Set();
function animateElement(element, keyframes, options = {}) {
  if (!motionEnabled || !element) return null;
  const animation = element.animate(keyframes, {
    duration: 850,
    easing: "cubic-bezier(.22,1,.36,1)",
    ...options,
  });
  activeAnimations.add(animation);
  animation.finished
    .catch(() => {})
    .finally(() => activeAnimations.delete(animation));
  return animation;
}
function updateMotion() {
  document.body.classList.toggle("motion-off", !motionEnabled);
  motionToggle.setAttribute("aria-pressed", String(motionEnabled));
  motionToggle.setAttribute(
    "aria-label",
    motionEnabled ? "Turn animations off" : "Turn animations on",
  );
  motionToggle.querySelector("span").textContent = motionEnabled ? "on" : "off";
  if (!motionEnabled) {
    activeAnimations.forEach((a) => a.cancel());
    document
      .querySelectorAll("[data-motion-transform]")
      .forEach((el) => (el.style.transform = ""));
  }
  scheduleScroll();
  window.dispatchEvent(new Event("portfolio:motionchange"));
}
motionToggle.addEventListener("click", () => {
  motionEnabled = !motionEnabled;
  try {
    localStorage.setItem("otis-motion", motionEnabled ? "on" : "off");
  } catch {}
  updateMotion();
});
motionPreference.addEventListener("change", () => {
  motionEnabled = !motionPreference.matches;
  updateMotion();
});

const dock = document.createElement("nav");
dock.className = "chapter-dock";
dock.setAttribute("aria-label", "Page chapters");
dock.innerHTML =
  '<span>THE NOTEBOOK</span><i class="dock-divider" aria-hidden="true"></i><a href="#work">Work</a><a href="#experience">Experience</a><a href="#journey">Journey</a><a href="#about">Otis</a><a href="#contact">Hello ↗</a>';
document.body.append(dock);
const sections = [
  ...document.querySelectorAll("#work,#experience,#journey,#about,#contact"),
];
const header = document.querySelector(".header");
const hero = document.querySelector(".restored-hero");
const heroPhoto = document.querySelector(".restored-hero .photo-frame");
const statement = document.querySelector(".moving-statement");
const track = document.querySelector(".statement-track");
const skillsOrbit = document.querySelector(".skills-orbit");
[heroPhoto, track].forEach((el) => (el.dataset.motionTransform = ""));
let scrollFrame = 0;
function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}
function updateScroll() {
  scrollFrame = 0;
  const y = window.scrollY,
    height = window.innerHeight;
  const max = document.documentElement.scrollHeight - height;
  header.classList.toggle("is-scrolled", y > 45);
  dock.classList.toggle(
    "is-visible",
    y > hero.offsetHeight * 0.75 && y < max - 180,
  );
  let current = null;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top < height * 0.45)
      current = section.id;
  });
  document.querySelectorAll(".header nav a,.chapter-dock a").forEach((a) => {
    if (a.hash === `#${current}`) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
  if (!motionEnabled) return;
  if (window.innerWidth > 700 && hero.getBoundingClientRect().bottom > 0) {
    const shift = Math.min(y * 0.035, 22);
    heroPhoto.style.transform = `translateY(${shift}px) rotate(${3 - Math.min(y * 0.002, 1)}deg)`;
  } else if (window.innerWidth <= 700) {
    heroPhoto.style.transform = "";
  }
  const sr = statement.getBoundingClientRect();
  if (sr.bottom > 0 && sr.top < height)
    track.style.transform = `translateX(${-Math.max(0, height - sr.top) * 0.22}px)`;
  const ar = skillsOrbit.getBoundingClientRect();
  if (ar.bottom > 0 && ar.top < height) {
    const turn = (height * .55 - ar.top) * .045;
    skillsOrbit.style.setProperty('--orbit-turn', `${turn}deg`);
    skillsOrbit.style.setProperty('--orbit-back', `${-turn}deg`);
    skillsOrbit.style.setProperty('--inner-turn', `${-turn * .7}deg`);
    skillsOrbit.style.setProperty('--inner-back', `${turn * .7}deg`);
  }
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll, { passive: true });
updateMotion();
const reveals = document.querySelectorAll(
  ".section-heading h2,.section-heading>p,.experience-photo,.experience-copy,.field-notes-title,.community,.about-copy,.contact-bottom",
);
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const rest = getComputedStyle(entry.target).transform;
        animateElement(
          entry.target,
          [
            {
              transform: `translateY(30px) ${rest === "none" ? "" : rest}`,
              opacity: 0.4,
            },
            { transform: rest, opacity: 1 },
          ],
          { duration: 850 },
        );
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.13 },
);
reveals.forEach((el) => revealObserver.observe(el));
// Each journal story enters from its own side; text follows the photograph.
const journalObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const direction =
        [...card.parentElement.children].indexOf(card) % 2 === 0 ? -1 : 1;
      const distance =
        window.innerWidth <= 700 ? 32 : Math.min(150, window.innerWidth * 0.11);
      [...card.children].forEach((part, index) => {
        animateElement(
          part,
          [
            { opacity: 0, transform: `translateX(${direction * distance}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          {
            duration: 1050,
            delay: index === 0 ? 0 : 90 + index * 55,
            fill: "backwards",
          },
        );
      });
      journalObserver.unobserve(card);
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -45px 0px" },
);
document
  .querySelectorAll(".journal-card")
  .forEach((card) => journalObserver.observe(card));
const photoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".photo-reel figure").forEach((figure, i) => {
          const rest = getComputedStyle(figure).transform;
          animateElement(
            figure,
            [
              { transform: `translateY(${25 + i * 20}px) rotate(0deg)` },
              { transform: rest },
            ],
            { duration: 1100, delay: i * 100 },
          );
        });
        photoObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);
photoObserver.observe(document.querySelector(".photo-reel"));
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".project-card")];
    cards.forEach((card) =>
      card.classList.toggle("is-filtered", button.dataset.filter !== "all"),
    );
    // Scroll-linked card transforms are managed by project-stack.js.
  }),
);
const projectDialog = document.querySelector("#project-dialog");
new MutationObserver(() => {
  if (projectDialog.open)
    animateElement(
      projectDialog,
      [
        { opacity: 0, transform: "translateY(35px) scale(.96)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 450 },
    );
}).observe(projectDialog, { attributes: true, attributeFilter: ["open"] });
// Reveal complete laid-out text in measured character steps: no layout jumps,
// no repeated announcements, and the original words remain selectable.
function typeHero() {
  if (!motionEnabled) return;
  let delay = 180;
  document.querySelectorAll(".type-run").forEach((line, index) => {
    // Measure real glyph boundaries so proportional letters never get sliced in half.
    const rect = line.getBoundingClientRect();
    const positions = [0];
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    let node;
    const range = document.createRange();
    range.setStart(line, 0);
    while ((node = walker.nextNode())) {
      let offset = 0;
      for (const character of Array.from(node.textContent)) {
        offset += character.length;
        range.setEnd(node, offset);
        positions.push(
          Math.min(
            100,
            Math.max(
              0,
              ((range.getBoundingClientRect().right - rect.left + 1) /
                rect.width) *
                100,
            ),
          ),
        );
      }
    }
    positions[positions.length - 1] = 100;
    const characters = positions.length - 1;
    const duration = index === 0 ? 650 : index === 1 ? 620 : 760;
    const frames = positions.map((position, i) => ({
      clipPath: `inset(-10% ${i === characters ? -3 : 100 - position}% -15% -3%)`,
      offset: i / characters,
      easing: "steps(1,end)",
    }));
    animateElement(line, frames, {
      duration,
      delay,
      easing: "linear",
      fill: "backwards",
    });
    const caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");
    line.append(caret);
    const animation = animateElement(
      caret,
      positions.map((position, i) => ({
        left: `${position}%`,
        opacity: 1,
        offset: i / characters,
        easing: "steps(1,end)",
      })),
      { duration, delay, easing: "linear", fill: "none" },
    );
    animation?.finished.catch(() => {}).finally(() => caret.remove());
    delay += duration + 120;
  });
  animateElement(
    document.querySelector(".restored-hero .hero-visual"),
    [
      { transform: "translateY(18px)", opacity: 0.6 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 1000, delay: 100 },
  );
}
// Begin promptly; the reveal never holds navigation or the photograph behind a loader.
Promise.race([
  document.fonts.ready,
  new Promise((resolve) => setTimeout(resolve, 300)),
]).then(typeHero);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    activeAnimations.forEach((a) => a.finish());
    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
  } else scheduleScroll();
});
