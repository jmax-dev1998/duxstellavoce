<template>
  <div class="events-page">
    <div class="page-header py-5 mt-5">
      <div class="container">
        <p class="text-primary fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">UPCOMING PERFORMANCES</p>
        <h1 class="display-4 fw-bold">Events</h1>
        <p class="lead text-secondary">Join us for our upcoming performances and concerts</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div class="mb-4 d-flex gap-2 flex-wrap align-items-center justify-content-between">
            <div class="d-flex gap-2 flex-wrap filter-pills">
              <button
                class="btn filter-pill"
                :class="activeFilter === 'All' ? 'active' : ''"
                @click="activeFilter = 'All'"
              >All Events</button>
              <button
                class="btn filter-pill filter-free"
                :class="activeFilter === 'Free' ? 'active' : ''"
                @click="activeFilter = 'Free'"
              ><i class="bi bi-ticket-perforated me-1"></i>Free</button>
              <button
                class="btn filter-pill filter-paid"
                :class="activeFilter === 'Paid' ? 'active' : ''"
                @click="activeFilter = 'Paid'"
              ><i class="bi bi-ticket-fill me-1"></i>Paid</button>
            </div>
            <button v-if="authStore.isAdminOrManager" class="btn btn-primary w-100 w-lg-auto" @click="openAddForm">
              <i class="bi bi-plus-lg me-1"></i>Add Event
            </button>
          </div>

          <div
            class="card event-card border-0 mb-4"
            v-for="event in filteredEvents"
            :key="event.id"
          >
            <div class="row g-0">
              <div class="col-md-4 position-relative overflow-hidden" style="min-height: 220px;">
                <img
                  :src="event.image || getDefaultImage(event.title, event.tickets)"
                  class="img-fluid h-100 w-100 event-image"
                  :alt="event.title"
                />
                <div class="event-card-date">
                  <span class="fw-bold fs-5">{{ getDay(event.date) }}</span>
                  <span>{{ getMonth(event.date) }}</span>
                </div>
                <div class="event-overlay"></div>
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                    <span class="badge event-badge" :style="getTicketBadgeStyle(event.tickets || event.type)">
                      {{ event.tickets || event.type }}
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
                      <i class="bi bi-calendar-check" style="color: var(--gold);"></i>
                      <span>{{ formatDate(event.date) }}</span>
                    </div>
                    <div class="detail-row">
                      <i class="bi bi-clock" style="color: var(--gold);"></i>
                      <span>{{ event.time }}</span>
                    </div>
                    <div class="detail-row">
                      <i class="bi bi-geo-alt" style="color: var(--gold);"></i>
                      <span>{{ event.venue }}, {{ event.location }}</span>
                    </div>
                  </div>
                  <p class="card-text text-muted mt-3">{{ event.description }}</p>
                  <button v-if="!event.type || event.type === 'Concert'" class="btn btn-outline-gold mt-2">
                    <i class="bi bi-ticket me-1"></i>Get Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredEvents.length === 0" class="text-center py-5">
            <i class="bi bi-calendar-x display-1" style="color: var(--text-muted);"></i>
            <h4 class="mt-3">No events found</h4>
            <p class="text-muted">Check back later for upcoming performances</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 mb-4 calendar-card">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <button class="btn btn-sm calendar-nav-btn" @click="prevMonth" aria-label="Previous month">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <h5 class="fw-bold mb-0">
                  {{ calendarMonthName }} <span class="text-primary">{{ calendarYear }}</span>
                </h5>
                <button class="btn btn-sm calendar-nav-btn" @click="nextMonth" aria-label="Next month">
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
                  role="button"
                  tabindex="0"
                  @keydown.enter="selectDate(cell)"
                  @keydown.space.prevent="selectDate(cell)"
                >
                  <span class="day-number">{{ cell.day }}</span>
                  <div v-if="cell.hasEvent" class="event-dot"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 upcoming-events-card">
            <div class="card-body">
              <h6 class="fw-bold mb-3">
                <i class="bi bi-lightning text-primary me-1"></i>Upcoming Events
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
                  <div class="date-box text-center rounded-3 p-2" style="background: var(--glass-bg); border: 1px solid var(--glass-border); min-width: 50px;">
                    <small class="d-block fw-bold text-primary fs-6">{{ getDay(event.date) }}</small>
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
        <div class="modal-content glass-card">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Event' : 'Add Event' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEvent">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Title</label>
                  <input v-model="form.title" class="form-control theme-input" required placeholder="Event title" />
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Type</label>
                  <select v-model="form.type" class="form-select theme-select" required>
                    <option value="Concert">Concert</option>
                    <option value="Rehearsal">Rehearsal</option>
                    <option value="Services">Services</option>
                    <option value="Invitation">Invitation</option>
                  </select>
                </div>
              </div>
              <div v-if="form.type === 'Concert'" class="row">
                <div class="col-md-12 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Ticketing</label>
                  <select v-model="form.tickets" class="form-select theme-select" required>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Date</label>
                  <input v-model="form.date" type="date" class="form-control theme-input" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Time</label>
                  <input v-model="form.time" type="time" class="form-control theme-input" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Venue</label>
                  <input v-model="form.venue" class="form-control theme-input" required placeholder="Venue name" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Location</label>
                  <input v-model="form.location" class="form-control theme-input" required placeholder="City" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="color: var(--text-primary);">Description</label>
                <textarea v-model="form.description" class="form-control theme-input" rows="3" placeholder="Event description"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="color: var(--text-primary);">Image URL</label>
                <input v-model="form.image" class="form-control theme-input" placeholder="https://..." />
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 justify-content-center gap-2">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="saveEvent">
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, deleteField } from "firebase/firestore";
import { Modal } from "bootstrap";

