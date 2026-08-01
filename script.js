// ================================
// Smooth reveal animation
// ================================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll("section").forEach((section) => {
  section.classList.add("hidden");
  observer.observe(section);
});

// ================================
// Active Navigation Highlight
// ================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach((section) => {

    const sectionTop = section.offsetTop - 150;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach((link) => {

    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }

  });

});

// ================================
// Navbar Background on Scroll
// ================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 80) {

    header.style.background = "rgba(3,7,18,.95)";
    header.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

  } else {

    header.style.background = "rgba(3,7,18,.85)";
    header.style.boxShadow = "none";

  }

});

// ================================
// Smooth Scroll
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function(e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {

      window.scrollTo({

        top: target.offsetTop - 70,

        behavior: "smooth"

      });

    }

  });

});

// ================================
// Footer Year
// ================================

const footer = document.querySelector("footer p");

if (footer) {

  footer.innerHTML =
    `© ${new Date().getFullYear()} Yemisi Esther Akinseli. All Rights Reserved.`;

}
