<template>
  <div class="members-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <h1 class="display-4 fw-bold">Our Members</h1>
        <p class="lead">Meet the talented voices behind Harmony Voices Choir</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Filter Buttons -->
      <div class="text-center mb-5">
        <button
          class="btn btn-outline-dark mx-2 mb-2"
          :class="{ active: activeFilter === 'All' }"
          @click="activeFilter = 'All'"
        >
          All Members
        </button>
        <button
          class="btn btn-outline-danger mx-2 mb-2"
          :class="{ active: activeFilter === 'Soprano' }"
          @click="activeFilter = 'Soprano'"
        >
          Soprano
        </button>
        <button
          class="btn btn-outline-success mx-2 mb-2"
          :class="{ active: activeFilter === 'Alto' }"
          @click="activeFilter = 'Alto'"
        >
          Alto
        </button>
        <button
          class="btn btn-outline-warning mx-2 mb-2"
          :class="{ active: activeFilter === 'Tenor' }"
          @click="activeFilter = 'Tenor'"
        >
          Tenor
        </button>
        <button
          class="btn btn-outline-primary mx-2 mb-2"
          :class="{ active: activeFilter === 'Bass' }"
          @click="activeFilter = 'Bass'"
        >
          Bass
        </button>
      </div>

      <!-- Members Grid -->
      <div class="row">
        <div
          class="col-lg-3 col-md-4 col-sm-6 mb-4"
          v-for="member in filteredMembers"
          :key="member.id"
        >
          <div class="card member-card border-0 shadow-sm h-100">
            <div class="member-image-wrapper">
              <img :src="member.image" class="card-img-top" :alt="member.name" />
              <div class="member-role-badge" :class="'bg-' + getRoleColor(member.role)">
                {{ member.role }}
              </div>
            </div>
            <div class="card-body text-center">
              <h5 class="card-title fw-bold mb-1">{{ member.name }}</h5>
              <p class="text-muted mb-2">{{ member.bio }}</p>
              <small class="text-muted">
                <i class="bi bi-calendar-check me-1"></i>
                Joined {{ formatDate(member.joinDate) }}
              </small>
            </div>
            <div class="card-footer bg-white border-0 text-center">
              <button
                class="btn btn-sm btn-outline-dark"
                @click="selectedMember = member"
                data-bs-toggle="modal"
                data-bs-target="#memberModal"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Modal -->
      <div class="modal fade" id="memberModal" tabindex="-1" v-if="selectedMember">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedMember.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <img
                :src="selectedMember.image"
                class="rounded-circle mb-3"
                width="150"
                :alt="selectedMember.name"
              />
              <h4>{{ selectedMember.name }}</h4>
              <span class="badge bg-gold mb-3">{{ selectedMember.role }}</span>
              <p>{{ selectedMember.bio }}</p>
              <p class="text-muted">
                <i class="bi bi-calendar-check me-1"></i>
                Member since {{ formatDate(selectedMember.joinDate) }}
              </p>
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
  name: "MembersView",
  setup() {
    const choirStore = useChoirStore();
    const activeFilter = ref("All");
    const selectedMember = ref(null);

    const filteredMembers = computed(() => {
      if (activeFilter.value === "All") return choirStore.members;
      return choirStore.members.filter((m) => m.role === activeFilter.value);
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    const getRoleColor = (role) => {
      const colors = {
        Soprano: "danger",
        Alto: "success",
        Tenor: "warning",
        Bass: "primary",
      };
      return colors[role] || "secondary";
    };

    return { choirStore, activeFilter, selectedMember, filteredMembers, formatDate, getRoleColor };
  },
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-top: -76px;
  padding-top: 100px;
}

.member-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.member-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
}

.member-image-wrapper {
  position: relative;
  overflow: hidden;
}

.member-image-wrapper img {
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.member-card:hover .member-image-wrapper img {
  transform: scale(1.1);
}

.member-role-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.85rem;
}

.bg-gold {
  background-color: #ffd700;
  color: #000;
}
</style>
