<template>
  <div class="gallery-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <h1 class="display-4 fw-bold">Gallery</h1>
        <p class="lead">Capturing moments of musical excellence</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Category Filter -->
      <div class="text-center mb-5">
        <button
          class="btn btn-outline-dark mx-2 mb-2"
          :class="{ active: activeCategory === 'All' }"
          @click="activeCategory = 'All'"
        >
          All Photos
        </button>
        <button
          class="btn btn-outline-dark mx-2 mb-2"
          v-for="cat in categories"
          :key="cat"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Gallery Grid -->
      <div class="row gallery-grid">
        <div class="col-lg-4 col-md-6 mb-4" v-for="photo in filteredGallery" :key="photo.id">
          <div
            class="gallery-card"
            @click="openLightbox(photo)"
            data-bs-toggle="modal"
            data-bs-target="#lightboxModal"
          >
            <img :src="photo.image" :alt="photo.title" class="w-100 rounded-3 shadow-sm" />
            <div class="gallery-info">
              <h5>{{ photo.title }}</h5>
              <p class="mb-0">{{ photo.category }} • {{ formatDate(photo.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div class="modal fade" id="lightboxModal" tabindex="-1" v-if="selectedPhoto">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content bg-dark">
            <div class="modal-header border-0">
              <h5 class="modal-title text-white">{{ selectedPhoto.title }}</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div class="modal-body text-center">
              <img
                :src="selectedPhoto.image"
                class="img-fluid rounded-3"
                :alt="selectedPhoto.title"
              />
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <p class="text-white-50 mb-0">
                {{ selectedPhoto.category }} • {{ formatDate(selectedPhoto.date) }}
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

    return {
      choirStore,
      activeCategory,
      selectedPhoto,
      categories,
      filteredGallery,
      openLightbox,
      formatDate,
    };
  },
};
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-top: -76px;
  padding-top: 100px;
}

.gallery-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
}

.gallery-card img {
  height: 300px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-card:hover img {
  transform: scale(1.1);
}

.gallery-info {
  position: absolute;
  bottom: -100%;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
  padding: 30px 20px 20px;
  transition: bottom 0.3s ease;
}

.gallery-card:hover .gallery-info {
  bottom: 0;
}
</style>
