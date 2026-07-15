<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section text-white d-flex align-items-center">
      <div class="hero-overlay"></div>
      <div class="hero-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
      </div>
      <div class="container position-relative" style="z-index: 2">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <p class="hero-subtitle text-gold fw-semibold mb-3 reveal-hero">DUX STELLA VOCE</p>
            <h1 class="display-2 fw-bold mb-4 reveal-hero" style='font-family: "Playfair Display", Georgia, serif'>
              Where Voices<br /><span class="gold-gradient-text">Elevate</span> the Soul
            </h1>
            <p class="lead mb-5 text-white-50 reveal-hero" style="animation-delay: 0.2s">
              Experience the power of unified voices creating extraordinary musical moments that
              transcend the ordinary
            </p>
            <div class="hero-buttons reveal-hero" style="animation-delay: 0.4s">
              <router-link to="/events" class="btn btn-gold btn-lg me-3 px-4">
                <i class="bi bi-calendar-event me-2"></i>Upcoming Events
              </router-link>
              <router-link to="/about" class="btn btn-outline-light btn-lg px-4">
                <i class="bi bi-info-circle me-2"></i>Learn More
              </router-link>
            </div>
            <div class="hero-scroll-indicator mt-5 reveal-hero" style="animation-delay: 0.6s">
              <div class="scroll-mouse">
                <div class="scroll-dot"></div>
              </div>
              <small class="text-white-50 d-block mt-2">Scroll to explore</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Summary Section -->
    <section class="py-5 about-summary" ref="aboutSection">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <p class="text-gold fw-semibold mb-2 reveal">Our Story</p>
            <h2 class="section-title reveal">About Our Choir</h2>
            <p class="lead text-muted reveal">
              Founded in 2022, Dux Stella Voce has grown from a small community ensemble to a
              renowned choir performing at prestigious venues worldwide.
            </p>
            <p class="reveal">
              Dux Stella Voce is an independent choir consisting of alumni from several student
              choirs all around Indonesia. Based on their longing of singing together in group, Dux
              Stella Voce was formed as a means of letting go boredom of its member in living their
              daily busy lives.
            </p>
            <div class="d-flex gap-3 mt-4 reveal">
              <router-link to="/about" class="btn btn-gold">
                <i class="bi bi-arrow-right me-2"></i>Discover More
              </router-link>
              <router-link to="/members" class="btn btn-outline-dark">
                <i class="bi bi-people me-2"></i>Meet the Team
              </router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="about-image-wrapper reveal-right">
              <div class="about-image-decoration"></div>
              <img src="/melcin_dsv.png" alt="Choir Performance"
                class="img-fluid rounded-3 shadow-lg about-image" />
              <div class="about-experience-badge">
                <span class="display-5 fw-bold gold-gradient-text">4+</span>
                <span class="d-block text-white-50">Years of<br />Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats / Counter Section -->
    <section class="stats-section py-5" ref="statsSection">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3 col-6" v-for="(stat, index) in stats" :key="stat.label">
            <div class="stat-card text-center reveal-scale">
              <div class="stat-icon mb-3">
                <i :class="stat.icon"></i>
              </div>
              <h2 class="display-4 fw-bold text-gold mb-1">
                <span :data-target="stat.value" class="counter">{{ animatedValues[index] }}+</span>
              </h2>
              <p class="text-muted mb-0 fw-semibold text-uppercase small">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Voice Distribution -->
    <section class="py-5 voice-section" ref="voiceSection">
      <div class="container">
        <div class="text-center mb-5">
          <p class="text-gold fw-semibold mb-2 reveal">Our Voices</p>
          <h2 class="section-title text-center reveal">Voice Distribution</h2>
        </div>
        <div class="row stagger-children" ref="voiceGrid">
          <div class="col-md-3 mb-4" v-for="(count, role) in choirStore.memberRoles" :key="role">
            <div class="card border-0 shadow-sm text-center h-100 role-card" v-if="role !== 'total'">
              <div class="card-body py-4">
                <div class="role-icon mb-3">
                  <div class="role-icon-circle" :class="'role-' + role">
                    <i class="bi bi-music-note fs-2"></i>
                  </div>
                </div>
                <h3 class="fw-bold display-5 mb-1" :class="'text-' + getRoleColor(role)">
                  {{ count }}
                </h3>
                <h5 class="text-uppercase text-muted mb-3 fw-semibold">{{ role }}</h5>
                <div class="progress voice-progress" style="height: 6px">
                  <div class="progress-bar" :class="'bg-' + getRoleColor(role)"
                    :style="{ width: (count / choirStore.memberRoles.total) * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="py-5" ref="eventsSection">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p class="text-gold fw-semibold mb-1 reveal">Don't Miss Out</p>
            <h2 class="section-title mb-0 reveal">Upcoming Events</h2>
          </div>
          <router-link to="/events" class="btn btn-outline-gold reveal">
            View All <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4" v-for="event in upcomingEventsSlice" :key="event.id">
            <div class="card event-card border-0 shadow-sm h-100 reveal">
              <div class="event-image-wrapper">
                <img :src="event.image" class="card-img-top" :alt="event.title" />
                <div class="event-date-badge">
                  <span class="event-day">{{ getDay(event.date) }}</span>
                  <span class="event-month">{{ getMonth(event.date) }}</span>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge bg-gold fw-semibold">{{ event.tickets }}</span>
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>{{ event.time }}
                  </small>
                </div>
                <h5 class="card-title fw-bold mb-2">{{ event.title }}</h5>
                <p class="card-text text-muted small mb-3">
                  <i class="bi bi-geo-alt me-1"></i>{{ event.venue }}, {{ event.location }}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="bi bi-calendar me-1"></i>{{ formatDate(event.date) }}
                  </small>
                  <button class="btn btn-sm btn-gold">Get Tickets</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Highlight -->
    <section class="py-5 gallery-highlight" ref="gallerySection">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p class="text-gold fw-semibold mb-1 reveal">Moments Captured</p>
            <h2 class="section-title mb-0 text-white reveal">Gallery Highlights</h2>
          </div>
          <router-link to="/gallery" class="btn btn-outline-gold reveal">
            View Gallery <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
        <div class="row stagger-children" ref="galleryGrid">
          <div class="col-lg-4 col-md-6 mb-3" v-for="(photo, i) in gallerySlice" :key="photo.id">
            <div class="gallery-item position-relative overflow-hidden rounded-3">
              <img :src="photo.image" :alt="photo.title" class="w-100" style="height: 300px; object-fit: cover"
                :class="{ 'tall-img': i === 0 }" />
              <div class="gallery-overlay">
                <div class="gallery-overlay-content">
                  <span class="badge bg-gold mb-2">{{ photo.category }}</span>
                  <h6 class="mb-1 fw-bold">{{ photo.title }}</h6>
                  <small class="text-white-50">{{ formatDate(photo.date) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useChoirStore } from "../stores/choir";

export default {
  name: "HomeView",
  setup() {
    const choirStore = useChoirStore();

    const aboutSection = ref(null);
    const statsSection = ref(null);
    const voiceSection = ref(null);
    const voiceGrid = ref(null);
    const eventsSection = ref(null);
    const gallerySection = ref(null);
    const galleryGrid = ref(null);

    const animatedValues = ref([0, 0, 0, 0]);
    let countersStarted = false;
    let observers = [];

    const stats = [
      { label: "Performances", value: 50, icon: "bi bi-music-note-beamed" },
      { label: "Years Active", value: 12, icon: "bi bi-calendar-heart" },
      { label: "Members", value: choirStore.memberRoles.total, icon: "bi bi-people" },
      { label: "Awards", value: 15, icon: "bi bi-trophy" },
    ];

    const upcomingEventsSlice = computed(() => choirStore.upcomingEvents.slice(0, 2));
    const gallerySlice = computed(() => choirStore.gallery.slice(0, 6));

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const getDay = (date) => new Date(date).getDate();
    const getMonth = (date) => new Date(date).toLocaleString("default", { month: "short" });

    const getRoleColor = (role) => {
      const colors = { soprano: "danger", alto: "success", tenor: "warning", bass: "primary" };
      return colors[role] || "secondary";
    };

    const animateCounters = () => {
      if (countersStarted) return;
      countersStarted = true;
      stats.forEach((stat, index) => {
        const target = stat.value;
        let current = 0;
        const increment = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          animatedValues.value[index] = current;
        }, 40);
      });
    };

    const observeElement = (el, callback) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
      observers.push(observer);
    };

    onMounted(() => {
      // Animate hero elements on load
      setTimeout(() => {
        document.querySelectorAll(".reveal-hero").forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 200);
        });
      }, 300);

      // Scroll reveal for sections
      const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale",
      );
      revealElements.forEach((el) => {
        observeElement(el, (target) => {
          target.classList.add("revealed");
        });
      });

      // Stagger children reveal
      if (voiceGrid.value) {
        observeElement(voiceGrid.value, (target) => {
          target.classList.add("revealed");
        });
      }
      if (galleryGrid.value) {
        observeElement(galleryGrid.value, (target) => {
          target.classList.add("revealed");
        });
      }

      // Counter animation
      if (statsSection.value) {
        observeElement(statsSection.value, () => {
          animateCounters();
        });
      }
    });

    onUnmounted(() => {
      observers.forEach((obs) => obs.disconnect());
    });

    // Generate particles
    const particleStyle = (seed) => {
      const s = seed * 7.3;
      return {
        left: ((s * 13.7) % 100) + "%",
        top: ((s * 29.3) % 100) + "%",
        width: ((s * 3.1) % 4) + 2 + "px",
        height: ((s * 3.1) % 4) + 2 + "px",
        animationDelay: ((s * 1.7) % 5) + "s",
        animationDuration: ((s * 2.3) % 10) + 10 + "s",
      };
    };

    return {
      choirStore,
      aboutSection,
      statsSection,
      voiceSection,
      voiceGrid,
      eventsSection,
      gallerySection,
      galleryGrid,
      upcomingEventsSlice,
      gallerySlice,
      formatDate,
      getDay,
      getMonth,
      getRoleColor,
      stats,
      animatedValues,
      particleStyle,
    };
  },
};
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

