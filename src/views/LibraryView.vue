<template>
  <div class="library-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">SHEET MUSIC ARCHIVE</p>
        <h1 class="display-4 fw-bold">Library</h1>
        <p class="lead text-white-50">Explore our extensive collection of choral arrangements</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row mb-4">
        <div class="col-md-5 mb-3">
          <div class="search-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              v-model="searchQuery"
              placeholder="Search by title or composer..."
            />
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <select class="form-select form-select-custom" v-model="selectedGenre">
            <option value="All">All Genres</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
        <div class="col-md-2 mb-3">
          <select class="form-select form-select-custom" v-model="selectedDifficulty">
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div class="col-md-2 mb-3 d-flex gap-2">
          <button class="btn btn-gold flex-grow-1" @click="searchQuery = ''; selectedGenre = 'All'; selectedDifficulty = 'All'">
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
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Composer</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Difficulty</th>
                  <th class="text-center">PDF</th>
                  <th v-if="authStore.isAdminOrManager" class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(piece, index) in filteredLibrary" :key="piece.id" class="library-row">
                  <td class="text-muted">{{ index + 1 }}</td>
                  <td class="text-center">
                    <button
                      v-if="piece.thumbnailId"
                      class="btn btn-sm btn-outline-info"
                      @click="openThumbnailView(piece)"
                      title="View Photo"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <i v-else class="bi bi-file-earmark-music text-muted fs-5"></i>
                  </td>
                  <td class="fw-bold">
                    <i class="bi bi-music-note text-gold me-2"></i>{{ piece.title }}
                  </td>
                  <td>{{ piece.composer }}</td>
                  <td>
                    <span class="badge genre-badge">{{ piece.genre }}</span>
                  </td>
                  <td>{{ piece.year }}</td>
                  <td>
                    <span class="badge difficulty-badge" :class="'diff-' + piece.difficulty.toLowerCase()">
                      {{ piece.difficulty }}
                    </span>
                  </td>
                  <td class="text-center">
                    <a
                      v-if="piece.pdfUrl && (piece.isPublic || canAccessRestricted)"
                      :href="piece.pdfUrl"
                      target="_blank"
                      class="btn btn-sm btn-gold"
                    >
                      <i class="bi bi-download me-1"></i>PDF
                    </a>
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
            <i class="bi bi-file-earmark-music display-1 text-muted"></i>
            <h5 class="mt-3">No results found</h5>
            <p class="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="libraryFormModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" style="border: none; border-radius: 16px;">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ editingId ? 'Edit Piece' : 'Add Piece' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="uploadError" class="alert alert-danger py-2 small">{{ uploadError }}</div>

            <!-- Google Drive sign-in (only when user wants to upload/replace PDF) -->
            <div v-if="authStore.isAdminOrManager && !googleDrive.isOAuthConfigured()" class="alert alert-warning py-2 small">
              Google Drive upload not configured. Set <code>VITE_GOOGLE_DRIVE_CLIENT_ID</code> in .env to enable PDF uploads.
            </div>

            <form @submit.prevent="savePiece">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label class="form-label fw-semibold">Title</label>
                  <input v-model="form.title" class="form-control" required placeholder="Piece title" />
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label fw-semibold">Year</label>
                  <input v-model="form.year" class="form-control" placeholder="e.g. 1825" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Composer</label>
                <input v-model="form.composer" class="form-control" required placeholder="Composer name" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Genre</label>
                  <input v-model="form.genre" class="form-control" required placeholder="e.g. Classical, Gospel" list="genre-list" />
                  <datalist id="genre-list">
                    <option value="Classical" />
                    <option value="Baroque" />
                    <option value="Contemporary" />
                    <option value="Gospel" />
                    <option value="Musical" />
                    <option value="World" />
                    <option value="Jazz" />
                    <option value="Folk" />
                  </datalist>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Difficulty</label>
                  <select v-model="form.difficulty" class="form-select" required>
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" id="isPublic" v-model="form.isPublic" />
                <label class="form-check-label fw-semibold" for="isPublic">
                  Public <small class="text-muted">— anyone can download the PDF</small>
                </label>
              </div>

              <div class="mb-3" v-if="!editingId">
                <label class="form-label fw-semibold">Thumbnail Image</label>
                <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                  <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                    <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-google me-1"></i>
                    Sign in with Google
                  </button>
                </div>
                <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                  <input type="file" ref="thumbFileInput" accept="image/*" class="form-control" @change="onThumbFileChange" />
                  <small class="text-muted" v-if="thumbnailFile">Selected: {{ thumbnailFile.name }}</small>
                </div>
              </div>

              <div class="mb-3" v-else>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="replaceThumbnail" v-model="replaceThumbnail" />
                  <label class="form-check-label fw-semibold" for="replaceThumbnail">Replace thumbnail image</label>
                </div>
                <div v-if="replaceThumbnail">
                  <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                    <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                      <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                      <i v-else class="bi bi-google me-1"></i>
                      Sign in with Google
                    </button>
                  </div>
                  <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                    <input type="file" ref="thumbFileInput" accept="image/*" class="form-control" @change="onThumbFileChange" />
                    <small class="text-muted" v-if="thumbnailFile">Selected: {{ thumbnailFile.name }}</small>
                  </div>
                </div>
                <div v-else>
                  <small class="text-muted" v-if="form.thumbnailId">
                    Current thumbnail:
                    <img :src="googleDrive.getThumbUrl(form.thumbnailId)" class="ms-2" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; vertical-align: middle;" />
                  </small>
                  <small v-else class="text-muted">No thumbnail</small>
                </div>
              </div>

              <div class="mb-3" v-if="!editingId">
                <label class="form-label fw-semibold">PDF File</label>
                <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                  <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                    <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-google me-1"></i>
                    Sign in with Google to upload PDF
                  </button>
                  <div v-if="driveAuthStatus === 'error' && driveAuthError" class="mt-1">
                    <small class="text-danger">{{ driveAuthError }}</small>
                  </div>
                </div>
                <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                  <input type="file" ref="pdfFileInput" accept=".pdf,application/pdf" class="form-control" @change="onPdfFileChange" />
                  <small class="text-muted" v-if="form.pdfFile">Selected: {{ form.pdfFile.name }}</small>
                </div>
              </div>

              <div class="mb-3" v-else>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="replacePdf" v-model="replacePdf" />
                  <label class="form-check-label fw-semibold" for="replacePdf">Replace PDF file</label>
                </div>
                <div v-if="replacePdf">
                  <div v-if="driveAuthStatus !== 'authenticated' && googleDrive.isOAuthConfigured()" class="mb-2">
                    <button type="button" class="btn btn-sm btn-outline-dark" @click="handleDriveSignIn" :disabled="driveAuthStatus === 'authenticating'">
                      <span v-if="driveAuthStatus === 'authenticating'" class="spinner-border spinner-border-sm me-1"></span>
                      <i v-else class="bi bi-google me-1"></i>
                      Sign in with Google
                    </button>
                  </div>
                  <div v-if="driveAuthStatus === 'authenticated' || !googleDrive.isOAuthConfigured()">
                    <input type="file" ref="pdfFileInput" accept=".pdf,application/pdf" class="form-control" @change="onPdfFileChange" />
                    <small class="text-muted" v-if="form.pdfFile">Selected: {{ form.pdfFile.name }}</small>
                  </div>
                </div>
                <div v-else>
                  <small class="text-muted" v-if="form.pdfUrl">
                    Current PDF:
                    <a :href="form.pdfUrl" target="_blank" class="text-gold">{{ form.pdfName || 'View file' }}</a>
                  </small>
                  <small v-else class="text-muted">No PDF attached</small>
                </div>
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

    <!-- Thumbnail Lightbox -->
    <transition name="lightbox">
      <div v-if="selectedThumbnail" class="lightbox-overlay" @click.self="closeThumbnailView">
        <div class="lightbox-container">
          <div class="lightbox-header">
            <div class="lightbox-title">
              <i class="bi bi-image text-gold me-2"></i>
              <span>{{ selectedThumbnail.title }}</span>
            </div>
            <button type="button" class="lightbox-close" @click="closeThumbnailView" title="Close (Esc)">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="lightbox-body">
            <div v-if="thumbLoading" class="lightbox-spinner">
              <div class="spinner-border text-gold" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <img
              :src="googleDrive.getThumbUrl(selectedThumbnail.thumbnailId)"
              :alt="selectedThumbnail.title"
              class="lightbox-image"
              :class="{ 'loaded': !thumbLoading }"
              @load="thumbLoading = false"
              @error="thumbLoading = false"
            />
          </div>
          <div class="lightbox-footer">
            <div class="lightbox-meta">
              <span class="badge bg-gold me-2">{{ selectedThumbnail.genre }}</span>
              <small>{{ selectedThumbnail.composer }}</small>
              <span class="meta-sep">•</span>
              <small>{{ selectedThumbnail.year }}</small>
            </div>
            <a
              v-if="selectedThumbnail.thumbnailId"
              :href="googleDrive.getFileUrl(selectedThumbnail.thumbnailId)"
              target="_blank"
              class="btn btn-sm btn-gold"
              title="Open full size"
            >
              <i class="bi bi-arrows-angle-expand me-1"></i>Full
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Modal } from "bootstrap";
import * as googleDrive from "../services/googleDrive";
import { authStatus as driveAuthStatus, authError as driveAuthError } from "../services/googleDrive";

