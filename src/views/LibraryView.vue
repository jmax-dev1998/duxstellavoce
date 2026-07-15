<template>
  <div class="library-page">
    <div class="page-header text-white py-5 mt-5">
      <div class="container">
        <h1 class="display-4 fw-bold">Sheet Music Library</h1>
        <p class="lead">Explore our extensive collection of choral arrangements</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control"
              v-model="searchQuery"
              placeholder="Search sheet music..."
            />
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <select class="form-select" v-model="selectedGenre">
            <option value="All">All Genres</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
        <div class="col-md-3 mb-3">
          <select class="form-select" v-model="selectedDifficulty">
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <!-- Library Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Composer</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Difficulty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(piece, index) in filteredLibrary" :key="piece.id">
                  <td>{{ index + 1 }}</td>
                  <td class="fw-bold">{{ piece.title }}</td>
                  <td>{{ piece.composer }}</td>
                  <td>
                    <span class="badge bg-secondary">{{ piece.genre }}</span>
                  </td>
                  <td>{{ piece.year }}</td>
                  <td>
                    <span class="badge" :class="getDifficultyClass(piece.difficulty)">
                      {{ piece.difficulty }}
                    </span>
                  </td>
                  <td>
                    <a :href="piece.pdf" class="btn btn-sm btn-gold">
                      <i class="bi bi-download me-1"></i>Download
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        const matchesSearch =
          piece.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          piece.composer.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesGenre = selectedGenre.value === "All" || piece.genre === selectedGenre.value;
        const matchesDifficulty =
          selectedDifficulty.value === "All" || piece.difficulty === selectedDifficulty.value;
        return matchesSearch && matchesGenre && matchesDifficulty;
      });
    });

    const getDifficultyClass = (difficulty) => {
      switch (difficulty) {
        case "Beginner":
          return "bg-success";
        case "Intermediate":
          return "bg-warning text-dark";
        case "Advanced":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    };

    return {
      choirStore,
      searchQuery,
      selectedGenre,
      selectedDifficulty,
      genres,
      filteredLibrary,
      getDifficultyClass,
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

.btn-gold {
  background: #ffd700;
  border-color: #ffd700;
  color: #000;
}

.btn-gold:hover {
  background: #ffed4a;
  border-color: #ffed4a;
}

.table-hover tbody tr:hover {
  background-color: rgba(255, 215, 0, 0.1);
}
</style>
