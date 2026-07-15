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
                  <th>Composer</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Difficulty</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(piece, index) in filteredLibrary" :key="piece.id" class="library-row">
                  <td class="text-muted">{{ index + 1 }}</td>
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
                    <a :href="piece.pdf" class="btn btn-sm btn-gold">
                      <i class="bi bi-download me-1"></i>PDF
                    </a>
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
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useChoirStore } from "../stores/choir";

export default {
  name: "LibraryView",
  setup() {
    const choirStore = useChoirStore();
    const searchQuery = ref("");
    const selectedGenre = ref("All");
    const selectedDifficulty = ref("All");

    const genres = computed(() => {
      return [...new Set(choirStore.library.map((l) => l.genre))];
    });

    const filteredLibrary = computed(() => {
      return choirStore.library.filter((piece) => {
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

    return { choirStore, searchQuery, selectedGenre, selectedDifficulty, genres, filteredLibrary };
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
  color: #adb5bd;
  z-index: 10;
  font-size: 1.1rem;
}

.search-input {
  padding-left: 44px;
  border-radius: 12px;
  height: 48px;
  border: 2px solid #e9ecef;
  font-size: 0.95rem;
  transition: var(--transition-smooth);
}

.search-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.12);
}

.form-select-custom {
  border-radius: 12px;
  height: 48px;
  border: 2px solid #e9ecef;
  font-size: 0.95rem;
  transition: var(--transition-smooth);
}

.form-select-custom:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.12);
}

.library-table thead th {
  background: var(--dark);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 16px;
  border: none;
}

.library-row {
  transition: var(--transition-smooth);
}

.library-row:hover {
  background-color: rgba(255, 215, 0, 0.06) !important;
}

.library-row td {
  padding: 14px 16px;
  vertical-align: middle;
  border-color: rgba(0, 0, 0, 0.04);
}

.genre-badge {
  background: rgba(255, 215, 0, 0.12);
  color: #b8960f;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
}

.difficulty-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
}

.diff-beginner { background: rgba(25, 135, 84, 0.12); color: #198754; }
.diff-intermediate { background: rgba(255, 193, 7, 0.12); color: #cc9a06; }
.diff-advanced { background: rgba(220, 53, 69, 0.12); color: #dc3545; }

@media (max-width: 768px) {
  .search-input,
  .form-select-custom {
    height: 44px;
    font-size: 0.9rem;
  }
  .library-table thead th {
    padding: 12px 10px;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .library-row td {
    padding: 10px;
    font-size: 0.85rem;
  }
  .genre-badge,
  .difficulty-badge {
    padding: 4px 10px;
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .library-table thead th {
    font-size: 0.7rem;
    padding: 10px 6px;
  }
  .library-row td {
    padding: 8px 6px;
    font-size: 0.8rem;
  }
  .library-row td .btn-sm {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
  .library-row td .bi-music-note {
    display: none;
  }
}
</style>
