// src/utils/confetti.js
import confetti from "canvas-confetti";

export const showConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });
};
