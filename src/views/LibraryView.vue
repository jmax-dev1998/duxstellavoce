<template>
  <div class="library-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">AUDIO & VIDEO ARCHIVE</p>
        <h1 class="display-4 fw-bold">Library</h1>
        <p class="lead text-white-50">Explore our extensive collection of choral recordings</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row mb-4">
        <div class="col mb-3">
          <div class="search-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              v-model="searchQuery"
              placeholder="Search by title..."
            />
          </div>
        </div>
        <div class="col-auto mb-3 d-flex gap-2">
          <button class="btn btn-gold" @click="searchQuery = ''">
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
          <button v-if="authStore.isAdminOrManager" class="btn btn-gold" @click="openAddForm">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 library-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th class="text-center">Audio</th>
                  <th class="text-center">Video</th>
                  <th v-if="authStore.isAdminOrManager" class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(piece, index) in filteredLibrary" :key="piece.id" class="library-row">
                  <td class="text-muted">{{ index + 1 }}</td>
                  <td class="fw-bold">
                    <i class="bi bi-music-note text-gold me-2"></i>{{ piece.title }}
                  </td>
                  <td class="text-center">
                    <button
                      v-if="piece.audioId"
                      class="btn btn-sm btn-gold"
                      @click="openPreview(piece, 'audio')"
                      title="Preview audio"
                    >
                      <i class="bi bi-play-fill me-1"></i>Play
                    </button>
                    <span v-else class="text-muted small">—</span>
                  </td>
                  <td class="text-center">
                    <button
                      v-if="piece.videoUrl"
                      class="btn btn-sm btn-outline-info"
                      @click="openPreview(piece, 'video')"
                      title="Preview video"
                    >
                      <i class="bi bi-play-circle me-1"></i>Watch
                    </button>
                    <span v-else class="text-muted small">—</span>
                  </td>
                  <td v-if="authStore.isAdminOrManager" class="text-center">
                    <div class="d-flex gap-1 justify-content-center">
                      <button class="btn btn-sm btn-outline-primary" @click="openEditForm(piece)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(piece)" title="Delete">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredLibrary.length === 0" class="text-center py-5">
            <i class="bi bi-music-note-list display-1 text-muted"></i>
            <h5 class="mt-3">No results found</h5>
            <p class="text-muted">Try adjusting your search</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div class="modal fade" id="libraryFormModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: none; border-radius: 16px;">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Entry' : 'Add Entry' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="uploadError" class="alert alert-danger py-2 small">{{ uploadError }}</div>

            <div v-if="authStore.isAdminOrManager && !googleDrive.isOAuthConfigured()" class="alert alert-warning py-2 small">
              Google Drive upload not configured. Set <code>VITE_GOOGLE_DRIVE_CLIENT_ID</code> in .env to enable audio uploads.
            </div>

            <form @submit.prevent="savePiece">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Title</label>
                <input v-model="form.title" class="form-control" required placeholder="Entry title" />
              </div>

              <!-- Audio (Add) -->
              <div class="mb-3" v-if="!editingId">
                <label class="form-label fw-semibold">Audio File</label>
                <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                  <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                    <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-google me-1"></i>
                    Sign in with Google to upload Audio
                  </button>
                  <div v-if="driveAuthStatus === 'error' && driveAuthError" class="mt-1">
                    <small class="text-danger">{{ driveAuthError }}</small>
                  </div>
                </div>
                <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                  <input type="file" ref="audioFileInput" accept="audio/*" class="form-control" @change="onAudioFileChange" />
                  <small class="text-muted" v-if="audioFile">Selected: {{ audioFile.name }}</small>
                </div>
              </div>

              <!-- Audio (Edit) -->
              <div class="mb-3" v-else>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="replaceAudio" v-model="replaceAudio" />
                  <label class="form-check-label fw-semibold" for="replaceAudio">Replace Audio file</label>
                </div>
                <div v-if="replaceAudio">
                  <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                    <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                      <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                      <i v-else class="bi bi-google me-1"></i>
                      Sign in with Google
                    </button>
                  </div>
                  <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                    <input type="file" ref="audioFileInput" accept="audio/*" class="form-control" @change="onAudioFileChange" />
                    <small class="text-muted" v-if="audioFile">Selected: {{ audioFile.name }}</small>
                  </div>
                </div>
                <div v-else>
                  <small class="text-muted" v-if="form.audioUrl">
                    Current: <a :href="form.audioUrl" target="_blank" class="text-gold">{{ form.audioName || 'Listen' }}</a>
                  </small>
                  <small v-else class="text-muted">No audio attached</small>
                </div>
              </div>

              <!-- Video Link -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Video Link</label>
                <input
                  v-model="form.videoUrl"
                  class="form-control"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  type="url"
                />
                <small class="text-muted">Paste a YouTube, Vimeo, or any video URL</small>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 justify-content-center gap-2">
            <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancel
            </button>
            <button type="button" class="btn btn-gold" @click="savePiece" :disabled="saving">
              <span v-if="saving">
                <span class="spinner-border spinner-border-sm me-1"></span>Saving...
              </span>
              <span v-else>
                <i class="bi bi-check-lg me-1"></i>{{ editingId ? 'Update' : 'Save' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Overlay -->
    <transition name="preview-fade">
      <div v-if="preview.open" class="preview-overlay" @click.self="closePreview">
        <div class="preview-container">

          <!-- Header -->
          <div class="preview-header">
            <div class="preview-title">
              <i class="bi text-gold me-2" :class="preview.type === 'audio' ? 'bi-music-note-beamed' : 'bi-play-circle'"></i>
              <span>{{ preview.title }}</span>
            </div>
            <button class="preview-close" @click="closePreview" title="Close (Esc)">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="preview-body">
            <!-- Audio: Google Drive embedded player -->
            <div v-if="preview.type === 'audio'" class="audio-wrapper">
              <iframe
                :src="`https://drive.google.com/file/d/${preview.audioId}/preview`"
                class="audio-frame"
                allow="autoplay"
                frameborder="0"
              ></iframe>
            </div>

            <!-- Video: YouTube embed -->
            <div v-else-if="preview.type === 'video' && preview.embedUrl" class="video-wrapper">
              <iframe
                :src="preview.embedUrl"
                class="video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                frameborder="0"
              ></iframe>
            </div>

            <!-- Fallback: non-YouTube video link -->
            <div v-else-if="preview.type === 'video'" class="fallback-wrapper">
              <i class="bi bi-play-circle display-1 text-gold mb-3"></i>
              <p class="text-white-50 mb-3">This video cannot be embedded directly.</p>
              <a :href="preview.videoUrl" target="_blank" class="btn btn-gold">
                <i class="bi bi-box-arrow-up-right me-2"></i>Open Video
              </a>
              <p class="text-muted small mt-3" style="word-break:break-all;">{{ preview.videoUrl }}</p>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Modal } from "bootstrap";
import * as googleDrive from "../services/googleDrive";
import { authStatus as driveAuthStatus, authError as driveAuthError } from "../services/googleDrive";

// Extract YouTube video ID from any YouTube URL format
function getYouTubeId(url) {
  if (!url) return null;
  const str = url.trim();

  // Regex covers all known YouTube URL patterns:
  // - youtube.com/watch?v=ID
  // - youtube.com/watch?v=ID&t=30
  // - youtube.com/shorts/ID
  // - youtube.com/embed/ID
  // - youtube.com/v/ID
  // - youtu.be/ID
  // - youtube.com/live/ID
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,           // ?v= or &v=
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,       // youtu.be/
    /youtube\.com\/(?:shorts|embed|v|live)\/([a-zA-Z0-9_-]{11})/, // /shorts/ /embed/ /v/ /live/
  ];

  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default {
  name: "LibraryView",
  setup() {
    const authStore = useAuthStore();
    const searchQuery = ref("");
    const pieces = ref([]);
    const form = ref({ title: "", audioId: "", audioUrl: "", audioName: "", videoUrl: "" });
    const editingId = ref(null);
    const replaceAudio = ref(false);
    const audioFile = ref(null);
    const audioFileInput = ref(null);
    const saving = ref(false);
    const uploadError = ref(null);
    let formModal = null;

    // Preview state
    const preview = reactive({
      open: false,
      type: null,      // 'audio' | 'video'
      title: "",
      audioId: "",
      videoUrl: "",
      embedUrl: "",
    });

    const filteredLibrary = computed(() => {
      const q = searchQuery.value.toLowerCase();
      if (!q) return pieces.value;
      return pieces.value.filter((piece) => piece.title.toLowerCase().includes(q));
    });

    const fetchLibrary = async () => {
      try {
        const q = query(collection(db, "library"), orderBy("title"));
        const snap = await getDocs(q);
        pieces.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.error("Failed to fetch library:", e);
      }
    };

    const resetForm = () => {
      editingId.value = null;
      replaceAudio.value = false;
      audioFile.value = null;
      uploadError.value = null;
      form.value = { title: "", audioId: "", audioUrl: "", audioName: "", videoUrl: "" };
    };

    const openAddForm = () => {
      resetForm();
      formModal.show();
    };

    const openEditForm = (piece) => {
      resetForm();
      editingId.value = piece.id;
      form.value = {
        title: piece.title,
        audioId: piece.audioId || "",
        audioUrl: piece.audioUrl || "",
        audioName: piece.audioName || "",
        videoUrl: piece.videoUrl || "",
      };
      formModal.show();
    };

    const onAudioFileChange = (e) => {
      const file = e.target.files[0];
      if (file && !file.type.startsWith("audio/")) {
        uploadError.value = "Please select an audio file";
        audioFile.value = null;
        return;
      }
      uploadError.value = null;
      audioFile.value = file;
    };

    const handleDriveSignIn = async () => {
      try {
        await googleDrive.authenticate();
      } catch {
        // error already set in driveAuthError
      }
    };

    // Preview helpers
    const openPreview = (piece, type) => {
      preview.type = type;
      preview.title = piece.title;
      if (type === "audio") {
        preview.audioId = piece.audioId;
        preview.videoUrl = "";
        preview.embedUrl = "";
      } else {
        preview.videoUrl = piece.videoUrl;
        preview.audioId = "";
        const ytId = getYouTubeId(piece.videoUrl);
        preview.embedUrl = ytId
          ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
          : "";
      }
      preview.open = true;
    };

    const closePreview = () => {
      preview.open = false;
      // Small delay so iframe stops playing before clearing src
      setTimeout(() => {
        preview.audioId = "";
        preview.embedUrl = "";
        preview.videoUrl = "";
      }, 300);
    };

    const handleKeydown = (e) => {
      if (e.key === "Escape" && preview.open) closePreview();
    };

    const savePiece = async () => {
      saving.value = true;
      uploadError.value = null;
      try {
        let audioId = form.value.audioId;
        let audioUrl = form.value.audioUrl;
        let audioName = form.value.audioName;
        const audioToUpload = editingId.value ? (replaceAudio.value ? audioFile.value : null) : audioFile.value;

        if (audioToUpload) {
          const audioFolderId = import.meta.env.VITE_GOOGLE_DRIVE_AUDIO_FOLDER_ID || "";
          const result = await googleDrive.uploadFile(audioToUpload, {
            title: form.value.title,
            folderId: audioFolderId || undefined,
          });
          audioId = result.id || result.file?.id;
          audioUrl = audioId ? googleDrive.getFileUrl(audioId) : "";
          audioName = audioToUpload.name;

          if (editingId.value && form.value.audioId && form.value.audioId !== audioId) {
            try { await googleDrive.deleteFile(form.value.audioId); } catch { /* ignore */ }
          }
        }

        const data = {
          title: form.value.title,
          audioId: audioId || "",
          audioUrl: audioUrl || "",
          audioName: audioName || "",
          videoUrl: form.value.videoUrl || "",
        };

        if (editingId.value) {
          await updateDoc(doc(db, "library", editingId.value), data);
        } else {
          await addDoc(collection(db, "library"), data);
        }
        formModal.hide();
        await fetchLibrary();
      } catch (e) {
        uploadError.value = e.message || "Failed to save";
        console.error("Failed to save piece:", e);
      } finally {
        saving.value = false;
      }
    };

    const confirmDelete = async (piece) => {
      if (!confirm(`Delete "${piece.title}"?`)) return;
      try {
        await deleteDoc(doc(db, "library", piece.id));
        if (piece.audioId) {
          try { await googleDrive.deleteFile(piece.audioId); } catch { /* ignore */ }
        }
        await fetchLibrary();
      } catch (e) {
        console.error("Failed to delete piece:", e);
      }
    };

    onMounted(async () => {
      await fetchLibrary();
      formModal = new Modal(document.getElementById("libraryFormModal"));
      document.addEventListener("keydown", handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeydown);
    });

    return {
      authStore, searchQuery, filteredLibrary,
      form, editingId, replaceAudio, audioFile, audioFileInput,
      saving, uploadError, preview,
      openAddForm, openEditForm, onAudioFileChange,
      handleDriveSignIn, savePiece, confirmDelete,
      openPreview, closePreview,
      driveAuthStatus, driveAuthError, googleDrive,
    };
  },
};
</script>

<style scoped>
.library-page {
  color: var(--text-primary);
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold);
  z-index: 4;
}

