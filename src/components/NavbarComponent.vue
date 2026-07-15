<template>
  <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'navbar-scrolled': scrolled || !isHome }">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <div class="brand-logo-wrapper">
          <img
            src="/logodummy_dsv.png"
            alt="Logo"
            width="40"
            height="40"
            class="d-inline-block align-text-top me-2 brand-logo"
          />
        </div>
        <span class="fw-bold brand-text" :class="{ 'brand-text-hidden': isHome && !scrolled }">Dux <span class="gold-text">Stella</span> Voce</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="link in navLinks" :key="link.to">
            <router-link
              class="nav-link"
              :to="link.to"
              :exact-active-class="link.exact ? 'active' : ''"
              :active-class="!link.exact ? 'active' : ''"
            >
              <i :class="link.icon" class="me-1"></i>{{ link.label }}
            </router-link>
          </li>

          <li class="nav-item ms-lg-3" v-if="!authStore.loading">
            <hr class="dropdown-divider d-lg-none my-2" />
            <template v-if="authStore.user">
              <span class="nav-link text-gold d-none d-lg-inline">
                <i class="bi bi-person-circle me-1"></i>{{ authStore.user.email }}
              </span>
              <router-link class="nav-link d-lg-none" to="/">
                <i class="bi bi-person-circle me-1"></i>{{ authStore.user.email }}
              </router-link>
              <button class="nav-link btn-logout" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </template>
            <template v-else>
              <router-link class="nav-link btn-gold-nav" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
              </router-link>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "NavbarComponent",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const scrolled = ref(false);
    const isHome = computed(() => route.path === "/");

    const navLinks = [
      { to: "/", label: "Home", icon: "bi bi-house-door", exact: true },
      { to: "/events", label: "Events", icon: "bi bi-calendar-event", exact: false },
      { to: "/members", label: "Members", icon: "bi bi-people", exact: false },
      { to: "/gallery", label: "Gallery", icon: "bi bi-images", exact: false },
      { to: "/library", label: "Library", icon: "bi bi-book", exact: false },
      { to: "/about", label: "About", icon: "bi bi-info-circle", exact: false },
    ];

    const handleScroll = () => {
      scrolled.value = window.scrollY > 50;
    };

    const handleLogout = async () => {
      await authStore.logout();
      const collapse = document.getElementById("navbarNav");
      if (collapse && collapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
      router.push("/");
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return { scrolled, navLinks, isHome, authStore, handleLogout };
  },
};
</script>

<style scoped>
.navbar {
  padding: 12px 0;
  background: rgba(26, 26, 46, 0);
  transition: background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease;
  z-index: 1000;
  box-sizing: border-box;
}

.navbar-scrolled {
  background: rgba(26, 26, 46, 0.92) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.brand-logo-wrapper {
  display: flex;
  align-items: center;
}

.brand-logo {
  border-radius: 50%;
  border: 2px solid var(--gold);
  transition: var(--transition-smooth);
}

.navbar-scrolled .brand-logo {
  border-color: var(--gold-light);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.brand-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  letter-spacing: 1px;
  color: #fff;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.brand-text-hidden {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
}

.gold-text {
  color: var(--gold);
}

.nav-link {
  position: relative;
  padding: 8px 16px;
  margin: 0 2px;
  font-weight: 500;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85) !important;
  transition: var(--transition-smooth);
  border-radius: 8px;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 2px;
  left: 50%;
  background: var(--gold);
  transition: all 0.4s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 60%;
}

.nav-link:hover,
.nav-link.active {
  color: var(--gold) !important;
  background: rgba(255, 215, 0, 0.08);
}

.navbar-toggler {
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 8px 10px;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,215,0,0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.btn-gold-nav {
  background: linear-gradient(135deg, var(--gold), var(--gold-dark)) !important;
  color: #000 !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  margin-left: 8px;
  font-weight: 700 !important;
  transition: var(--transition-smooth);
}

.btn-gold-nav:hover {
  background: linear-gradient(135deg, var(--gold-light), var(--gold)) !important;
  color: #000 !important;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.btn-gold-nav::after {
  display: none !important;
}

.btn-logout {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.8) !important;
  transition: var(--transition-smooth);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
}

.btn-logout:hover {
  border-color: rgba(255, 215, 0, 0.4) !important;
  color: var(--gold) !important;
  background: rgba(255, 215, 0, 0.08) !important;
}

.btn-logout::after {
  display: none !important;
}

@media (max-width: 991.98px) {
  .navbar {
    padding: 10px 0;
  }
  .navbar-brand span {
    font-size: 1.1rem;
  }
  .navbar-collapse {
    background: rgba(26, 26, 46, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 16px;
    margin-top: 12px;
    border: 1px solid rgba(255, 215, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
  }
  .nav-link {
    padding: 10px 16px;
    margin: 2px 0;
    font-size: 1rem;
  }
  .btn-gold-nav,
  .btn-logout {
    display: block;
    margin: 8px 0 0 0 !important;
    text-align: center;
  }
  .dropdown-divider {
    border-color: rgba(255, 255, 255, 0.1);
    margin: 8px 0;
  }
}

@media (max-width: 400px) {
  .navbar-brand span {
    font-size: 0.95rem;
  }
  .brand-logo {
    width: 32px !important;
    height: 32px !important;
  }
}
</style>
