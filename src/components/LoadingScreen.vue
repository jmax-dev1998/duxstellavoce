<template>
  <div class="loading-screen">
    <div class="particles" aria-hidden="true">
      <span
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="particleVars(i)"
      ></span>
    </div>

    <div class="loading-content">
      <div class="emblem">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0L25.5 14.5L40 20L25.5 25.5L20 40L14.5 25.5L0 20L14.5 14.5Z" fill="#ffd700" opacity="0.9"/>
          <path d="M20 6L23 15L32 20L23 25L20 34L17 25L8 20L17 15Z" fill="#ffd700" opacity="0.35"/>
        </svg>
      </div>

      <div class="title-row">
        <span class="gold-line"></span>
        <h1 class="brand-title gold-gradient-text">DUX STELLA VOCE</h1>
        <span class="gold-line"></span>
      </div>

      <p class="tagline">the voice that guides the stars</p>

      <div class="loader-wrapper">
        <div class="loader-ring"></div>
      </div>

      <p class="loading-label">l'appel des étoiles<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
  methods: {
    particleVars(i) {
      const size = 2 + (i % 3) * 1.5;
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${(i * 7.3 + 3.7) % 100}%`,
        animationDelay: `${i * 0.25}s`,
        animationDuration: `${10 + (i % 5) * 3}s`,
      };
    },
  },
};
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.loading-screen::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -10px;
  background: #ffd700;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) translateX(30px);
    opacity: 0;
  }
}

.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: contentEntry 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes contentEntry {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.emblem {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
  animation: emblemPulse 3s ease-in-out infinite;
}

@keyframes emblemPulse {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.5));
    transform: scale(1.05);
  }
}

.emblem svg {
  width: 100%;
  height: 100%;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.gold-line {
  display: block;
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
}

.brand-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0;
  white-space: nowrap;
}

.tagline {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family: "Inter", sans-serif;
}

.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.loader-ring {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 215, 0, 0.12);
  border-top-color: #ffd700;
  border-right-color: #ffed4a;
  border-radius: 50%;
  animation: ringSpin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.loader-wrapper::before {
  content: "";
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%);
  animation: ringGlow 2s ease-in-out infinite;
}

@keyframes ringSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes ringGlow {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.loading-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 215, 0, 0.5);
  letter-spacing: 3px;
  font-family: "Inter", sans-serif;
}

.loading-dots span {
  animation: dotBlink 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotBlink {
  0%, 60%, 100% { opacity: 0; }
  30% { opacity: 1; }
}

@media (max-width: 768px) {
  .brand-title {
    font-size: 1.6rem;
    letter-spacing: 4px;
  }

  .gold-line {
    width: 35px;
  }

  .title-row {
    gap: 14px;
  }

  .emblem {
    width: 38px;
    height: 38px;
  }

  .loading-content {
    gap: 18px;
  }

  .tagline {
    font-size: 0.7rem;
    letter-spacing: 3px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.15rem;
    letter-spacing: 3px;
  }

  .gold-line {
    width: 24px;
  }

  .title-row {
    gap: 10px;
  }

  .emblem {
    width: 30px;
    height: 30px;
  }

  .loading-content {
    gap: 14px;
    padding: 0 24px;
  }

  .tagline {
    font-size: 0.6rem;
    letter-spacing: 2px;
  }

  .loader-ring {
    width: 28px;
    height: 28px;
  }

  .loading-label {
    font-size: 0.65rem;
  }
}
</style>