.hero-section {
  background: url("/bg_dsv.jpg") center center / cover no-repeat;
  position: relative;
  min-height: 100vh;
  margin-top: -76px;
  padding-top: 76px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      rgba(26, 26, 46, 0.85) 0%,
      rgba(22, 33, 62, 0.75) 50%,
      rgba(15, 52, 96, 0.8) 100%);
  z-index: 1;
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0.3;
  animation: floatAround linear infinite;
}

@keyframes floatAround {

  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0.2;
  }

  25% {
    transform: translateY(-30px) translateX(15px);
    opacity: 0.4;
  }

  50% {
    transform: translateY(-10px) translateX(-10px);
    opacity: 0.3;
  }

  75% {
    transform: translateY(-40px) translateX(20px);
    opacity: 0.5;
  }
}

.reveal-hero {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.hero-subtitle {
  letter-spacing: 4px;
  font-size: 0.9rem;
}

.hero-scroll-indicator {
  animation: fadeInUp 1s ease-out;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  margin: 0 auto;
  position: relative;
}

.scroll-dot {
  width: 4px;
  height: 8px;
  background: var(--gold);
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollDot 2s ease-in-out infinite;
}

@keyframes scrollDot {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateX(-50%) translateY(16px);
    opacity: 0;
  }
}

