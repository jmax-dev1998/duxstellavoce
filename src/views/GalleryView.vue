<template>
  <div class="gallery-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <p class="text-gold fw-semibold mb-2" style="letter-spacing: 3px; font-size: 0.85rem;">MEMORIES IN FRAMES</p>
        <h1 class="display-4 fw-bold">Gallery</h1>
        <p class="lead text-white-50">Capturing moments of musical excellence</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div class="filter-pills">
          <button
            class="btn filter-pill"
            :class="activeCategory === 'All' ? 'active' : ''"
            @click="activeCategory = 'All'"
          >
            <i class="bi bi-grid-3x3-gap me-1"></i>All Photos
          </button>
          <button
            class="btn filter-pill"
            v-for="cat in categories"
            :key="cat"
            :class="activeCategory === cat ? 'active' : ''"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <button v-if="authStore.isAdminOrManager" class="btn btn-primary px-4" @click="openUploadModal">
          <i class="bi bi-plus-lg me-2"></i>Add Gallery
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-white-50 mt-3">Loading photos...</p>
      </div>

      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle text-primary" style="font-size: 3rem;"></i>
        <p class="text-white-50 mt-3">{{ error }}</p>
        <button class="btn btn-outline-gold mt-2" @click="fetchPhotos">
          <i class="bi bi-arrow-clockwise me-1"></i>Retry
        </button>
      </div>

      <div v-else-if="filteredGallery.length === 0" class="text-center py-5">
        <i class="bi bi-images text-primary" style="font-size: 3rem;"></i>
        <p class="text-white-50 mt-3">No photos found in this category.</p>
      </div>

      <div v-else class="row gallery-grid">
        <div
          class="col-lg-4 col-md-6 mb-4"
          v-for="photo in filteredGallery"
          :key="photo.id"
        >
          <div class="gallery-card" @click="onCardClick(photo)">
            <img :src="photo.image" :alt="photo.title" width="400" height="320" loading="lazy" decoding="async" />
            <div class="gallery-card-overlay">
              <div class="gallery-card-content">
                <span class="badge bg-primary mb-2">{{ photo.category }}</span>
                <h5 class="fw-bold mb-1">{{ photo.title }}</h5>
                <small>{{ formatDate(photo.date) }}</small>
              </div>
              <!-- Edit badge for admins -->
              <button
                v-if="authStore.isAdminOrManager"
                class="gallery-edit-btn"
                @click.stop="openEditModal(photo)"
                title="Edit photo"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="photos.length > 0" class="text-center text-white-50 small mt-4">
        {{ photos.length }} photo{{ photos.length !== 1 ? 's' : '' }} in gallery
      </div>

      <!-- Lightbox Modal -->
      <div class="modal fade" id="lightboxModal" tabindex="-1" v-if="selectedPhoto">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content" style="background: var(--dark); border: 1px solid rgba(255,215,0,0.1);">
            <div class="modal-header border-0">
              <h5 class="modal-title text-white">
                <i class="bi bi-image text-primary me-2"></i>{{ selectedPhoto.title }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" @click="selectedPhoto = null"></button>
            </div>
            <div class="modal-body text-center p-0">
              <img
                :src="selectedPhoto.imageFull || selectedPhoto.image"
                class="img-fluid"
                :alt="selectedPhoto.title"
                width="1200" height="800"
                loading="eager" decoding="async"
                style="max-height: 75vh; width: 100%; object-fit: contain;"
              />
            </div>
            <div class="modal-footer border-0 justify-content-between">
              <div>
                <span class="badge bg-primary me-2">{{ selectedPhoto.category }}</span>
                <small class="text-white-50">{{ formatDate(selectedPhoto.date) }}</small>
              </div>
              <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal" @click="selectedPhoto = null">
                <i class="bi bi-x-lg me-1"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Modal (custom overlay, not Bootstrap modal) -->
      <div class="upload-overlay" v-if="showUploadModal" @click.self="closeUploadModal">
        <div class="upload-panel">
          <div class="upload-panel-header">
            <h5 class="text-white mb-0">
              <i class="bi bi-images text-primary me-2"></i>Add Gallery
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeUploadModal"></button>
          </div>

          <!-- Not configured -->
          <div v-if="!googleDrive.isOAuthConfigured()" class="upload-panel-body text-center py-5">
            <i class="bi bi-gear text-primary" style="font-size: 2.5rem;"></i>
            <p class="text-white-50 mt-3 mb-0">Google Drive upload not configured.</p>
            <small class="text-white-50">Set <code>VITE_GOOGLE_DRIVE_CLIENT_ID</code> in .env to enable uploads.</small>
          </div>

          <!-- Sign in required -->
          <div v-else-if="authStatus !== 'authenticated'" class="upload-panel-body text-center py-5">
            <i class="bi bi-google text-gold" style="font-size: 2.5rem;"></i>
            <p class="text-white-50 mt-3 mb-1">Sign in with Google to upload photos to Drive</p>
            <small class="text-white-50 d-block mb-4">Only file access needed — your photos are uploaded directly from browser to Google Drive.</small>
            <button class="btn btn-gold px-4" @click="handleSignIn" :disabled="authStatus === 'authenticating'">
              <span v-if="authStatus === 'authenticating'" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-google me-2"></i>
              Sign in with Google
            </button>
            <div v-if="authStatus === 'error' && authError" class="mt-3">
              <small class="text-danger">{{ authError }}</small>
              <button class="btn btn-sm btn-link text-gold" @click="authError = null">Dismiss</button>
            </div>
          </div>

          <!-- Upload form (authenticated) -->
          <template v-else>
            <form @submit.prevent="handleUpload">
              <div class="upload-panel-body">
                <div v-if="uploadError" class="alert alert-danger py-2 small">{{ uploadError }}</div>
                <div v-if="uploadSuccess" class="alert alert-success py-2 small">{{ uploadSuccess }}</div>

                <div class="mb-3">
                  <label class="form-label text-white-50 small fw-semibold">Photo File</label>
                  <div
                    class="upload-dropzone"
                    :class="{ 'has-file': uploadForm.file, 'is-dragover': isDragover }"
                    @dragover.prevent="isDragover = true"
                    @dragleave.prevent="isDragover = false"
                    @drop.prevent="onDrop"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      class="d-none"
                      @change="onFileChange"
                    />
                    <div v-if="!uploadForm.file" class="dropzone-placeholder" @click="$refs.fileInput.click()">
                      <i class="bi bi-cloud-arrow-up" style="font-size: 2.5rem;"></i>
                      <p class="mb-0 mt-2">Click or drop an image here</p>
                      <small class="text-white-50">JPG, PNG, WebP up to 10MB</small>
                    </div>
                    <div v-else class="dropzone-preview">
                      <img :src="uploadPreview" class="upload-thumb" width="64" height="64" loading="lazy" decoding="async" />
                      <div class="dropzone-file-info">
                        <strong class="text-white">{{ uploadForm.file.name }}</strong>
                        <small class="text-white-50">{{ formatFileSize(uploadForm.file.size) }}</small>
                      </div>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="removeFile">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label text-white-50 small fw-semibold">Title</label>
                  <input
                    type="text"
                    class="form-control form-control-dark"
                    v-model="uploadForm.title"
                    placeholder="e.g. Spring Concert 2026"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label text-white-50 small fw-semibold">Date</label>
                  <input
                    type="date"
                    class="form-control form-control-dark"
                    v-model="uploadForm.date"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label text-white-50 small fw-semibold">Description</label>
                  <textarea
                    class="form-control form-control-dark"
                    v-model="uploadForm.description"
                    placeholder="Briefly describe this photo or event..."
                    rows="3"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label text-white-50 small fw-semibold">Category</label>
                  <select class="form-select form-select-dark" v-model="uploadForm.category" required>
                    <option value="" disabled>Select a category</option>
                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
              </div>
              <div class="upload-panel-footer">
                <button type="button" class="btn btn-outline-light" @click="closeUploadModal">Cancel</button>
                <button type="submit" class="btn btn-gold px-4" :disabled="uploading">
                  <span v-if="uploading">
                    <span class="spinner-border spinner-border-sm me-1"></span>Uploading...
                  </span>
                  <span v-else><i class="bi bi-cloud-arrow-up me-1"></i>Upload</span>
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>

      <!-- Edit Modal -->
      <div class="upload-overlay" v-if="showEditModal" @click.self="closeEditModal">
        <div class="upload-panel">
          <div class="upload-panel-header">
            <h5 class="text-white mb-0">
              <i class="bi bi-pencil text-primary me-2"></i>Edit Photo
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeEditModal"></button>
          </div>
          <form @submit.prevent="handleEdit">
            <div class="upload-panel-body">
              <div v-if="editError" class="alert alert-danger py-2 small">{{ editError }}</div>
              <div v-if="editSuccess" class="alert alert-success py-2 small">{{ editSuccess }}</div>

              <!-- Current / replacement image -->
              <div class="mb-3">
                <label class="form-label text-white-50 small fw-semibold">Photo</label>
                <div
                  class="upload-dropzone"
                  :class="{ 'has-file': editForm.newFile, 'is-dragover': isEditDragover }"
                  @dragover.prevent="isEditDragover = true"
                  @dragleave.prevent="isEditDragover = false"
                  @drop.prevent="onEditDrop"
                >
                  <input
                    type="file"
                    ref="editFileInput"
                    accept="image/*"
                    class="d-none"
                    @change="onEditFileChange"
                  />
                  <!-- No new file chosen: show current image -->
                  <div v-if="!editForm.newFile" class="edit-current-image" @click="$refs.editFileInput.click()">
                    <img :src="editForm.currentImage" class="edit-current-thumb" :alt="editForm.title" width="400" height="160" loading="lazy" decoding="async" />
                    <div class="edit-current-hint">
                      <i class="bi bi-arrow-repeat me-1"></i>Click to replace image
                    </div>
                  </div>
                  <!-- New file chosen -->
                  <div v-else class="dropzone-preview">
                    <img :src="editPreview" class="upload-thumb" width="64" height="64" loading="lazy" decoding="async" />
                    <div class="dropzone-file-info">
                      <strong class="text-white">{{ editForm.newFile.name }}</strong>
                      <small class="text-white-50">{{ formatFileSize(editForm.newFile.size) }}</small>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeEditFile">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small fw-semibold">Title</label>
                <input
                  type="text"
                  class="form-control form-control-dark"
                  v-model="editForm.title"
                  placeholder="e.g. Spring Concert 2026"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small fw-semibold">Date</label>
                <input
                  type="date"
                  class="form-control form-control-dark"
                  v-model="editForm.date"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small fw-semibold">Description</label>
                <textarea
                  class="form-control form-control-dark"
                  v-model="editForm.description"
                  placeholder="Briefly describe this photo or event..."
                  rows="3"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50 small fw-semibold">Category</label>
                <select class="form-select form-select-dark" v-model="editForm.category" required>
                  <option value="" disabled>Select a category</option>
                  <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>
            <div class="upload-panel-footer">
              <button type="button" class="btn btn-outline-light" @click="closeEditModal">Cancel</button>
              <button
                type="button"
                class="btn btn-outline-gold btn-sm"
                @click="openLightbox(editingPhoto)"
              >
                <i class="bi bi-arrows-fullscreen me-1"></i>View Full
              </button>
              <button type="submit" class="btn btn-gold px-4" :disabled="editing">
                <span v-if="editing">
                  <span class="spinner-border spinner-border-sm me-1"></span>Saving...
                </span>
                <span v-else><i class="bi bi-check-lg me-1"></i>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import * as googleDrive from "../services/googleDrive";
import { authStatus, authError } from "../services/googleDrive";
import { useAuthStore } from "../stores/auth";
import {
  fetchGallery,
  addGalleryEntry,
  updateGalleryEntry,
} from "../services/galleryService";

const IMG_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_IMG_FOLDER_ID || "";

export default {
  name: "GalleryView",
  setup() {
    const authStore = useAuthStore();
    const photos = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const activeCategory = ref("All");
    const selectedPhoto = ref(null);

    const showUploadModal = ref(false);
    const uploading = ref(false);
    const uploadError = ref(null);
    const uploadSuccess = ref(null);
    const isDragover = ref(false);
    const fileInput = ref(null);
    const uploadPreview = ref(null);
    const uploadForm = ref({
      file: null,
      title: "",
      category: "",
      date: "",
      description: "",
    });

    // --- Edit state ---
    const showEditModal = ref(false);
    const editing = ref(false);
    const editError = ref(null);
    const editSuccess = ref(null);
    const editingPhoto = ref(null);
    const isEditDragover = ref(false);
    const editFileInput = ref(null);
    const editPreview = ref(null);
    const editForm = ref({
      title: "",
      date: "",
      description: "",
      category: "",
      currentImage: "",
      newFile: null,
    });

    const categoryOptions = ["Concert", "Rehearsal", "Townhall", "Masterclass"];

    const categories = computed(() => {
      return [...new Set(photos.value.map((g) => g.category))];
    });

    const filteredGallery = computed(() => {
      if (activeCategory.value === "All") return photos.value;
      return photos.value.filter((g) => g.category === activeCategory.value);
    });

    async function fetchPhotos() {
      loading.value = true;
      error.value = null;
      try {
        const entries = await fetchGallery();
        // Map Firestore fields to the shape the template expects
        photos.value = entries.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          description: e.description || "",
          category: e.category,
          image: e.imageUrl || googleDrive.getThumbUrl(e.driveFileId),
          imageFull: e.imageFull || googleDrive.getFileUrl(e.driveFileId),
          driveFileId: e.driveFileId || "",
        }));
      } catch (err) {
        error.value = err.message || "Failed to load photos";
      } finally {
        loading.value = false;
      }
    }

    function openLightbox(photo) {
      selectedPhoto.value = photo;
    }

    function formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    }

    function onFileChange(e) {
      const file = e.target.files[0];
      if (file) setFile(file);
    }

    function onDrop(e) {
      isDragover.value = false;
      const file = e.dataTransfer.files[0];
      if (file) setFile(file);
    }

    function setFile(file) {
      if (!file.type.startsWith("image/")) {
        uploadError.value = "Please select an image file";
        return;
      }
      if (file.size > 10485760) {
        uploadError.value = "File is too large (max 10MB)";
        return;
      }
      uploadError.value = null;
      uploadForm.value.file = file;
      uploadForm.value.title = file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
      uploadPreview.value = URL.createObjectURL(file);
    }

    function openUploadModal() {
      showUploadModal.value = true;
    }

    // --- Edit helpers ---
    function onCardClick(photo) {
      if (authStore.isAdminOrManager) {
        openEditModal(photo);
      } else {
        openLightbox(photo);
      }
    }

    function openEditModal(photo) {
      editingPhoto.value = photo;
      editForm.value = {
        title: photo.title || "",
        date: photo.date || "",
        description: photo.description || "",
        category: photo.category || "",
        currentImage: photo.image || "",
        newFile: null,
      };
      editPreview.value = null;
      editError.value = null;
      editSuccess.value = null;
      showEditModal.value = true;
    }

    function closeEditModal() {
      showEditModal.value = false;
      editingPhoto.value = null;
      editError.value = null;
      editSuccess.value = null;
      editPreview.value = null;
      if (editFileInput.value) editFileInput.value.value = "";
      editForm.value = { title: "", date: "", description: "", category: "", currentImage: "", newFile: null };
    }

    function onEditFileChange(e) {
      const file = e.target.files[0];
      if (file) setEditFile(file);
    }

    function onEditDrop(e) {
      isEditDragover.value = false;
      const file = e.dataTransfer.files[0];
      if (file) setEditFile(file);
    }

    function setEditFile(file) {
      if (!file.type.startsWith("image/")) {
        editError.value = "Please select an image file";
        return;
      }
      if (file.size > 10485760) {
        editError.value = "File is too large (max 10MB)";
        return;
      }
      editError.value = null;
      editForm.value.newFile = file;
      editPreview.value = URL.createObjectURL(file);
    }

    function removeEditFile() {
      editForm.value.newFile = null;
      editPreview.value = null;
      if (editFileInput.value) editFileInput.value.value = "";
    }

    async function handleEdit() {
      if (!editForm.value.title || !editForm.value.category) return;
      editing.value = true;
      editError.value = null;
      editSuccess.value = null;
      try {
        let updatedDriveFileId = editingPhoto.value.driveFileId || "";
        let updatedImage = editingPhoto.value.image;
        let updatedImageFull = editingPhoto.value.imageFull;
        let driveLink = updatedDriveFileId
          ? `https://drive.google.com/file/d/${updatedDriveFileId}/view`
          : "";

        // If a new file is selected, upload it to the gallery folder on Drive first
        if (editForm.value.newFile) {
          const driveResult = await googleDrive.uploadFile(editForm.value.newFile, {
            title: editForm.value.title,
            folderId: IMG_FOLDER_ID,
          });
          const newDriveFileId = driveResult.id || driveResult.file?.id || "";
          if (newDriveFileId) {
            updatedDriveFileId = newDriveFileId;
            updatedImage = googleDrive.getThumbUrl(newDriveFileId);
            updatedImageFull = googleDrive.getFileUrl(newDriveFileId);
            driveLink = `https://drive.google.com/file/d/${newDriveFileId}/view`;
          } else {
            updatedImage = editPreview.value;
            updatedImageFull = editPreview.value;
          }
        }

        // Save updated metadata to Firestore
        await updateGalleryEntry(editingPhoto.value.id, {
          title: editForm.value.title,
          date: editForm.value.date,
          description: editForm.value.description,
          category: editForm.value.category,
          driveFileId: updatedDriveFileId,
          imageUrl: updatedImage,
          imageFull: updatedImageFull,
          driveLink,
        });

        // Update the local list (optimistic)
        const idx = photos.value.findIndex((p) => p.id === editingPhoto.value.id);
        if (idx !== -1) {
          photos.value[idx] = {
            ...photos.value[idx],
            title: editForm.value.title,
            date: editForm.value.date,
            description: editForm.value.description,
            category: editForm.value.category,
            image: updatedImage,
            imageFull: updatedImageFull,
            driveFileId: updatedDriveFileId,
          };
        }

        editSuccess.value = "Changes saved successfully!";
        setTimeout(() => closeEditModal(), 1200);
      } catch (err) {
        editError.value = err.message || "Failed to save changes";
      } finally {
        editing.value = false;
      }
    }

    async function handleSignIn() {
      try {
        await googleDrive.authenticate();
      } catch {
        // authError is already set by the service, no need to show duplicate
      }
    }

    function removeFile() {
      uploadForm.value.file = null;
      uploadPreview.value = null;
      if (fileInput.value) fileInput.value.value = "";
    }

    function closeUploadModal() {
      showUploadModal.value = false;
      uploadError.value = null;
      uploadSuccess.value = null;
      removeFile();
      uploadForm.value.title = "";
      uploadForm.value.category = "";
      uploadForm.value.date = "";
      uploadForm.value.description = "";
    }

    async function handleUpload() {
      if (!uploadForm.value.file || !uploadForm.value.title || !uploadForm.value.category) return;
      uploading.value = true;
      uploadError.value = null;
      uploadSuccess.value = null;
      try {
        // 1. Upload file to the gallery folder on Google Drive
        const driveResult = await googleDrive.uploadFile(uploadForm.value.file, {
          title: uploadForm.value.title,
          category: uploadForm.value.category,
          folderId: IMG_FOLDER_ID,
        });

        const driveFileId = driveResult.id || driveResult.file?.id || "";
        const imageUrl = driveFileId
          ? googleDrive.getThumbUrl(driveFileId)
          : uploadPreview.value;
        const imageFull = driveFileId
          ? googleDrive.getFileUrl(driveFileId)
          : uploadPreview.value;
        const driveLink = driveFileId
          ? `https://drive.google.com/file/d/${driveFileId}/view`
          : "";

        // 2. Save metadata + Drive link to Firestore
        const firestoreId = await addGalleryEntry({
          title: uploadForm.value.title,
          date: uploadForm.value.date || new Date().toISOString().split("T")[0],
          description: uploadForm.value.description,
          category: uploadForm.value.category,
          driveFileId,
          imageUrl,
          imageFull,
          driveLink,
        });

        // 3. Add to local list immediately (optimistic update)
        photos.value.unshift({
          id: firestoreId,
          title: uploadForm.value.title,
          date: uploadForm.value.date || new Date().toISOString().split("T")[0],
          description: uploadForm.value.description,
          category: uploadForm.value.category,
          image: imageUrl,
          imageFull,
          driveFileId,
        });

        uploadSuccess.value = "Photo uploaded and saved successfully!";
        setTimeout(() => closeUploadModal(), 1500);
      } catch (err) {
        uploadError.value = err.message || "Upload failed";
      } finally {
        uploading.value = false;
      }
    }

    onMounted(() => {
      fetchPhotos();
    });

    return {
      photos,
      loading,
      error,
      activeCategory,
      selectedPhoto,
      categories,
      filteredGallery,
      categoryOptions,
      openLightbox,
      formatDate,
      formatFileSize,
      fetchPhotos,
      showUploadModal,
      uploading,
      uploadError,
      uploadSuccess,
      uploadForm,
      uploadPreview,
      isDragover,
      fileInput,
      onFileChange,
      onDrop,
      removeFile,
      closeUploadModal,
      openUploadModal,
      handleUpload,
      handleSignIn,
      authStore,
      authStatus,
      authError,
      googleDrive,
      // edit
      showEditModal,
      editing,
      editError,
      editSuccess,
      editingPhoto,
      editForm,
      editPreview,
      isEditDragover,
      editFileInput,
      onCardClick,
      openEditModal,
      closeEditModal,
      onEditFileChange,
      onEditDrop,
      removeEditFile,
      handleEdit,
    };
  },
};
</script>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  border-radius: 25px;
  padding: 8px 22px;
  font-weight: 500;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(245, 240, 232, 0.7);
  background: transparent;
  transition: var(--transition-smooth);
}

