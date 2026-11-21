const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    }
  });
});

const year = document.querySelector("#year");
year.textContent = String(new Date().getFullYear());

document.querySelectorAll(".portrait-photo").forEach((photo) => {
  if (photo.complete && photo.naturalWidth > 0) {
    photo.closest(".portrait-placeholder").classList.add("has-photo");
  } else {
    photo.addEventListener("load", () => {
      photo.closest(".portrait-placeholder").classList.add("has-photo");
    }, { once: true });
  }
});

const hero = document.querySelector(".hero");
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    hero.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  });

  const portraitComposition = document.querySelector(".portrait-composition");
  portraitComposition.addEventListener("pointermove", (event) => {
    const bounds = portraitComposition.getBoundingClientRect();
    const position = (event.clientX - bounds.left) / bounds.width - 0.5;
    portraitComposition.style.setProperty("--primary-tilt", `${position * -5}deg`);
    portraitComposition.style.setProperty("--secondary-tilt", `${position * 4}deg`);
  });
  portraitComposition.addEventListener("pointerleave", () => {
    portraitComposition.style.removeProperty("--primary-tilt");
    portraitComposition.style.removeProperty("--secondary-tilt");
  });
}

const rotatingWord = document.querySelector(".word-swap");
const words = ["curiosity", "questions", "ideas", "code"];
let wordIndex = 0;
if (!reduceMotion) {
  window.setInterval(() => {
    rotatingWord.style.opacity = "0";
    rotatingWord.style.transform = "translateY(5px)";
    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatingWord.textContent = words[wordIndex];
      rotatingWord.style.opacity = "1";
      rotatingWord.style.transform = "translateY(0)";
    }, 190);
  }, 2200);
}

if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".section-label, .about-headline, .about-copy, .fact-strip, .toolbox-heading, .skill-group, .playground-title, .idea-card, .closing > *").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
