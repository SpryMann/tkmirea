document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLButtonElement} */
  const openMenuButton = document.querySelector("#openMenu");
  /** @type {HTMLButtonElement} */
  const closeMenuButton = document.querySelector("#closeMenu");

  openMenuButton.addEventListener("click", toggleMenu);
  closeMenuButton.addEventListener("click", toggleMenu);

  setupNavigation();
  setupSlider();
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
    document.querySelector("#destinations"),
    document.querySelector("#contacts"),
  ];
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

function setupSlider() {
  /** @type {HTMLDivElement} */
  const slider = document.querySelector(".slider");
  if (!slider) return;
  /** @type {HTMLButtonElement} */
  const prevButtonMobile = document.querySelector("#prevSliderMobile");
  /** @type {HTMLButtonElement} */
  const nextButtonMobile = document.querySelector("#nextSliderMobile");
  /** @type {HTMLButtonElement} */
  const prevButton = document.querySelector("#prevSlider");
  /** @type {HTMLButtonElement} */
  const nextButton = document.querySelector("#nextSlider");
  /** @type {HTMLDivElement} */
  const container = slider.querySelector(".slider__container");
  /** @type {NodeListOf<HTMLDivElement>} */
  const slides = slider.querySelectorAll(".slide");
  /** @type {HTMLDivElement} */
  const indicatorsBlock = slider.querySelector(".slider__indicators");
  /** @type {Array<HTMLDivElement>} */
  const indicators = [];
  let maxHeight = 0;
  let slideWidth = 0;
  let left = 0;
  let maxLeft = 0;
  let slideIndex = 0;

  const onPrevClick = () => {
    if (slideWidth === 0) return;

    const currentLeft = parseInt(container.style.left || "0", 10) || 0;
    slideIndex -= 1;
    left = -1 * (slideWidth + 16) * slideIndex;
    const isInStopPosition = left >= 0;

    if (isInStopPosition) {
      left = 0;
    }

    container.style.left = `${left}px`;
    prevButtonMobile.style.pointerEvents = "none";
    nextButtonMobile.style.pointerEvents = "none";
    prevButton.style.pointerEvents = "none";
    nextButton.style.pointerEvents = "none";
    updateIndicators();
  };
  const onNextClick = () => {
    if (slideWidth === 0) return;

    const currentLeft = parseInt(container.style.left || "0", 10) || 0;
    slideIndex += 1;
    left = -1 * (slideWidth + 16) * slideIndex;

    const isInStopPosition = Math.abs(left) >= maxLeft;

    if (isInStopPosition) {
      left = -1 * maxLeft;
    }

    container.style.left = `${left}px`;
    prevButtonMobile.style.pointerEvents = "none";
    nextButtonMobile.style.pointerEvents = "none";
    prevButton.style.pointerEvents = "none";
    nextButton.style.pointerEvents = "none";
    updateIndicators();
  };
  const updateButtons = () => {
    prevButtonMobile.disabled = left === 0;
    nextButtonMobile.disabled = Math.abs(left) === maxLeft;
    prevButton.disabled = left === 0;
    nextButton.disabled = Math.abs(left) === maxLeft;
  };
  const updateIndicators = () => {
    indicators.forEach((element, index) => {
      element.classList[index === slideIndex ? "add" : "remove"]("active");
    });
  };
  const onTransitionEnd = () => {
    prevButtonMobile.style.pointerEvents = "";
    nextButtonMobile.style.pointerEvents = "";
    prevButton.style.pointerEvents = "";
    nextButton.style.pointerEvents = "";
    updateButtons();
  };

  prevButtonMobile.addEventListener("click", onPrevClick);
  nextButtonMobile.addEventListener("click", onNextClick);
  prevButton.addEventListener("click", onPrevClick);
  nextButton.addEventListener("click", onNextClick);

  container.addEventListener("transitionend", onTransitionEnd);
  container.addEventListener("transitioncancel", onTransitionEnd);

  slides.forEach((slide, index) => {
    /** @type {HTMLDivElement} */
    const specsBlock = slide.querySelector(".slide__specs");
    if (!specsBlock) return;

    const slideRect = slide.getBoundingClientRect();
    const specsRect = specsBlock.getBoundingClientRect();
    maxHeight = Math.max(
      maxHeight,
      specsRect.bottom > slideRect.bottom
        ? specsRect.bottom - slideRect.top + 32
        : slideRect.bottom - slideRect.top,
    );
    slideWidth = Math.max(slideWidth, slideRect.width);

    const indicator = document.createElement("div");
    indicator.className = "slider__indicator";
    if (index === 0) indicator.classList.add("active");
    indicatorsBlock.append(indicator);
    indicators.push(indicator);
  });

  slider.style.height = `${maxHeight}px`;
  maxLeft = container.scrollWidth - slideWidth - 32;
}