.filter-pill:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(255, 215, 0, 0.05);
}

.filter-pill.active {
  background: var(--gold);
  border-color: var(--gold);
  color: #000;
}

.gallery-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: var(--transition-smooth);
}

.gallery-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-5px);
}

.gallery-card img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  transition: transform 0.6s ease;
  display: block;
}

.gallery-card:hover img {
  transform: scale(1.12);
}

.gallery-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: flex-end;
  padding: 25px;
}

.gallery-card:hover .gallery-card-overlay {
  opacity: 1;
}

.gallery-card-content {
  transform: translateY(20px);
  transition: transform 0.4s ease;
  color: white;
}

.gallery-card:hover .gallery-card-content {
  transform: translateY(0);
}

.btn-gold {
  background: var(--gold);
  border-color: var(--gold);
  color: #000;
  font-weight: 600;
  border-radius: 25px;
  transition: var(--transition-smooth);
}

.btn-gold:hover {
  background: #e6c200;
  border-color: #e6c200;
  color: #000;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.btn-outline-gold {
  border-color: var(--gold);
  color: var(--gold);
  border-radius: 25px;
  transition: var(--transition-smooth);
}

.btn-outline-gold:hover {
  background: var(--gold);
  color: #000;
}

.text-gold {
  color: var(--gold);
}

