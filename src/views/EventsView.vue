<template>
  <div class="events-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">UPCOMING PERFORMANCES</p>
        <h1 class="display-4 fw-bold">Events</h1>
        <p class="lead text-white-50">Join us for our upcoming performances and concerts</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div class="mb-4 d-flex gap-2 flex-wrap">
            <button
              class="btn filter-btn"
              :class="activeFilter === 'All' ? 'btn-gold' : 'btn-outline-dark'"
              @click="activeFilter = 'All'"
            >All Events</button>
            <button
              class="btn filter-btn"
              :class="activeFilter === 'Free' ? 'btn-gold' : 'btn-outline-dark'"
              @click="activeFilter = 'Free'"
            ><i class="bi bi-ticket-perforated me-1"></i>Free</button>
            <button
              class="btn filter-btn"
              :class="activeFilter === 'Paid' ? 'btn-gold' : 'btn-outline-dark'"
              @click="activeFilter = 'Paid'"
            ><i class="bi bi-ticket-fill me-1"></i>Paid</button>
          </div>

          <div
            class="card event-card border-0 shadow-sm mb-4"
            v-for="event in filteredEvents"
            :key="event.id"
          >
            <div class="row g-0">
              <div class="col-md-4 position-relative overflow-hidden" style="min-height: 220px;">
                <img
                  :src="event.image"
                  class="img-fluid h-100 w-100"
                  style="object-fit: cover; position: absolute;"
                  :alt="event.title"
                />
                <div class="event-card-date">
                  <span class="fw-bold fs-5">{{ getDay(event.date) }}</span>
                  <span>{{ getMonth(event.date) }}</span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge" :class="event.tickets === 'Free' ? 'bg-success' : 'bg-gold'">
                      {{ event.tickets }}
                    </span>
                  </div>
                  <h3 class="card-title fw-bold mb-2">{{ event.title }}</h3>
                  <div class="event-details mt-3">
                    <div class="detail-row">
                      <i class="bi bi-calendar-check text-gold"></i>
                      <span>{{ formatDate(event.date) }}</span>
                    </div>
                    <div class="detail-row">
                      <i class="bi bi-clock text-gold"></i>
                      <span>{{ event.time }}</span>
                    </div>
                    <div class="detail-row">
                      <i class="bi bi-geo-alt text-gold"></i>
                      <span>{{ event.venue }}, {{ event.location }}</span>
                    </div>
                  </div>
                  <p class="card-text text-muted mt-3">{{ event.description }}</p>
                  <button class="btn btn-gold mt-2">
                    <i class="bi bi-ticket me-1"></i>Get Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredEvents.length === 0" class="text-center py-5">
            <i class="bi bi-calendar-x display-1 text-muted"></i>
            <h4 class="mt-3">No events found</h4>
            <p class="text-muted">Check back later for upcoming performances</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 100px">
            <div class="card-body">
              <h4 class="fw-bold mb-4">
                <i class="bi bi-calendar-week text-gold me-2"></i>Event Calendar
              </h4>
              <div class="calendar-preview p-4 rounded-3 text-center mb-4" style="background: linear-gradient(135deg, var(--dark), var(--dark-secondary));">
                <h2 class="display-4 fw-bold text-gold mb-0">{{ currentMonth }}</h2>
                <p class="text-white-50 mb-0">{{ currentYear }}</p>
              </div>
              <h6 class="fw-bold mb-3">
                <i class="bi bi-lightning text-gold me-1"></i>Quick View
              </h6>
              <div
                v-for="event in choirStore.upcomingEvents.slice(0, 4)"
                :key="event.id"
                class="d-flex align-items-center mb-3 p-2 quick-event"
              >
                <div class="flex-shrink-0">
                  <div class="date-box text-center rounded-3 p-2" style="background: rgba(255, 215, 0, 0.12); min-width: 50px;">
                    <small class="d-block fw-bold text-gold fs-6">{{ getDay(event.date) }}</small>
                    <small class="text-muted" style="font-size: 0.7rem;">{{ getMonth(event.date) }}</small>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="mb-1 fw-semibold" style="font-size: 0.9rem;">{{ event.title }}</h6>
                  <small class="text-muted">
                    <i class="bi bi-geo-alt me-1"></i>{{ event.venue }}
                  </small>
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
import { ref, computed } from "vue";
import { useChoirStore } from "../stores/choir";

export default {
  name: "EventsView",
  setup() {
    const choirStore = useChoirStore();
    const activeFilter = ref("All");

    const filteredEvents = computed(() => {
      if (activeFilter.value === "All") return choirStore.upcomingEvents;
      return choirStore.upcomingEvents.filter((e) => e.tickets === activeFilter.value);
    });

    const currentMonth = computed(() => {
      return new Date().toLocaleString("default", { month: "long" });
    });

    const currentYear = computed(() => new Date().getFullYear());

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const getDay = (date) => new Date(date).getDate();
    const getMonth = (date) => new Date(date).toLocaleString("default", { month: "short" });

    return { choirStore, activeFilter, filteredEvents, currentMonth, currentYear, formatDate, getDay, getMonth };
  },
};
</script>

<style scoped>
.filter-btn {
  border-radius: 25px;
  padding: 8px 22px;
  font-weight: 500;
  transition: var(--transition-smooth);
}

.event-card {
  transition: var(--transition-smooth);
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover) !important;
}

.event-card-date {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 8px 14px;
  text-align: center;
  color: var(--gold);
  line-height: 1.2;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.event-card-date span:last-child {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.detail-row i {
  width: 20px;
  text-align: center;
}

.quick-event {
  border-radius: 10px;
  transition: var(--transition-smooth);
  cursor: default;
}

.quick-event:hover {
  background: rgba(255, 215, 0, 0.05);
}
</style>