export default {
  name: "LibraryView",
  setup() {
    const authStore = useAuthStore();
    const searchQuery = ref("");
    const selectedGenre = ref("All");
    const selectedDifficulty = ref("All");
    const pieces = ref([]);
    const form = ref({ title: "", composer: "", genre: "", difficulty: "", year: "", pdfId: "", pdfUrl: "", pdfName: "", thumbnailId: "", thumbnailUrl: "", isPublic: true });
    const editingId = ref(null);
    const replacePdf = ref(false);
    const replaceThumbnail = ref(false);
    const pdfFile = ref(null);
    const pdfFileInput = ref(null);
    const thumbnailFile = ref(null);
    const thumbFileInput = ref(null);
    const selectedThumbnail = ref(null);
    const thumbLoading = ref(false);
    const saving = ref(false);
    const uploadError = ref(null);
    let formModal = null;

    const canAccessRestricted = computed(() => {
      const role = authStore.profile?.role;
      return role === "admin" || role === "manager" || role === "singer";
    });

    const genres = computed(() => {
      return [...new Set(pieces.value.map((l) => l.genre))];
    });

    const filteredLibrary = computed(() => {
      return pieces.value.filter((piece) => {
        const q = searchQuery.value.toLowerCase();
        const matchesSearch =
          !q || piece.title.toLowerCase().includes(q) ||
          piece.composer.toLowerCase().includes(q);
        const matchesGenre = selectedGenre.value === "All" || piece.genre === selectedGenre.value;
        const matchesDifficulty =
          selectedDifficulty.value === "All" || piece.difficulty === selectedDifficulty.value;
        return matchesSearch && matchesGenre && matchesDifficulty;
      });
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

    const openAddForm = () => {
      editingId.value = null;
      replacePdf.value = false;
      replaceThumbnail.value = false;
      pdfFile.value = null;
      thumbnailFile.value = null;
      uploadError.value = null;
      form.value = { title: "", composer: "", genre: "", difficulty: "", year: "", pdfId: "", pdfUrl: "", pdfName: "", thumbnailId: "", thumbnailUrl: "", isPublic: true };
      formModal.show();
    };

    const openEditForm = (piece) => {
      editingId.value = piece.id;
      replacePdf.value = false;
      replaceThumbnail.value = false;
      pdfFile.value = null;
      thumbnailFile.value = null;
      uploadError.value = null;
      form.value = {
        title: piece.title,
        composer: piece.composer,
        genre: piece.genre,
        difficulty: piece.difficulty,
        year: piece.year || "",
        pdfId: piece.pdfId || "",
        pdfUrl: piece.pdfUrl || "",
        pdfName: piece.pdfName || "",
        thumbnailId: piece.thumbnailId || "",
        thumbnailUrl: piece.thumbnailUrl || "",
        isPublic: piece.isPublic !== false,
      };
      formModal.show();
    };

    const onPdfFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type !== "application/pdf") {
        uploadError.value = "Please select a PDF file";
        pdfFile.value = null;
        return;
      }
      uploadError.value = null;
      pdfFile.value = file;
    };

    const onThumbFileChange = (e) => {
      const file = e.target.files[0];
      if (file && !file.type.startsWith("image/")) {
        uploadError.value = "Please select an image file";
        thumbnailFile.value = null;
        return;
      }
      uploadError.value = null;
      thumbnailFile.value = file;
    };

    const openThumbnailView = (piece) => {
      thumbLoading.value = true;
      selectedThumbnail.value = piece;
    };

    const closeThumbnailView = () => {
      selectedThumbnail.value = null;
      thumbLoading.value = false;
    };

    const handleDriveSignIn = async () => {
      try {
        await googleDrive.authenticate();
      } catch {
        // error already set in driveAuthError
      }
    };

    const savePiece = async () => {
      saving.value = true;
      uploadError.value = null;
      try {
        let pdfId = form.value.pdfId;
        let pdfUrl = form.value.pdfUrl;
        let pdfName = form.value.pdfName;
        let thumbnailId = form.value.thumbnailId;
        let thumbnailUrl = form.value.thumbnailUrl;
        const pdfToUpload = editingId.value ? (replacePdf.value ? pdfFile.value : null) : pdfFile.value;
        const thumbToUpload = editingId.value ? (replaceThumbnail.value ? thumbnailFile.value : null) : thumbnailFile.value;

        if (pdfToUpload) {
          const pdfFolderId = import.meta.env.VITE_GOOGLE_DRIVE_PDF_FOLDER_ID || "";
          const result = await googleDrive.uploadFile(pdfToUpload, {
            title: form.value.title,
            folderId: pdfFolderId || undefined,
          });
          pdfId = result.id || result.file?.id;
          pdfUrl = pdfId ? googleDrive.getFileUrl(pdfId) : "";
          pdfName = pdfToUpload.name;

          if (editingId.value && form.value.pdfId && form.value.pdfId !== pdfId) {
            try {
              await googleDrive.deleteFile(form.value.pdfId);
            } catch {
              // ignore if delete fails
            }
          }
        }

        if (thumbToUpload) {
          const thumbFolderId = import.meta.env.VITE_GOOGLE_DRIVE_THUMBNAIL_FOLDER_ID || "";
          const result = await googleDrive.uploadFile(thumbToUpload, {
            title: form.value.title + "_thumb",
            folderId: thumbFolderId || undefined,
          });
          thumbnailId = result.id || result.file?.id;
          thumbnailUrl = thumbnailId ? googleDrive.getFileUrl(thumbnailId) : "";
          if (editingId.value && form.value.thumbnailId && form.value.thumbnailId !== thumbnailId) {
            try {
              await googleDrive.deleteFile(form.value.thumbnailId);
            } catch {
              // ignore if delete fails
            }
          }
        }

        const data = {
          title: form.value.title,
          composer: form.value.composer,
          genre: form.value.genre,
          difficulty: form.value.difficulty,
          year: form.value.year || "",
          pdfId: pdfId || "",
          pdfUrl: pdfUrl || "",
          pdfName: pdfName || "",
          thumbnailId: thumbnailId || "",
          thumbnailUrl: thumbnailUrl || "",
          isPublic: !!form.value.isPublic,
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
        if (piece.pdfId) {
          try { await googleDrive.deleteFile(piece.pdfId); } catch { /* ignore */ }
        }
        if (piece.thumbnailId) {
          try { await googleDrive.deleteFile(piece.thumbnailId); } catch { /* ignore */ }
        }
        await fetchLibrary();
      } catch (e) {
        console.error("Failed to delete piece:", e);
      }
    };

    onMounted(async () => {
      await fetchLibrary();
      formModal = new Modal(document.getElementById("libraryFormModal"));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && selectedThumbnail.value) closeThumbnailView();
      });
    });

    return {
      authStore, searchQuery, selectedGenre, selectedDifficulty, genres, filteredLibrary,
      form, editingId, replacePdf, replaceThumbnail, pdfFile, pdfFileInput, thumbnailFile, thumbFileInput,
      selectedThumbnail, thumbLoading, saving, uploadError, canAccessRestricted,
      openAddForm, openEditForm, onPdfFileChange, onThumbFileChange,
      openThumbnailView, closeThumbnailView, handleDriveSignIn, savePiece, confirmDelete,
      driveAuthStatus, driveAuthError, googleDrive,
    };
  },
};
</script>

