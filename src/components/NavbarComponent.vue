<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <div>
          <img
            src="/logodummy_dsv.png"
            alt="Logo"
            width="40"
            height="40"
            class="d-inline-block align-text-top me-2"
            style="border-radius: 50%; object-fit: cover; border: 2px solid #ffd700"
          />
        </div>
        <span class="fw-bold">Dux Stella Voce</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <i class="bi bi-house-door me-1"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events" active-class="active">
              <i class="bi bi-calendar-event me-1"></i>Events
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/members" active-class="active">
              <i class="bi bi-people me-1"></i>Members
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/gallery" active-class="active">
              <i class="bi bi-images me-1"></i>Gallery
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/library" active-class="active">
              <i class="bi bi-book me-1"></i>Library
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about" active-class="active">
              <i class="bi bi-info-circle me-1"></i>About
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
};
</script>

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
  background: rgba(33, 37, 41, 0.95) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
  margin: 0 5px;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background: #ffd700;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.active {
  color: #ffd700 !important;
}
</style>
