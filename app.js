document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLButtonElement} */
  const openMenuButton = document.querySelector("#openMenu");
  /** @type {HTMLButtonElement} */
  const closeMenuButton = document.querySelector("#closeMenu");

  openMenuButton.addEventListener("click", toggleMenu);
  closeMenuButton.addEventListener("click", toggleMenu);
});

function toggleMenu() {
  /** @type {HTMLElement | null} */
  const navElement = document.querySelector("nav");
  if (!navElement) return;

  const isOpen = navElement.dataset.state === "open";
  navElement.dataset.state = isOpen ? "closed" : "open";
  document.body.style.overflow = isOpen ? "unset" : "hidden";
}