<style scoped>
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

.search-input {
  padding-left: 44px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  height: 48px;
  font-size: 0.95rem;
  transition: var(--transition-smooth);
}

.search-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.15);
}

.form-select-custom {
  height: 48px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  font-size: 0.95rem;
  transition: var(--transition-smooth);
}

.form-select-custom:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.15);
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
  background: #e6c200;
  border-color: #e6c200;
  color: #000;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.library-table th {
  background: #f8f9fa;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6c757d;
  border-bottom: 2px solid var(--gold);
  padding: 14px 16px;
}

.library-table td {
  vertical-align: middle;
  padding: 14px 16px;
}

.library-row {
  transition: var(--transition-smooth);
}

.library-row:hover {
  background: rgba(255, 215, 0, 0.04);
}

.genre-badge {
  background: rgba(255, 215, 0, 0.12);
  color: #856404;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
}

.difficulty-badge {
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
}

.diff-beginner {
  background: #d4edda;
  color: #155724;
}

.diff-intermediate {
  background: #fff3cd;
  color: #856404;
}

.diff-advanced {
  background: #f8d7da;
  color: #721c24;
}

/* ─── Lightbox ─── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lightbox-container {
  background: var(--dark);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.lightbox-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  min-width: 0;
}

.lightbox-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lightbox-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 8px;
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

.lightbox-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.lightbox-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  min-height: 300px;
  position: relative;
  overflow: hidden;
}

.lightbox-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lightbox-image.loaded {
  opacity: 1;
}

.lightbox-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
}

.lightbox-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  min-width: 0;
  flex-wrap: wrap;
}

.meta-sep {
  color: rgba(255, 255, 255, 0.2);
}

/* transition */
.lightbox-enter-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-active .lightbox-container {
  transition: transform 0.25s ease;
}
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-leave-active .lightbox-container {
  transition: transform 0.2s ease;
}
.lightbox-enter-from {
  opacity: 0;
}
.lightbox-enter-from .lightbox-container {
  transform: scale(0.92);
}
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-leave-to .lightbox-container {
  transform: scale(0.92);
}