export default {
  name: "EventsView",
  setup() {
    const authStore = useAuthStore();
    const activeFilter = ref("All");
    const events = ref([]);
    const form = ref({ title: "", date: "", time: "", venue: "", location: "", description: "", image: "", type: "Concert", tickets: "Free" });
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
      form.value = { title: "", date: "", time: "", venue: "", location: "", description: "", image: "", type: "Concert", tickets: "Free" };
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
        type: event.type || "Concert",
        tickets: event.tickets || "Free",
      };
      formModal.show();
    };

    const saveEvent = async () => {
      try {
        const baseData = {
          title: form.value.title,
          date: form.value.date,
          time: form.value.time,
          venue: form.value.venue,
          location: form.value.location,
          description: form.value.description,
          image: form.value.image || `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
          type: form.value.type,
        };

        if (form.value.type === "Concert") {
          baseData.tickets = form.value.tickets;
        }

        if (editingId.value) {
          if (form.value.type === "Concert") {
            await updateDoc(doc(db, "events", editingId.value), baseData);
          } else {
            await updateDoc(doc(db, "events", editingId.value), {
              ...baseData,
              tickets: deleteField(),
            });
          }
        } else {
          await addDoc(collection(db, "events"), baseData);
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

    const getDefaultImage = (title, tickets) => {
      const bgColors = { Free: '198754', Paid: 'd4a853' };
      const bg = bgColors[tickets] || '7c5521';
      const initials = title.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=fff&size=800&font-size=0.35&bold=true`;
    };

    const getTicketBadgeStyle = (tickets) => {
      const colors = { Free: '#198754', Paid: '#d4a853' };
      const color = colors[tickets] || '#7c5521';
      return {
        backgroundColor: color,
        color: tickets === 'Paid' ? '#000' : '#fff',
        borderColor: color
      };
    };

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
      getDefaultImage, getTicketBadgeStyle,
    };
  },
};
</script>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-pill {
  border-radius: 25px;
  padding: 10px 24px;
  font-weight: 600;
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  transition: var(--transition-smooth);
}

.filter-pill:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elegant);
  border-color: var(--gold);
  color: var(--text-primary);
}

.filter-pill.active {
  border-color: var(--gold);
  background: var(--gold);
  color: var(--dark);
}