.bg-gold {
  background-color: var(--gold);
  color: #000;
}

.upload-dropzone {
  border: 2px dashed rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  color: var(--gold);
}

.upload-dropzone:hover,
.upload-dropzone.is-dragover {
  border-color: var(--gold);
  background: rgba(255, 215, 0, 0.05);
}

.upload-dropzone.has-file {
  border-style: solid;
  border-color: rgba(255, 215, 0, 0.2);
  cursor: default;
}

.dropzone-placeholder {
  padding: 12px 0;
}

.dropzone-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.upload-thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.dropzone-file-info {
  flex: 1;
  min-width: 0;
}

.dropzone-file-info strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-control-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
}

.form-control-dark:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--gold);
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.15);
}

.form-control-dark::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form-control-dark::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.7);
  cursor: pointer;
}

.form-select-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
}

.form-select-dark:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--gold);
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.15);
}

.spinner-border.text-gold {
  color: var(--gold);
}

.upload-overlay {
  position: fixed;
  inset: 0;
  z-index: 1060;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.upload-panel {
  background: var(--dark);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
}

.upload-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.upload-panel-body {
  padding: 20px 24px;
}

.upload-panel-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .filter-pill {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
  .gallery-card img {
    height: 250px;
  }
}

@media (max-width: 576px) {
  .gallery-card img {
    height: 220px;
  }
  .gallery-card-overlay {
    opacity: 1;
    padding: 16px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 50%);
  }
  .gallery-card-content {
    transform: translateY(0);
  }
}

/* Edit button on card */
.gallery-edit-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  opacity: 0;
  transform: scale(0.8);
  z-index: 2;
}

.gallery-card:hover .gallery-edit-btn {
  opacity: 1;
  transform: scale(1);
}

.gallery-edit-btn:hover {
  background: var(--gold);
  color: #000;
  border-color: var(--gold);
}

/* Edit modal current image preview */
.edit-current-image {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.edit-current-thumb {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.edit-current-hint {
  font-size: 0.8rem;
  color: rgba(255, 215, 0, 0.7);
}</style>
