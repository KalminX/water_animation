export default function initGlitchText() {
  const heroText = document.querySelector(".hero-text");

  // Wrap each character in a span
  heroText.innerHTML = heroText.textContent
    .split("")
    .map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`)
    .join("");

  // Erratic jump animation
  gsap.to(".hero-text span", {
    y: () => (Math.random() - 0.5) * 40,
    opacity: () => Math.random() * 0.5 + 0.5,
    repeat: -1,
    yoyo: true,
    duration: 0.1,
    repeatRefresh: true,
    stagger: { each: 0.05, from: "random" },
    ease: "steps(3)",
  });

  // Button flicker
  gsap.to(".btn", {
    opacity: 0.6,
    repeat: -1,
    yoyo: true,
    duration: 0.1,
    ease: "steps(1)",
  });

  // Grayscale & horizontal shiver
  function updateGlitch() {
    document.querySelectorAll(".hero-text span").forEach((span, i) => {
      const noise = Math.sin(Date.now() * 0.005 + i);
      const gray = Math.floor(Math.abs(noise) * 255);
      const blur = Math.abs(Math.sin(Date.now() * 0.01)) * 2;

      span.style.color = `rgb(${gray},${gray},${gray})`;
      span.style.filter = `blur(${blur}px) brightness(${noise * 0.5 + 1})`;
      span.style.transform =
        Math.random() > 0.98
          ? `translateX(${(Math.random() - 0.5) * 20}px)`
          : `translateX(0px)`;
    });
    requestAnimationFrame(updateGlitch);
  }

  updateGlitch();
}
