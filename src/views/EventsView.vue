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
          <div class="mb-4 d-flex gap-2 flex-wrap align-items-center justify-content-between">
            <div class="d-flex gap-2 flex-wrap">
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
            <button v-if="authStore.isAdminOrManager" class="btn btn-gold" @click="openAddForm">
              <i class="bi bi-plus-lg me-1"></i>Add Event
            </button>
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
                    <div v-if="authStore.isAdminOrManager" class="d-flex gap-1">
                      <button class="btn btn-sm btn-outline-primary" @click="openEditForm(event)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(event)" title="Delete">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
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
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <button class="btn btn-sm btn-outline-dark" @click="prevMonth">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <h5 class="fw-bold mb-0">
                  {{ calendarMonthName }} <span class="text-gold">{{ calendarYear }}</span>
                </h5>
                <button class="btn btn-sm btn-outline-dark" @click="nextMonth">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
              <div class="calendar-grid">
                <div class="calendar-weekday" v-for="day in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="day">{{ day }}</div>
                <div
                  v-for="(cell, idx) in calendarCells"
                  :key="idx"
                  class="calendar-day"
                  :class="{
                    'text-muted': !cell.isCurrentMonth,
                    'calendar-today': cell.isToday,
                    'calendar-has-event': cell.hasEvent,
                    'calendar-selected': selectedDate === cell.dateStr
                  }"
                  @click="selectDate(cell)"
                >
                  <span class="day-number">{{ cell.day }}</span>
                  <div v-if="cell.hasEvent" class="event-dot"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="fw-bold mb-3">
                <i class="bi bi-lightning text-gold me-1"></i>Upcoming Events
              </h6>
              <div v-if="previewEvents.length === 0" class="text-center py-3">
                <small class="text-muted">No upcoming events</small>
              </div>
              <div
                v-for="event in previewEvents"
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

    <div class="modal fade" id="eventFormModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" style="border: none; border-radius: 16px;">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Event' : 'Add Event' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label class="form-label fw-semibold">Title</label>
                  <input v-model="form.title" class="form-control" required placeholder="Event title" />
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label fw-semibold">Tickets</label>
                  <select v-model="form.tickets" class="form-select" required>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Date</label>
                  <input v-model="form.date" type="date" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Time</label>
                  <input v-model="form.time" type="time" class="form-control" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Venue</label>
                  <input v-model="form.venue" class="form-control" required placeholder="Venue name" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Location</label>
                  <input v-model="form.location" class="form-control" required placeholder="City" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Description</label>
                <textarea v-model="form.description" class="form-control" rows="3" placeholder="Event description"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Image URL</label>
                <input v-model="form.image" class="form-control" placeholder="https://..." />
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 justify-content-center gap-2">
            <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-gold" @click="saveEvent">
              <i class="bi bi-check-lg me-1"></i>{{ editingId ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Modal } from "bootstrap";

export default {
  name: "EventsView",
  setup() {
    const authStore = useAuthStore();
    const activeFilter = ref("All");
    const events = ref([]);
    const form = ref({ title: "", date: "", time: "", venue: "", location: "", description: "", image: "", tickets: "Free" });
    const editingId = ref(null);
    const selectedDate = ref(null);

    let formModal = null;

    const filteredEvents = computed(() => {
      let list = events.value;
      if (activeFilter.value !== "All") {
        list = list.filter((e) => e.tickets === activeFilter.value);
      }
      return list.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    const previewEvents = computed(() => {
      return events.value
        .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);
    });

    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date"));
        const snap = await getDocs(q);
        events.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.error("Failed to fetch events:", e);
      }
    };

    const openAddForm = () => {
      editingId.value = null;
      form.value = { title: "", date: "", time: "", venue: "", location: "", description: "", image: "", tickets: "Free" };
      formModal.show();
    };

    const openEditForm = (event) => {
      editingId.value = event.id;
      form.value = {
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        location: event.location,
        description: event.description || "",
        image: event.image || "",
        tickets: event.tickets,
      };
      formModal.show();
    };

    const saveEvent = async () => {
      try {
        const data = {
          title: form.value.title,
          date: form.value.date,
          time: form.value.time,
          venue: form.value.venue,
          location: form.value.location,
          description: form.value.description,
          image: form.value.image || `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
          tickets: form.value.tickets,
        };
        if (editingId.value) {
          await updateDoc(doc(db, "events", editingId.value), data);
        } else {
          await addDoc(collection(db, "events"), data);
        }
        formModal.hide();
        await fetchEvents();
      } catch (e) {
        console.error("Failed to save event:", e);
      }
    };

    const confirmDelete = async (event) => {
      if (confirm(`Delete event "${event.title}"?`)) {
        try {
          await deleteDoc(doc(db, "events", event.id));
          await fetchEvents();
        } catch (e) {
          console.error("Failed to delete event:", e);
        }
      }
    };

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

    const calendarMonth = ref(new Date().getMonth());
    const calendarYear = ref(new Date().getFullYear());

    const calendarMonthName = computed(() => {
      return new Date(calendarYear.value, calendarMonth.value).toLocaleString("default", { month: "long" });
    });

    const prevMonth = () => {
      if (calendarMonth.value === 0) {
        calendarMonth.value = 11;
        calendarYear.value--;
      } else {
        calendarMonth.value--;
      }
    };

    const nextMonth = () => {
      if (calendarMonth.value === 11) {
        calendarMonth.value = 0;
        calendarYear.value++;
      } else {
        calendarMonth.value++;
      }
    };

    const calendarCells = computed(() => {
      const year = calendarYear.value;
      const month = calendarMonth.value;
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const eventDates = new Set(
        events.value.map((e) => e.date)
      );

      const cells = [];

      for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const m = month === 0 ? 11 : month - 1;
        const y = month === 0 ? year - 1 : year;
        const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cells.push({ day, isCurrentMonth: false, isToday: false, hasEvent: eventDates.has(ds), dateStr: ds });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cells.push({ day, isCurrentMonth: true, isToday: ds === todayStr, hasEvent: eventDates.has(ds), dateStr: ds });
      }

      const remaining = 42 - cells.length;
      for (let day = 1; day <= remaining; day++) {
        const m = month === 11 ? 0 : month + 1;
        const y = month === 11 ? year + 1 : year;
        const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cells.push({ day, isCurrentMonth: false, isToday: false, hasEvent: eventDates.has(ds), dateStr: ds });
      }

      return cells;
    });

    const selectDate = (cell) => {
      selectedDate.value = cell.dateStr;
      activeFilter.value = "All";
    };

    watch(selectedDate, (dateStr) => {
      if (!dateStr) return;
    });

    watch(() => authStore.user, (newUser) => {
      if (!newUser) {
        selectedDate.value = null;
      }
    });

    onMounted(async () => {
      await fetchEvents();
      formModal = new Modal(document.getElementById("eventFormModal"));
    });

    return {
      authStore, activeFilter, events, form, editingId, selectedDate,
      filteredEvents, previewEvents,
      openAddForm, openEditForm, saveEvent, confirmDelete,
      formatDate, getDay, getMonth,
      calendarMonth, calendarYear, calendarMonthName,
      prevMonth, nextMonth, calendarCells, selectDate,
    };
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

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.calendar-weekday {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gold);
  padding: 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-day {
  position: relative;
  padding: 6px 2px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 36px;
}

.calendar-day:hover {
  background: rgba(255, 215, 0, 0.1);
}

.calendar-today .day-number {
  background: var(--gold);
  color: #000;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.calendar-selected {
  background: rgba(255, 215, 0, 0.15);
  outline: 2px solid var(--gold);
}

.event-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  margin-top: 2px;
}

@media (max-width: 768px) {
  .event-card .col-md-4 {
    min-height: 200px !important;
  }
  .event-card .col-md-4 img {
    position: relative !important;
  }
  .event-card-date {
    right: 15px;
  }
  .detail-row {
    font-size: 0.85rem;
    flex-wrap: wrap;
  }
  .detail-row span {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 576px) {
  .filter-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
  .event-card .card-body {
    padding: 16px;
  }
  .event-card h3 {
    font-size: 1.2rem;
  }
  .event-card .btn-gold {
    width: 100%;
  }
  .calendar-day {
    font-size: 0.75rem;
    padding: 4px 1px;
    min-height: 30px;
  }
  .calendar-today .day-number {
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
  }
}
</style>
