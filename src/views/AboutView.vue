<template>
  <div class="about-page">
    <div class="page-header py-5 mt-5">
      <div class="container">
        <p class="text-primary fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">WHO WE ARE</p>
        <h1 class="display-4 fw-bold">About Us</h1>
        <p class="lead text-secondary">Discover our story, mission, and the people behind the music</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Mission Section -->
      <div class="row align-items-center mb-5">
        <div class="col-lg-6 mb-4">
          <h2 class="section-title">Our Mission</h2>
          <p class="lead text-secondary">
            Dux Stella Voce (DSV) is an independent choir formed by alumni of university choirs from across Indonesia. Born from a shared passion for singing together, DSV provides a space for members to express their love for music, unwind, and build lasting friendships.
          </p>
          <p class="text-secondary">
            Through its involvement in church services, wedding choirs, concerts, and backing vocals, DSV has also established a strong presence on the international stage. Its achievements include a Silver Medal at the Singapore International Choral Festival 2023 the Grand Champion title at the Penabur International Choir Festival 2024. In 2025, DSV once again stepped onto the international stage as a Grand Prix Finalist at the Tokyo International Choir Competition 2025, where it received several accolades, including The Winner of the Mixed Choir and Contemporary Music categories, as well as Special Prizes in Music Interpretation. These achievements led DSV to represent Indonesia as one of the international choirs invited to participate in the 2nd Gyeongnam International Choir Festival 2026, held across the cities of Jinju, Gimhae, and Changwon.
          </p>
          <p class="text-secondary">Driven by a strong passion for music and a commitment to excellence, DSV continues to deliver high-quality performances and bring meaning to every moment of singing together.</p>
          <div class="d-flex gap-3 mt-4">
            <router-link to="/events" class="btn btn-primary">
              <i class="bi bi-calendar-event me-2"></i>See Our Events
            </router-link>
            <router-link to="/members" class="btn btn-outline-secondary">
              <i class="bi bi-people me-2"></i>Meet Members
            </router-link>
          </div>
        </div>
        <div class="col-lg-6">
          <img
            src="/naksatra_dsv.webp"
            alt="Choir"
            class="img-fluid rounded-3 shadow-lg"
          />
        </div>
      </div>

      <!-- Values -->
      <div class="row g-4 mb-5">
        <div class="col-md-4" v-for="value in values" :key="value.title">
          <div class="card value-card border-0 h-100 text-center p-4">
            <div class="value-icon mb-3">
              <i :class="value.icon" class="display-5"></i>
            </div>
            <h4 class="fw-bold mb-2">{{ value.title }}</h4>
            <p class="text-muted mb-0">{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Milestones & Achievements -->
      <div class="mb-5">
        <h2 class="section-title text-center">Milestones & Achievements</h2>
        <p class="text-center text-secondary mb-5" style="max-width: 700px; margin: 0 auto;">Our journey of excellence on the international stage</p>
        <div class="row g-4">
          <div class="col-lg-6" v-for="(milestone, index) in milestones" :key="index">
            <div class="card milestone-card border-0 h-100">
              <div class="card-body p-4">
                <div class="d-flex gap-3">
                  <div class="milestone-year fw-bold" :style="{ color: milestone.color }">{{ milestone.year }}</div>
                  <div class="flex-grow-1">
                    <div class="milestone-category" :style="{ backgroundColor: milestone.color, borderColor: milestone.color }">{{ milestone.category }}</div>
                    <h5 class="fw-bold mt-2 mb-1">{{ milestone.title }}</h5>
                    <p class="text-muted mb-0">{{ milestone.details }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conductor -->
      <div class="card conductor-card border-0 mb-5 overflow-hidden">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              src="/art_director.jpg"
              class="img-fluid h-100 w-100"
              style="object-fit: cover; min-height: 300px;"
              alt="Conductor"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body p-4 p-md-5">
              <p class="fw-semibold mb-1" style="color: var(--gold);">Artistic Director</p>
              <h2 class="fw-bold mb-3">Maestro Alfredo Agustinus</h2>
              <p class="text-secondary">
                Since 2014, Alfredo has continued to develop his skills in vocal performance and conducting under the guidance of renowned local and international maestros, including Tommyanto Kandisaputra (Indonesia), Masashi Kishimoto (Japan), and Nicolas Fink (Germany). With Dux Stella Voce, he has led the choir to notable achievements, including the Grand Champion title at the Penabur International Choir Festival 2024, and Grand Prix Finalist at the Tokyo International Choir Competition 2025, where the choir also received several awards for repertoire interpretation.
              </p>
              <div class="row mt-4">
                <div class="col-4">
                  <h4 class="fw-bold mb-0" style="color: var(--primary);">20+</h4>
                  <small class="text-muted">Years Experience</small>
                </div>
                <div class="col-4">
                  <h4 class="fw-bold mb-0" style="color: var(--primary);">200+</h4>
                  <small class="text-muted">Performances</small>
                </div>
                <div class="col-4">
                  <h4 class="fw-bold mb-0" style="color: var(--primary);">10+</h4>
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
      milestones: [
        {
          year: "2026",
          category: "Invitation",
          color: "#d4a853",
          title: "2nd Gyeongnam International Choir Festival",
          details: "Invited choir guest representing Indonesia in Jinju, Gimhae, and Changwon"
        },
        {
          year: "2025",
          category: "Competition",
          color: "#a12f2f",
          title: "Tokyo International Choir Competition",
          details: "Grand Prix Finalist • Winner: Mixed Choir Category • Winner: Contemporary Music Category • Best Interpretation: Classical Music • Best Interpretation: Equal Voice & Mixed Choir Set Piece \"San Sui\""
        },
        {
          year: "2024",
          category: "Competition",
          color: "#a12f2f",
          title: "Penabur International Choir Festival",
          details: "Grand Champion • Gold Medal & 1st Runner Up: Music of Religion Choir Category • Gold Medal & 1st Runner Up: Mixed Choir Level A Category"
        },
        {
          year: "2023",
          category: "Competition",
          color: "#a12f2f",
          title: "Singapore International Choral Festival",
          details: "Silver Medal • 3rd Runner Up: Mixed Choir Category"
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
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--primary);
}

.value-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border) !important;
  border-radius: 16px;
  color: var(--text-primary);
  transition: var(--transition-smooth);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary) !important;
}

.value-card h4 {
  color: var(--text-primary) !important;
}

.milestone-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border) !important;
  border-radius: 16px;
  color: var(--text-primary);
  transition: var(--transition-smooth);
}

.milestone-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary) !important;
}

.milestone-year {
  font-size: 1.75rem;
  line-height: 1;
  min-width: 80px;
  font-family: 'Playfair Display', Georgia, serif;
}

.milestone-category {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  border: 2px solid;
}

.conductor-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border) !important;
  border-radius: 16px;
}

@media (max-width: 768px) {
  .about-page .card-body.p-md-5 {
    padding: 24px !important;
  }
  .about-page .row.mt-4 .col-4 h4 {
    font-size: 1.3rem;
  }
  .milestone-year {
    font-size: 1.5rem;
    min-width: 60px;
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
  .milestone-card .card-body {
    padding: 20px !important;
  }
  .milestone-year {
    font-size: 1.3rem;
  }
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 12px !important;
  }
  .milestone-category {
    align-self: flex-start;
  }
}
</style>
