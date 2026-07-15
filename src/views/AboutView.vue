<template>
  <div class="about-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">WHO WE ARE</p>
        <h1 class="display-4 fw-bold">About Us</h1>
        <p class="lead text-white-50">Discover our story, mission, and the people behind the music</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Mission Section -->
      <div class="row align-items-center mb-5">
        <div class="col-lg-6 mb-4">
          <h2 class="section-title">Our Mission</h2>
          <p class="lead text-muted">
            At Dux Stella Voce, we believe in the transformative power of choral music to inspire, unite, and elevate communities.
          </p>
          <p>
            Founded in 2015, Harmony Voices has grown from a small community ensemble to a renowned choir performing at prestigious venues worldwide. Our diverse repertoire spans classical masterpieces, contemporary works, and innovative arrangements that push the boundaries of choral music.
          </p>
          <div class="d-flex gap-3 mt-4">
            <router-link to="/events" class="btn btn-gold">
              <i class="bi bi-calendar-event me-2"></i>See Our Events
            </router-link>
            <router-link to="/members" class="btn btn-outline-dark">
              <i class="bi bi-people me-2"></i>Meet Members
            </router-link>
          </div>
        </div>
        <div class="col-lg-6">
          <img
            src="https://picsum.photos/600/450?random=30"
            alt="Choir"
            class="img-fluid rounded-3 shadow-lg"
          />
        </div>
      </div>

      <!-- Values -->
      <div class="row g-4 mb-5">
        <div class="col-md-4" v-for="value in values" :key="value.title">
          <div class="card border-0 shadow-sm h-100 text-center p-4">
            <div class="value-icon mb-3">
              <i :class="value.icon" class="display-5 text-gold"></i>
            </div>
            <h4 class="fw-bold mb-2">{{ value.title }}</h4>
            <p class="text-muted mb-0">{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Conductor -->
      <div class="card border-0 shadow-sm mb-5 overflow-hidden">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              src="https://picsum.photos/400/500?random=40"
              class="img-fluid h-100 w-100"
              style="object-fit: cover; min-height: 300px;"
              alt="Conductor"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body p-4 p-md-5">
              <p class="text-gold fw-semibold mb-1">Artistic Director</p>
              <h2 class="fw-bold mb-3">Maestro Giovanni Rossi</h2>
              <p class="text-muted">
                With over 20 years of experience in choral conducting, Maestro Rossi has led Dux Stella Voce to international acclaim. His innovative approach blends traditional choral techniques with contemporary musical expressions.
              </p>
              <p class="text-muted">
                Trained at the prestigious Conservatorio di Musica in Milan and having conducted choirs across Europe and North America, he brings a wealth of expertise and passion to every performance.
              </p>
              <div class="row mt-4">
                <div class="col-4">
                  <h4 class="fw-bold text-gold mb-0">20+</h4>
                  <small class="text-muted">Years Experience</small>
                </div>
                <div class="col-4">
                  <h4 class="fw-bold text-gold mb-0">200+</h4>
                  <small class="text-muted">Performances</small>
                </div>
                <div class="col-4">
                  <h4 class="fw-bold text-gold mb-0">30+</h4>
                  <small class="text-muted">Countries</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      values: [
        {
          icon: "bi bi-heart",
          title: "Passion",
          description: "We pour our hearts into every note, creating music that moves souls and builds connections.",
        },
        {
          icon: "bi bi-stars",
          title: "Excellence",
          description: "We strive for the highest standard in every performance, rehearsal, and arrangement.",
        },
        {
          icon: "bi bi-globe2",
          title: "Community",
          description: "We believe music belongs to everyone and actively engage with our local and global communities.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.value-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .about-page .card-body.p-md-5 {
    padding: 24px !important;
  }
  .about-page .row.mt-4 .col-4 h4 {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .about-page .btn {
    width: 100%;
  }
  .about-page .d-flex.gap-3 {
    flex-direction: column;
    gap: 10px !important;
  }
  .about-page .row.mt-4 .col-4 h4 {
    font-size: 1.1rem;
  }
  .about-page .row.mt-4 .col-4 small {
    font-size: 0.7rem;
  }
}
</style>