/* About Section */
.about-image-wrapper {
  position: relative;
  padding-left: 20px;
  padding-bottom: 20px;
}

.about-image-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid var(--gold);
  border-radius: 12px;
  transform: translate(10px, 10px);
  z-index: 0;
}

.about-image {
  position: relative;
  z-index: 1;
}

.about-experience-badge {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 25px;
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  z-index: 2;
  text-align: center;
  box-shadow: var(--shadow-elegant);
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 100%);
}

.stat-card {
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: var(--transition-smooth);
}

.stat-card:hover {
  background: rgba(255, 215, 0, 0.08);
  border-color: rgba(255, 215, 0, 0.2);
  transform: translateY(-5px);
}

.stat-icon i {
  font-size: 2rem;
  color: var(--gold);
  opacity: 0.7;
}

/* Voice Section */
.voice-section {
  background: #f8f9fa;
}

.role-icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: var(--transition-smooth);
}

.role-soprano {
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
}

.role-alto {
  background: rgba(25, 135, 84, 0.12);
  color: #198754;
}

.role-tenor {
  background: rgba(255, 193, 7, 0.12);
  color: #ffc107;
}

.role-bass {
  background: rgba(13, 110, 253, 0.12);
  color: #0d6efd;
}

.role-card:hover .role-icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.voice-progress {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
}