.filter-pill.filter-free.active { border-color: #198754; background: #198754; color: #fff; }
.filter-pill.filter-paid.active { border-color: #d4a853; background: #d4a853; color: #000; }

.event-card {
  transition: var(--transition-smooth);
  overflow: hidden;
  border-radius: 16px;
  background: rgba(47, 23, 63, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--primary);
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: brightness(0.7);
}

.event-card:hover .event-image {
  transform: scale(1.1);
  filter: brightness(0.85);
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(47, 23, 63, 0.3) 0%, rgba(26, 13, 46, 0.5) 100%);
  opacity: 0;
  transition: var(--transition-smooth);
}

.event-card:hover .event-overlay {
  opacity: 1;
}

.event-card-date {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--bg);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 10px 18px;
  text-align: center;
  color: var(--gold);
  line-height: 1.2;
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.event-card-date span:last-child {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.event-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.detail-row i {
  width: 20px;
  text-align: center;
}

.card-title {
  color: var(--text-primary) !important;
}

.card-text, .text-muted {
  color: var(--text-secondary) !important;
}

.btn-outline-gold {
  border: 2px solid var(--gold);
  color: var(--gold);
  background: transparent;
  border-radius: 25px;
  font-weight: 600;
  padding: 10px 28px;
  transition: var(--transition-smooth);
}

.btn-outline-gold:hover {
  background: var(--gold);
  color: var(--dark);
  box-shadow: 0 8px 25px rgba(212, 168, 83, 0.3);
  transform: translateY(-3px);
}

.btn-outline-primary {
  border: 2px solid var(--primary);
  color: var(--primary);
  background: transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 8px 25px rgba(124, 85, 33, 0.3);
}

.btn-outline-danger {
  border: 2px solid #dc3545;
  color: #dc3545;
  background: transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.calendar-card,
.upcoming-events-card {
  background: rgba(47, 23, 63, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  color: var(--text-primary);
}

.calendar-nav-btn {
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.calendar-nav-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(212, 168, 83, 0.1);
  transform: scale(1.05);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.calendar-weekday {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gold);
  padding: 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-day {
  position: relative;
  padding: 8px 2px;
  border-radius: 10px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 40px;
  color: var(--text-primary);
}

.calendar-day:hover {
  background: var(--glass-bg);
}

.calendar-day.text-muted {
  color: var(--text-muted);
}

.calendar-today .day-number {
  background: var(--gold);
  color: var(--dark);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.calendar-selected {
  background: var(--glass-bg);
  outline: 2px solid var(--gold);
  outline-offset: -2px;
}

.calendar-selected .day-number {
  color: var(--gold);
  font-weight: 700;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  margin-top: 4px;
  box-shadow: 0 0 8px var(--gold);
}

.quick-event {
  border-radius: 10px;
  transition: var(--transition-smooth);
  cursor: default;
}

.quick-event:hover {
  background: var(--glass-bg);
}

.date-box {
  border-radius: 10px !important;
}

.modal-content {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--text-primary);
}

.modal-header,
.modal-footer,
.modal-body {
  border-color: var(--glass-border) !important;
}

.btn-close {
  filter: invert(1) opacity(0.7);
  transition: var(--transition-smooth);
}

.btn-close:hover {
  filter: invert(1) opacity(1);
}

.theme-input,
.theme-select {
  background: var(--bg-secondary) !important;
  border: 2px solid var(--glass-border) !important;
  color: var(--text-primary) !important;
  border-radius: 10px;
  padding: 10px 14px;
  transition: var(--transition-smooth);
}

.theme-input:focus,
.theme-select:focus {
  border-color: var(--gold) !important;
  box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.15) !important;
  background: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
}

.theme-input::placeholder {
  color: var(--text-muted) !important;
}

.form-label {
  color: var(--text-primary) !important;
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
    padding: 8px 14px;
  }
  .detail-row {
    font-size: 0.85rem;
    flex-wrap: wrap;
  }
  .detail-row span {
    flex: 1;
    min-width: 0;
  }
  .filter-pill {
    padding: 8px 18px;
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .filter-pill {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
  .filter-pill i {
    display: none;
  }
  .event-card .card-body {
    padding: 16px;
  }
  .event-card h3 {
    font-size: 1.2rem;
  }
  .event-card .btn-outline-gold {
    width: 100%;
  }
  .calendar-day {
    font-size: 0.75rem;
    padding: 4px 1px;
    min-height: 30px;
  }
  .calendar-today .day-number {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
  .event-card-date {
    padding: 6px 12px;
  }
  .event-card-date span:first-child {
    font-size: 1rem;
  }
}
</style>
