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
      <div class="text-center mb-5">
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
      </div>

      <div class="row gallery-grid">
        <div
          class="col-lg-4 col-md-6 mb-4"
          v-for="photo in filteredGallery"
          :key="photo.id"
        >
          <div
            class="gallery-card"
            @click="openLightbox(photo)"
            data-bs-toggle="modal"
            data-bs-target="#lightboxModal"
          >
            <img :src="photo.image" :alt="photo.title" />
            <div class="gallery-card-overlay">
              <div class="gallery-card-content">
                <span class="badge bg-gold mb-2">{{ photo.category }}</span>
                <h5 class="fw-bold mb-1">{{ photo.title }}</h5>
                <small>{{ formatDate(photo.date) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div class="modal fade" id="lightboxModal" tabindex="-1" v-if="selectedPhoto">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content" style="background: var(--dark); border: 1px solid rgba(255,215,0,0.1);">
            <div class="modal-header border-0">
              <h5 class="modal-title text-white">
                <i class="bi bi-image text-gold me-2"></i>{{ selectedPhoto.title }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center p-0">
              <img
                :src="selectedPhoto.image"
                class="img-fluid"
                :alt="selectedPhoto.title"
                style="max-height: 75vh; width: 100%; object-fit: contain;"
              />
            </div>
            <div class="modal-footer border-0 justify-content-between">
              <div>
                <span class="badge bg-gold me-2">{{ selectedPhoto.category }}</span>
                <small class="text-white-50">{{ formatDate(selectedPhoto.date) }}</small>
              </div>
              <button type="button" class="btn btn-outline-light btn-sm" data-bs-dismiss="modal">
                <i class="bi bi-x-lg me-1"></i>Close
              </button>
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
  name: "GalleryView",
  setup() {
    const choirStore = useChoirStore();
    const activeCategory = ref("All");
    const selectedPhoto = ref(null);

    const categories = computed(() => {
      return [...new Set(choirStore.gallery.map((g) => g.category))];
    });

    const filteredGallery = computed(() => {
      if (activeCategory.value === "All") return choirStore.gallery;
      return choirStore.gallery.filter((g) => g.category === activeCategory.value);
    });

    const openLightbox = (photo) => {
      selectedPhoto.value = photo;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return { choirStore, activeCategory, selectedPhoto, categories, filteredGallery, openLightbox, formatDate };
  },
};
</script>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.filter-pill {
  border-radius: 25px;
  padding: 8px 22px;
  font-weight: 500;
  border: 2px solid #dee2e6;
  color: #495057;
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
</style>
