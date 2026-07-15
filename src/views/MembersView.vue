<template>
  <div class="members-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">THE TALENTED VOICES</p>
        <h1 class="display-4 fw-bold">Our Members</h1>
        <p class="lead text-white-50">Meet the talented voices behind Harmony Voices Choir</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="mb-4">
        <div class="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center gap-2">
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
          <button v-if="isAdminOrManager" class="btn btn-gold w-100 w-lg-auto" @click="openAddForm">
            <i class="bi bi-plus-lg me-1"></i>Add Member
          </button>
        </div>
      </div>

      <div class="row stagger-children" ref="membersGrid">
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
              <div class="member-avatar mb-3">
                <img :src="member.image" :alt="member.name" />
              </div>
              <h5 class="card-title fw-bold mb-1">{{ member.name }}</h5>
              <p class="text-muted small mb-2">{{ member.bio }}</p>
              <div class="d-flex align-items-center justify-content-center gap-2 text-muted" style="font-size: 0.8rem;">
                <i class="bi bi-calendar-check text-gold"></i>
                <span>Joined {{ formatDate(member.joinDate) }}</span>
              </div>
            </div>
            <div class="card-footer bg-white border-0 text-center pt-0">
              <div v-if="isAdminOrManager" class="d-flex gap-2 justify-content-center mb-2">
                <button class="btn btn-sm btn-outline-primary" @click="openEditForm(member)" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(member)" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button
                class="btn btn-outline-gold btn-sm px-4"
                @click="selectedMember = member"
                data-bs-toggle="modal"
                data-bs-target="#memberModal"
              >
                <i class="bi bi-person-badge me-1"></i>View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMembers.length === 0" class="text-center py-5">
        <i class="bi bi-people display-1 text-muted"></i>
        <h4 class="mt-3">No members found</h4>
        <p class="text-muted">No members in this voice category yet</p>
      </div>

      <!-- Member Modal -->
      <div class="modal fade" id="memberModal" tabindex="-1" v-if="selectedMember">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border: none; border-radius: 16px;">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">{{ selectedMember.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <div class="position-relative d-inline-block mb-3">
                <img
                  :src="selectedMember.image"
                  class="rounded-circle"
                  width="120"
                  height="120"
                  style="object-fit: cover; border: 3px solid var(--gold);"
                  :alt="selectedMember.name"
                />
              </div>
              <h4 class="fw-bold">{{ selectedMember.name }}</h4>
              <span class="badge bg-gold mb-3 px-3 py-2">{{ selectedMember.role }}</span>
              <p class="text-muted mt-2">{{ selectedMember.bio }}</p>
              <div class="d-flex align-items-center justify-content-center gap-2 text-muted">
                <i class="bi bi-calendar-check text-gold"></i>
                <span>Member since {{ formatDate(selectedMember.joinDate) }}</span>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add / Edit Member Modal -->
      <div class="modal fade" id="memberFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border: none; border-radius: 16px;">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Member' : 'Add Member' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveMember">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Name</label>
                  <input v-model="form.name" class="form-control" required placeholder="Full name" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Role</label>
                  <select v-model="form.role" class="form-select" required>
                    <option value="" disabled>Select voice role...</option>
                    <option>Soprano</option>
                    <option>Alto</option>
                    <option>Tenor</option>
                    <option>Bass</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Image URL</label>
                  <input v-model="form.image" class="form-control" placeholder="https://..." />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Bio</label>
                  <textarea v-model="form.bio" class="form-control" rows="3" placeholder="Short description"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Join Date</label>
                  <input v-model="form.joinDate" type="date" class="form-control" required />
                </div>
              </form>
            </div>
            <div class="modal-footer border-0 justify-content-center gap-2">
              <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Cancel
              </button>
              <button type="button" class="btn btn-gold" @click="saveMember">
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
    const membersGrid = ref(null);
    const members = ref([]);
    const form = ref({ name: "", role: "", image: "", bio: "", joinDate: "" });
    const editingId = ref(null);
    const userRole = ref(null);

    let formModal = null;

    const isAdminOrManager = computed(() => userRole.value === "admin" || userRole.value === "manager");

    const filteredMembers = computed(() => {
      if (activeFilter.value === "All") return members.value;
      return members.value.filter((m) => m.role === activeFilter.value);
    });

    const fetchMembers = async () => {
      const q = query(collection(db, "members"), orderBy("name"));
      const snap = await getDocs(q);
      members.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      const colors = { Soprano: "danger", Alto: "success", Tenor: "warning", Bass: "primary" };
      return colors[role] || "secondary";
    };

    watch(() => authStore.user, (newUser) => {
      if (newUser) fetchUserRole(newUser.uid);
      else userRole.value = null;
    });

    onMounted(async () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      if (membersGrid.value) observer.observe(membersGrid.value);

      await fetchMembers();

      if (authStore.user) await fetchUserRole(authStore.user.uid);

      formModal = new Modal(document.getElementById("memberFormModal"));
    });

    return { activeFilter, selectedMember, membersGrid, members, form, editingId, isAdminOrManager, filteredMembers, openAddForm, openEditForm, saveMember, confirmDelete, formatDate, getRoleColor };
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
  border: 2px solid #dee2e6;
  color: #495057;
  background: transparent;
  transition: var(--transition-smooth);
}

.role-pill:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elegant);
}

.role-pill.active {
  border-color: var(--gold);
  background: var(--gold);
  color: #000;
}

.role-pill.role-soprano.active { border-color: #dc3545; background: #dc3545; color: #fff; }
.role-pill.role-alto.active { border-color: #198754; background: #198754; color: #fff; }
.role-pill.role-tenor.active { border-color: #ffc107; background: #ffc107; color: #000; }
.role-pill.role-bass.active { border-color: #0d6efd; background: #0d6efd; color: #fff; }

.member-card {
  transition: var(--transition-smooth);
  overflow: hidden;
  border-radius: 16px;
}

.member-card:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow-hover) !important;
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
  filter: brightness(0.7);
}

.member-card:hover .member-image-wrapper img {
  transform: scale(1.15);
}

.member-role-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
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
</style>
