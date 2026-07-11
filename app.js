document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLButtonElement} */
  const openMenuButton = document.querySelector("#openMenu");
  /** @type {HTMLButtonElement} */
  const closeMenuButton = document.querySelector("#closeMenu");

  openMenuButton.addEventListener("click", toggleMenu);
  closeMenuButton.addEventListener("click", toggleMenu);

  setupNavigation();
});

function toggleMenu() {
  /** @type {HTMLElement | null} */
  const navElement = document.querySelector("nav");
  if (!navElement) return;

  const isOpen = navElement.dataset.state === "open";
  navElement.dataset.state = isOpen ? "closed" : "open";
  document.body.style.overflow = isOpen ? "unset" : "hidden";
}

function setupNavigation() {
  const sections = [
    document.querySelector("#hero"),
    document.querySelector("#about"),
    document.querySelector("#contacts"),
  ];
  console.log("@sections", sections);
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const navLinks = document.querySelectorAll(".navigation__link");
  /** @type {IntersectionObserverInit} */
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;

        navLinks.forEach((link) =>
          link.classList.remove("navigation__link--active"),
        );

        /** @type {HTMLAnchorElement | null} */
        const activeLink = document.querySelector(
          `.navigation__link[href="#${currentId}"]`,
        );

        if (!activeLink) return;

        activeLink.classList.add("navigation__link--active");
      }
    });
  }, options);

  sections.forEach((section) => observer.observe(section));
}