.library-page .form-control,
.search-input {
  background: var(--bg-secondary) !important;
  border: 2px solid var(--glass-border) !important;
  color: var(--text-primary) !important;
  border-radius: 10px;
  transition: var(--transition-smooth);
}

.library-page .form-control::placeholder,
.search-input::placeholder {
  color: var(--text-muted) !important;
}

.search-input {
  padding-left: 44px;
  height: 48px;
  font-size: 0.95rem;
}

.search-input:focus,
.library-page .form-control:focus {
  border-color: var(--gold) !important;
  box-shadow: 0 0 0 0.2rem rgba(212, 168, 83, 0.15) !important;
  background: var(--bg-tertiary) !important;
}

.btn-gold {
  background: var(--gold);
  border-color: var(--gold);
  color: #000;
  font-weight: 600;
  border-radius: 10px;
  transition: var(--transition-smooth);
}

.btn-gold:hover {
  background: var(--gold-light);
  border-color: var(--gold-light);
  color: #000;
  box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3);
}

.library-table {
  border-collapse: separate;
  border-spacing: 0;
  background: transparent;
  color: var(--text-primary);
}

.library-table thead th {
  background: rgba(75, 36, 110, 0.85);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-primary);
  border-bottom: 2px solid var(--gold);
  padding: 14px 16px;
}

.library-table tbody td {
  vertical-align: middle;
  padding: 14px 16px;
  color: var(--text-primary);
  background: rgba(47, 23, 63, 0.55);
  border-bottom: 1px solid var(--glass-border);
}

.library-table tbody tr:nth-child(even) td {
  background: rgba(61, 31, 92, 0.45);
}

.library-table tbody tr:last-child td {
  border-bottom: none;
}

.library-row {
  transition: var(--transition-smooth);
}

.library-row:hover td {
  background: rgba(212, 168, 83, 0.08);
}

/* ─── Preview Overlay ─── */
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-container {
  background: var(--dark, #1a0a2e);
  border: 1px solid rgba(212, 168, 83, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.preview-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  min-width: 0;
}

.preview-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.preview-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.preview-body {
  padding: 0;
}

/* Audio: Drive iframe player */
.audio-wrapper {
  padding: 32px 24px;
  display: flex;
  justify-content: center;
}

.audio-frame {
  width: 100%;
  max-width: 640px;
  border: none;
  border-radius: 8px;
}

/* Video: 16:9 responsive YouTube embed */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
}

.video-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Fallback */
.fallback-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

/* Transition */
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.25s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
