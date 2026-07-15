<template>
  <div class="events-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <h1 class="display-4 fw-bold">Upcoming Events</h1>
        <p class="lead">Join us for our upcoming performances and concerts</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div
            class="card border-0 shadow-sm mb-4"
            v-for="event in choirStore.upcomingEvents"
            :key="event.id"
          >
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  :src="event.image"
                  class="img-fluid h-100"
                  style="object-fit: cover"
                  :alt="event.title"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <span class="badge bg-gold mb-2">{{ event.tickets }}</span>
                  <h3 class="card-title fw-bold">{{ event.title }}</h3>
                  <div class="event-details mt-3">
                    <p class="mb-2">
                      <i class="bi bi-calendar-check me-2 text-gold"></i
                      >{{ formatDate(event.date) }}
                    </p>
                    <p class="mb-2"><i class="bi bi-clock me-2 text-gold"></i>{{ event.time }}</p>
                    <p class="mb-2">
                      <i class="bi bi-geo-alt me-2 text-gold"></i>{{ event.venue }}
                    </p>
                    <p class="mb-3">
                      <i class="bi bi-pin-map me-2 text-gold"></i>{{ event.location }}
                    </p>
                  </div>
                  <p class="card-text">{{ event.description }}</p>
                  <button class="btn btn-gold">Get Tickets</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 100px">
            <div class="card-body">
              <h4 class="fw-bold mb-4">Event Calendar</h4>
              <div class="calendar-preview p-3 bg-light rounded-3 text-center mb-4">
                <h2 class="display-4 fw-bold text-gold">{{ currentMonth }}</h2>
                <p class="lead">{{ currentYear }}</p>
              </div>
              <div class="upcoming-list">
                <h6 class="text-muted mb-3">Quick View</h6>
                <div
                  v-for="event in choirStore.upcomingEvents.slice(0, 3)"
                  :key="event.id"
                  class="d-flex align-items-center mb-3 p-2 border-bottom"
                >
                  <div class="flex-shrink-0">
                    <div class="date-box text-center bg-gold rounded-3 p-2">
                      <small class="d-block fw-bold">{{ getDay(event.date) }}</small>
                      <small>{{ getMonth(event.date) }}</small>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-0">{{ event.title }}</h6>
                    <small class="text-muted">{{ event.venue }}</small>
                  </div>
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
import { computed } from "vue";
import { useChoirStore } from "../stores/choir";

export default {
  name: "EventsView",
  setup() {
    const choirStore = useChoirStore();

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

    return { choirStore, currentMonth, currentYear, formatDate, getDay, getMonth };
  },
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-top: -76px;
  padding-top: 100px;
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
</style>