/* Events */
.event-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.event-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.event-card:hover .event-image-wrapper img {
  transform: scale(1.1);
}

.event-date-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #fff;
  line-height: 1.2;
}

.event-day {
  font-size: 1.3rem;
  font-weight: 800;
  display: block;
  color: var(--gold);
}

.event-month {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

/* Gallery Highlight */
.gallery-highlight {
  background: linear-gradient(135deg, var(--dark) 0%, #0d0d1a 100%);
}

.gallery-item {
  cursor: pointer;
  border-radius: 12px !important;
}

.gallery-item img {
  transition: transform 0.6s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-overlay-content {
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-overlay-content {
  transform: translateY(0);
}

.role-card {
  transition: var(--transition-smooth);
}

.role-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover) !important;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 85vh;
    padding-top: 76px;
  }

  .hero-section .display-2 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 0.75rem;
    letter-spacing: 2px;
  }

  .hero-buttons .btn {
    display: block;
    width: 100%;
    margin: 0 0 12px !important;
  }

  .hero-scroll-indicator {
    display: none;
  }

  .about-experience-badge {
    position: static;
    margin-top: 20px;
    display: inline-block;
  }

  .about-image-decoration {
    display: none;
  }

  .about-image-wrapper {
    padding: 0;
  }

  .stats-section .display-4 {
    font-size: 2rem;
  }

  .stat-card {
    padding: 20px 12px;
  }

  .stat-card .display-4 {
    font-size: 1.8rem;
  }

  .voice-section .display-5 {
    font-size: 2rem;
  }

  .role-icon-circle {
    width: 56px;
    height: 56px;
  }

  .role-icon-circle i {
    font-size: 1.3rem !important;
  }
}

@media (max-width: 576px) {
  .hero-section {
    min-height: 80vh;
  }

  .hero-section .display-2 {
    font-size: 1.8rem;
  }

  .hero-section .lead {
    font-size: 0.95rem;
  }

  .hero-buttons .btn {
    font-size: 0.9rem;
    padding: 10px 20px !important;
  }

  .stats-section .display-4 {
    font-size: 1.5rem;
  }

  .stat-card {
    padding: 16px 10px;
  }

  .stat-card .stat-icon i {
    font-size: 1.5rem;
  }

  .stat-card p {
    font-size: 0.7rem;
  }

  .event-image-wrapper {
    height: 160px;
  }

  .event-date-badge {
    padding: 6px 10px;
    top: 10px;
    left: 10px;
  }

  .event-day {
    font-size: 1rem;
  }

  .gallery-item img {
    height: 220px !important;
  }
}
</style>
