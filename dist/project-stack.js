/* Native sticky cards keep wheel, touch, keyboard, and reverse scrolling intact. */
const stackContainer = document.querySelector("#project-grid");
const stackCards = [...stackContainer.querySelectorAll(".project-card")];
const stackReduced = matchMedia("(prefers-reduced-motion: reduce)");
const stackShort = matchMedia("(max-height: 680px)");
let visibleStack = [];
let stackFrame = 0;
function stackEnabled() {
  return (
    !stackReduced.matches &&
    !stackShort.matches &&
    !document.body.classList.contains("motion-off")
  );
}
function refreshStack() {
  visibleStack = stackCards.filter((card) => !card.hidden);
  stackCards.forEach((card) => {
    card.classList.remove("stack-last", "is-covered");
    card.style.transform = "";
    card.style.filter = "";
    card
      .querySelectorAll("[data-project]")
      .forEach((button) => button.removeAttribute("tabindex"));
  });
  visibleStack.forEach((card, i) => (card.style.zIndex = String(i + 1)));
  visibleStack.at(-1)?.classList.add("stack-last");
  queueStack();
}
function queueStack() {
  if (!stackFrame) stackFrame = requestAnimationFrame(drawStack);
}
function drawStack() {
  stackFrame = 0;
  if (!stackEnabled()) return;
  const top =
    parseFloat(
      getComputedStyle(stackContainer).getPropertyValue("--stack-top"),
    ) || 105;
  const rects = visibleStack.map((card) => card.getBoundingClientRect());
  visibleStack.forEach((card, i) => {
    const next = rects[i + 1];
    const progress = next
      ? Math.max(
          0,
          Math.min(1, (top + rects[i].height - next.top) / rects[i].height),
        )
      : 0;
    card.style.transform = `scale(${1 - progress * 0.025})`;
    card.style.filter =
      progress > 0 ? `brightness(${1 - progress * 0.035})` : "";
    const covered = !!next && next.top <= top + 4;
    card.classList.toggle("is-covered", covered);
    card.querySelectorAll("[data-project]").forEach((button) => {
      if (covered) button.tabIndex = -1;
      else button.removeAttribute("tabindex");
    });
  });
}
document
  .querySelectorAll("[data-filter]")
  .forEach((button) => button.addEventListener("click", refreshStack));
window.addEventListener("scroll", queueStack, { passive: true });
window.addEventListener("resize", refreshStack, { passive: true });
window.addEventListener("portfolio:motionchange", refreshStack);
stackReduced.addEventListener("change", refreshStack);
stackShort.addEventListener("change", refreshStack);
// Keyboard focus brings the selected card into its own reading position.
stackContainer.addEventListener("focusin", (event) => {
  const card = event.target.closest(".project-card");
  if (!card || !stackEnabled()) return;
  const rect = card.getBoundingClientRect();
  const top =
    parseFloat(
      getComputedStyle(stackContainer).getPropertyValue("--stack-top"),
    ) || 105;
  if (rect.top > innerHeight * 0.45)
    card.scrollIntoView({ behavior: "smooth", block: "start" });
});
refreshStack();
