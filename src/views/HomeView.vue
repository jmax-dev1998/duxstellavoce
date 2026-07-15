<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section text-white text-center d-flex align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h1 class="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
              Dux Stella Voce
            </h1>
            <p class="lead mb-4 animate__animated animate__fadeInUp">
              Experience the power of unified voices creating extraordinary musical moments
            </p>
            <router-link to="/events" class="btn btn-gold btn-lg me-3">Upcoming Events</router-link>
            <router-link to="/about" class="btn btn-outline-light btn-lg">Learn More</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Summary Section -->
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <h2 class="section-title">About Our Choir</h2>
            <p class="lead text-muted">
              Founded in 2015, Harmony Voices has grown from a small community ensemble to a
              renowned choir performing at prestigious venues worldwide.
            </p>
            <p>
              Our diverse repertoire spans classical masterpieces, contemporary works, and
              innovative arrangements. We believe in the transformative power of choral music to
              inspire, unite, and elevate communities.
            </p>
            <div class="stats mt-4">
              <div class="row text-center">
                <div class="col-3">
                  <h3 class="text-gold fw-bold">50+</h3>
                  <small>Performances</small>
                </div>
                <div class="col-3">
                  <h3 class="text-gold fw-bold">12</h3>
                  <small>Years</small>
                </div>
                <div class="col-3">
                  <h3 class="text-gold fw-bold">{{ choirStore.memberRoles.total }}</h3>
                  <small>Members</small>
                </div>
                <div class="col-3">
                  <h3 class="text-gold fw-bold">15</h3>
                  <small>Awards</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <img
              src="https://picsum.photos/600/400?random=20"
              alt="Choir Performance"
              class="img-fluid rounded-3 shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Member Distribution -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Voice Distribution</h2>
        <div class="row">
          <div class="col-md-3 mb-4" v-for="(count, role) in choirStore.memberRoles" :key="role">
            <div
              class="card border-0 shadow-sm text-center h-100 role-card"
              v-if="role !== 'total'"
            >
              <div class="card-body">
                <div class="role-icon mb-3">
                  <i
                    class="bi bi-person-circle display-4"
                    :class="'text-' + getRoleColor(role)"
                  ></i>
                </div>
                <h3 class="fw-bold display-5" :class="'text-' + getRoleColor(role)">{{ count }}</h3>
                <h5 class="text-uppercase text-muted">{{ role }}</h5>
                <div class="progress mt-3" style="height: 8px">
                  <div
                    class="progress-bar"
                    :class="'bg-' + getRoleColor(role)"
                    :style="{ width: (count / choirStore.memberRoles.total) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0">Upcoming Events</h2>
          <router-link to="/events" class="btn btn-outline-dark">View All</router-link>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4" v-for="event in upcomingEventsSlice" :key="event.id">
            <div class="card event-card border-0 shadow-sm h-100">
              <img
                :src="event.image"
                class="card-img-top"
                :alt="event.title"
                style="height: 250px; object-fit: cover"
              />
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span class="badge bg-gold">{{ event.tickets }}</span>
                  <small class="text-muted"
                    ><i class="bi bi-calendar me-1"></i>{{ formatDate(event.date) }}</small
                  >
                </div>
                <h5 class="card-title fw-bold">{{ event.title }}</h5>
                <p class="card-text text-muted">
                  <i class="bi bi-geo-alt me-1"></i>{{ event.venue }}, {{ event.location }}
                </p>
                <p class="card-text"><i class="bi bi-clock me-1"></i>{{ event.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Highlight -->
    <section class="py-5 bg-dark text-white">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title text-white mb-0">Gallery Highlights</h2>
          <router-link to="/gallery" class="btn btn-outline-light">View Gallery</router-link>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="photo in gallerySlice" :key="photo.id">
            <div class="gallery-item position-relative overflow-hidden rounded-3">
              <img
                :src="photo.image"
                :alt="photo.title"
                class="w-100"
                style="height: 250px; object-fit: cover"
              />
              <div class="gallery-overlay">
                <h6 class="mb-1">{{ photo.title }}</h6>
                <small>{{ photo.category }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from "vue";
import { useChoirStore } from "../stores/choir";

export default {
  name: "HomeView",
  setup() {
    const choirStore = useChoirStore();

    const upcomingEventsSlice = computed(() => choirStore.upcomingEvents.slice(0, 2));
    const gallerySlice = computed(() => choirStore.gallery.slice(0, 6));

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const getRoleColor = (role) => {
      const colors = {
        soprano: "danger",
        alto: "success",
        tenor: "warning",
        bass: "primary",
      };
      return colors[role] || "secondary";
    };

    return { choirStore, upcomingEventsSlice, gallerySlice, formatDate, getRoleColor };
  },
};
</script>

<style scoped>
.hero-section {
  background: url('/bg_dsv.jpg') center center / cover no-repeat;
  position: relative;
  min-height: 100vh;
  margin-top: -76px;
  padding-top: 76px;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

.hero-section .container {
  position: relative;
  z-index: 1;
}

.section-title {
  position: relative;
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #ffd700;
}

.text-center .section-title::after {
  left: 50%;
  transform: translateX(-50%);
}

.text-gold {
  color: #ffd700;
}

.bg-gold {
  background-color: #ffd700;
  color: #000;
}

.btn-gold {
  background: #ffd700;
  border-color: #ffd700;
  color: #000;
}

.btn-gold:hover {
  background: #ffed4a;
  border-color: #ffed4a;
}

.event-card {
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
}

.gallery-overlay {
  position: absolute;
  bottom: -100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  transition: bottom 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  bottom: 0;
}

.role-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.role-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}
</style>