@media (max-width: 768px) {
  .library-table td,
  .library-table th {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .lightbox-overlay {
    padding: 12px;
  }

  .lightbox-container {
    border-radius: 12px;
    max-height: 85vh;
  }

  .lightbox-header {
    padding: 12px 16px;
  }

  .lightbox-title {
    font-size: 0.95rem;
  }

  .lightbox-body {
    min-height: 200px;
  }

  .lightbox-image {
    max-height: 55vh;
  }

  .lightbox-footer {
    padding: 10px 16px;
    flex-wrap: wrap;
  }

  .lightbox-meta {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .search-input {
    height: 42px;
    font-size: 0.85rem;
  }

  .form-select-custom {
    height: 42px;
    font-size: 0.85rem;
  }

  .library-table td,
  .library-table th {
    padding: 8px 10px;
    font-size: 0.8rem;
  }

  .lightbox-overlay {
    padding: 8px;
  }

  .lightbox-container {
    border-radius: 10px;
    max-height: 80vh;
  }

  .lightbox-header {
    padding: 10px 14px;
  }

  .lightbox-title {
    font-size: 0.85rem;
  }

  .lightbox-body {
    min-height: 160px;
  }

  .lightbox-image {
    max-height: 48vh;
  }

  .lightbox-footer {
    padding: 8px 14px;
  }

  .lightbox-meta {
    font-size: 0.75rem;
  }
}
</style>
