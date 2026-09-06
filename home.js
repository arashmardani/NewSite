/**
 * ClassChain Homepage interactions
 */
document.addEventListener("DOMContentLoaded", () => {
  // Sticky header
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
    // Close on link click
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // Animated counters
  const animateValue = (el, end, duration = 1800) => {
    const start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (end - start) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          if (!isNaN(target) && !el.dataset.animated) {
            el.dataset.animated = "1";
            animateValue(el, target);
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".stat-number").forEach((el) => observer.observe(el));
});
