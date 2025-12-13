(function initSectionObserver() {
  if (!("IntersectionObserver" in window)) return;

  const sections = document.querySelectorAll("section");

  if (sections.length === 0) {
    // DOM chưa render xong → thử lại
    requestAnimationFrame(initSectionObserver);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "opacity-100",
            "transition",
            "duration-700"
          );

          observer.unobserve(entry.target);

          // if (entry.target.id) {
          //   history.replaceState(null, "", `#${entry.target.id}`);
          // }
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((el) => observer.observe(el));
})();
