<template>
  <div class="members-page">
    <div class="page-header py-5 mt-5">
      <div class="container">
        <p class="text-primary fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">THE TALENTED VOICES</p>
        <h1 class="display-4 fw-bold">Our Members</h1>
        <p class="lead text-secondary">Meet the talented voices behind Dux Stella Voce</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="mb-4">
        <div class="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center gap-2">
          <div class="d-flex align-items-center gap-3 mb-3 mb-lg-0">
            <span class="fw-semibold text-secondary small" style="letter-spacing: 1px;">VIEW</span>
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-sm view-toggle-btn"
                :class="viewMode === 'simple' ? 'active' : ''"
                @click="viewMode = 'simple'"
                title="Simple View"
              >
                <i class="bi bi-list-ul"></i>
              </button>
              <button
                type="button"
                class="btn btn-sm view-toggle-btn"
                :class="viewMode === 'grid' ? 'active' : ''"
                @click="viewMode = 'grid'"
                title="List View"
              >
                <i class="bi bi-list-columns-reverse"></i>
              </button>
            </div>
          </div>
          <div class="role-pills">
            <button
              class="btn role-pill"
              :class="activeFilter === 'All' ? 'active' : ''"
              @click="activeFilter = 'All'"
            >
              <i class="bi bi-people me-1"></i>All Members
            </button>
            <button
              class="btn role-pill role-soprano"
              :class="activeFilter === 'Soprano' ? 'active' : ''"
              @click="activeFilter = 'Soprano'"
            >
              <i class="bi bi-music-note me-1"></i>Soprano
            </button>
            <button
              class="btn role-pill role-alto"
              :class="activeFilter === 'Alto' ? 'active' : ''"
              @click="activeFilter = 'Alto'"
            >
              <i class="bi bi-music-note me-1"></i>Alto
            </button>
            <button
              class="btn role-pill role-tenor"
              :class="activeFilter === 'Tenor' ? 'active' : ''"
              @click="activeFilter = 'Tenor'"
            >
              <i class="bi bi-music-note me-1"></i>Tenor
            </button>
            <button
              class="btn role-pill role-bass"
              :class="activeFilter === 'Bass' ? 'active' : ''"
              @click="activeFilter = 'Bass'"
            >
              <i class="bi bi-music-note me-1"></i>Bass
            </button>
          </div>
          <button v-if="isAdminOrManager" class="btn btn-primary w-100 w-lg-auto" @click="openAddForm">
            <i class="bi bi-plus-lg me-1"></i>Add Member
          </button>
        </div>
      </div>

      <div v-if="viewMode === 'simple'" class="simple-view">
          <div class="voice-section" v-for="role in ['Soprano', 'Alto', 'Tenor', 'Bass']" :key="role">
            <h3 class="voice-section-title" :style="{ borderColor: getRoleColor(role) }">
              {{ role }}
            </h3>
            <p v-if="filteredMembers.some(m => m.role === role)" class="member-sentence">
              {{ filteredMembers.filter(m => m.role === role).map(m => m.name).join(', ') }}
            </p>
            <p v-else class="text-muted text-center py-3 small">No members in this section yet</p>
          </div>
        </div>

        <div v-else class="list-view-alt row">
          <div class="col-12">
            <div class="voice-section" v-for="role in ['Soprano', 'Alto', 'Tenor', 'Bass']" :key="role">
              <h3 class="voice-section-title" :style="{ borderColor: getRoleColor(role) }">
                {{ role }}
              </h3>
              <ul v-if="filteredMembers.some(m => m.role === role)" class="member-list">
                <li v-for="member in filteredMembers.filter(m => m.role === role)" :key="member.id" class="member-list-item">
                  <div class="member-avatar-sm">
                    <img :src="member.image || getDefaultImage(member.name, member.role)" :alt="member.name" />
                  </div>
                  <div class="member-info">
                    <span class="member-name fw-semibold">{{ member.name }}</span>
                    <span v-if="member.bio" class="member-bio text-muted small">{{ member.bio }}</span>
                  </div>
                  <div class="member-actions" v-if="isAdminOrManager">
                    <button class="btn btn-sm btn-outline-primary" @click="openEditForm(member)" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(member)" title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <button class="btn btn-sm btn-outline-gold" @click="selectedMember = member" data-bs-toggle="modal" data-bs-target="#memberModal">
                    <i class="bi bi-person-badge me-1"></i>View
                  </button>
                </li>
              </ul>
              <p v-else class="text-muted text-center py-3 small">No members in this section yet</p>
            </div>
          </div>
        </div>

      <div v-if="filteredMembers.length === 0" class="text-center py-5">
        <i class="bi bi-people display-1" style="color: var(--text-muted);"></i>
        <h4 class="mt-3">No members found</h4>
        <p class="text-muted">No members in this voice category yet</p>
      </div>

      <!-- Member Modal -->
      <div class="modal fade" id="memberModal" tabindex="-1" v-if="selectedMember">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-card">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">{{ selectedMember.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <div class="position-relative d-inline-block mb-3">
                <img
                  :src="selectedMember.image || getDefaultImage(selectedMember.name, selectedMember.role)"
                  class="rounded-circle"
                  width="120"
                  height="120"
                  style="object-fit: cover; border: 3px solid var(--gold);"
                  :alt="selectedMember.name"
                />
              </div>
              <h4 class="fw-bold">{{ selectedMember.name }}</h4>
              <span class="badge mb-3 px-3 py-2" :style="getRoleBadgeStyle(selectedMember.role)">{{ selectedMember.role }}</span>
              <p class="text-muted mt-2">{{ selectedMember.bio }}</p>
              <div class="d-flex align-items-center justify-content-center gap-2 text-muted">
                <i class="bi bi-calendar-check" style="color: var(--gold);"></i>
                <span>Member since {{ formatDate(selectedMember.joinDate) }}</span>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add / Edit Member Modal -->
      <div class="modal fade" id="memberFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-card">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Member' : 'Add Member' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveMember">
                <div class="mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Name</label>
                  <input v-model="form.name" class="form-control theme-input" required placeholder="Full name" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Role</label>
                  <select v-model="form.role" class="form-select theme-select" required>
                    <option value="" disabled>Select voice role...</option>
                    <option>Soprano</option>
                    <option>Alto</option>
                    <option>Tenor</option>
                    <option>Bass</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Image URL</label>
                  <input v-model="form.image" class="form-control theme-input" placeholder="https://..." />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Bio</label>
                  <textarea v-model="form.bio" class="form-control theme-input" rows="3" placeholder="Short description"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold" style="color: var(--text-primary);">Join Date</label>
                  <input v-model="form.joinDate" type="date" class="form-control theme-input" required />
                </div>
              </form>
            </div>
            <div class="modal-footer border-0 justify-content-center gap-2">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Cancel
              </button>
              <button type="button" class="btn btn-primary" @click="saveMember">
                <i class="bi bi-check-lg me-1"></i>{{ editingId ? 'Update' : 'Save' }}
              </button>
            </div>
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy } from "firebase/firestore";
import { Modal } from "bootstrap";

export default {
  name: "MembersView",
  setup() {
    const authStore = useAuthStore();
    const activeFilter = ref("All");
    const selectedMember = ref(null);
    const members = ref([]);
    const form = ref({ name: "", role: "", image: "", bio: "", joinDate: "" });
    const editingId = ref(null);
    const userRole = ref(null);
    const viewMode = ref("simple");

    let formModal = null;

    const isAdminOrManager = computed(() => userRole.value === "admin" || userRole.value === "manager");

    const filteredMembers = computed(() => {
      if (activeFilter.value === "All") return members.value;
      return members.value.filter((m) => m.role === activeFilter.value);
    });

    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "members"), orderBy("name"));
        const snap = await getDocs(q);
        members.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.error("Failed to fetch members:", e);
      }
    };

    const fetchUserRole = async (uid) => {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) userRole.value = snap.data().role;
      } catch {
        userRole.value = null;
      }
    };

    const openAddForm = () => {
      editingId.value = null;
      form.value = { name: "", role: "", image: "", bio: "", joinDate: new Date().toISOString().split("T")[0] };
      formModal.show();
    };

    const openEditForm = (member) => {
      editingId.value = member.id;
      form.value = { name: member.name, role: member.role, image: member.image || "", bio: member.bio || "", joinDate: member.joinDate };
      formModal.show();
    };

    const saveMember = async () => {
      try {
        const data = { name: form.value.name, role: form.value.role, image: form.value.image, bio: form.value.bio, joinDate: form.value.joinDate };
        if (editingId.value) {
          await updateDoc(doc(db, "members", editingId.value), data);
        } else {
          await addDoc(collection(db, "members"), data);
        }
        formModal.hide();
        await fetchMembers();
      } catch (e) {
        console.error("Failed to save member:", e);
      }
    };

    const confirmDelete = async (member) => {
      if (confirm(`Delete member "${member.name}"?`)) {
        try {
          await deleteDoc(doc(db, "members", member.id));
          await fetchMembers();
        } catch (e) {
          console.error("Failed to delete member:", e);
        }
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    const getRoleColor = (role) => {
      const colors = { Soprano: "#dc3545", Alto: "#198754", Tenor: "#ffc107", Bass: "#0d6efd" };
      return colors[role] || "#6c757d";
    };

    const getRoleBadgeStyle = (role) => {
      const color = getRoleColor(role);
      return {
        backgroundColor: color,
        color: role === 'Tenor' ? '#000' : '#fff',
        borderColor: color
      };
    };

    const getDefaultImage = (name, role) => {
      const bgColors = { Soprano: 'dc3545', Alto: '198754', Tenor: 'ffc107', Bass: '0d6efd' };
      const bg = bgColors[role] || '6c757d';
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=fff&size=200&font-size=0.5&bold=true`;
    };

    watch(() => authStore.user, (newUser) => {
      if (newUser) fetchUserRole(newUser.uid);
      else userRole.value = null;
    });

    onMounted(async () => {
      await fetchMembers();

      if (authStore.user) await fetchUserRole(authStore.user.uid);

      formModal = new Modal(document.getElementById("memberFormModal"));
    });

    return { activeFilter, selectedMember, members, form, editingId, isAdminOrManager, filteredMembers, openAddForm, openEditForm, saveMember, confirmDelete, formatDate, getRoleColor, getRoleBadgeStyle, getDefaultImage, viewMode };
  },
};
</script>

<style scoped>
.role-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.role-pill {
  border-radius: 25px;
  padding: 10px 24px;
  font-weight: 600;
  border: 2px solid var(--glass-border);
  color: var(--text-secondary);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  transition: var(--transition-smooth);
}

.role-pill:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elegant);
  border-color: var(--gold);
  color: var(--text-primary);
}

.role-pill.active {
  border-color: var(--gold);
  background: var(--gold);
  color: var(--dark);
}

.role-pill.role-soprano.active { border-color: #dc3545; background: #dc3545; color: #fff; }
.role-pill.role-alto.active { border-color: #198754; background: #198754; color: #fff; }
.role-pill.role-tenor.active { border-color: #ffc107; background: #ffc107; color: #000; }
.role-pill.role-bass.active { border-color: #0d6efd; background: #0d6efd; color: #fff; }

.member-card {
  transition: var(--transition-smooth);
  overflow: hidden;
  border-radius: 16px;
  background: rgba(47, 23, 63, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.member-card:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--primary);
}

.member-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 180px;
}

.member-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: brightness(0.65);
}

.member-card:hover .member-image-wrapper img {
  transform: scale(1.15);
  filter: brightness(0.8);
}

.member-role-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 18px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.member-avatar {
  margin-top: -60px;
  position: relative;
  z-index: 2;
}

.member-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-body {
  padding: 2rem 1.5rem 1rem;
}

.card-title {
  color: var(--text-primary) !important;
}

.card-text, .text-muted {
  color: var(--text-secondary) !important;
}

.card-footer {
  padding: 0 1.5rem 1.5rem !important;
}

.btn-outline-gold {
  border: 2px solid var(--gold);
  color: var(--gold);
  background: transparent;
  border-radius: 25px;
  font-weight: 600;
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

@media (max-width: 768px) {
  .role-pill {
    padding: 8px 18px;
    font-size: 0.85rem;
  }
  .member-image-wrapper {
    height: 150px;
  }
  .member-avatar img {
    width: 64px;
    height: 64px;
  }
  .member-avatar {
    margin-top: -48px;
  }
}

@media (max-width: 576px) {
  .role-pills {
    gap: 6px;
  }
  .role-pill {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
  .role-pill i {
    display: none;
  }
}

.view-toggle-btn {
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-secondary);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
  backdrop-filter: blur(10px);
}

.view-toggle-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: var(--bg-tertiary);
  transform: translateY(-2px);
}

.view-toggle-btn.active {
  border-color: var(--gold);
  background: var(--gold);
  color: var(--dark);
}

.simple-view {
  max-width: 800px;
  margin: 0 auto;
}

.voice-section {
  margin-bottom: 3rem;
}

.voice-section-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 0.75rem;
  border-bottom: 3px solid;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.member-sentence {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  padding: 0.75rem 0;
}

.list-view-alt {
  max-width: 800px;
  margin: 0 auto;
}

.list-view-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-view-row {
  display: flex;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: var(--transition-smooth);
}

.list-view-row:hover {
  transform: translateX(6px);
  border-color: var(--gold);
  box-shadow: var(--shadow-elegant);
}

.member-name-only {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
}

.voice-count {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
  color: #fff;
}

.member-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.member-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: var(--transition-smooth);
  backdrop-filter: blur(10px);
}

.member-list-item:hover {
  transform: translateX(8px);
  border-color: var(--gold);
  box-shadow: var(--shadow-elegant);
}

.member-avatar-sm {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--glass-border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.member-avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-bio {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .voice-section-title {
    font-size: 1.25rem;
  }
  .member-list-item {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .member-info {
    flex: 1 1 calc(100% - 70px);
  }
  .member-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
  .btn-outline-gold {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .member-list-item {
    padding: 0.75rem;
  }
  .member-avatar-sm {
    width: 40px;
    height: 40px;
  }
  .voice-section-title {
    font-size: 1.1rem;
  }
}
</style>
