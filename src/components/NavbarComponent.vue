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
        @click="toggleCollapse"
        aria-controls="navbarNav"
        :aria-expanded="String(collapseOpen)"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav" ref="collapseEl">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="link in navLinks" :key="link.to">
            <router-link
              class="nav-link"
              :to="link.to"
              :exact-active-class="link.exact ? 'active' : ''"
              :active-class="!link.exact ? 'active' : ''"
              @click="closeNav"
            >
              <i :class="link.icon" class="me-1"></i>{{ link.label }}
            </router-link>
          </li>

          <li class="nav-item ms-lg-3" v-if="!authStore.loading">
            <hr class="dropdown-divider d-lg-none my-2" />
            <template v-if="authStore.user">
              <!-- Desktop: avatar dropdown -->
              <div class="dropdown d-none d-lg-block">
                <a class="nav-link dropdown-toggle p-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img :src="avatarUrl" class="rounded-circle" width="34" height="34" :alt="userName" style="object-fit: cover; border: 2px solid var(--gold);" />
                </a>
                <ul class="dropdown-menu dropdown-menu-end" style="border-radius: 12px; border: 1px solid rgba(255,215,0,0.2); background: rgba(26,26,46,0.98); backdrop-filter: blur(20px);">
                  <li>
                    <router-link class="dropdown-item text-white" to="/profile" @click="closeNav" style="border-radius: 8px;">
                      <i class="bi bi-person me-2"></i>Profile
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.1);" /></li>
                  <li>
                    <a class="dropdown-item text-white" href="#" @click.prevent="handleLogout" style="border-radius: 8px;">
                      <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Mobile: inline links -->
              <router-link class="nav-link d-lg-none" to="/profile" @click="closeNav">
                <img :src="avatarUrl" class="rounded-circle me-1" width="20" height="20" :alt="userName" style="object-fit: cover;" />
                Profile
              </router-link>
              <button class="nav-link btn-logout d-lg-none" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </template>
            <template v-else>
              <router-link class="nav-link btn-gold-nav" to="/login" @click="closeNav">
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { db, doc, getDoc } from "../firebase";
import { Collapse } from "bootstrap";

export default {
  name: "NavbarComponent",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const scrolled = ref(false);
    const collapseEl = ref(null);
    const collapseOpen = ref(false);
    const userAvatar = ref("");
    const userName = ref("");
    const isHome = computed(() => route.path === "/");

    let bsCollapse = null;

    const navLinks = [
      { to: "/", label: "Home", icon: "bi bi-house-door", exact: true },
      { to: "/events", label: "Events", icon: "bi bi-calendar-event", exact: false },
      { to: "/members", label: "Members", icon: "bi bi-people", exact: false },
      { to: "/gallery", label: "Gallery", icon: "bi bi-images", exact: false },
      { to: "/library", label: "Library", icon: "bi bi-book", exact: false },
      { to: "/about", label: "About", icon: "bi bi-info-circle", exact: false },
    ];

    const avatarUrl = computed(() => {
      if (userAvatar.value) return userAvatar.value;
      if (authStore.user?.photoURL) return authStore.user.photoURL;
      const name = userName.value || authStore.user?.email || "User";
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffd700&color=1a1a2e&size=40`;
    });

    const fetchUserProfile = async (uid) => {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          userAvatar.value = data.avatar || "";
          userName.value = data.name || "";
        }
      } catch {
        // fallback to auth data
      }
    };

    const handleScroll = () => {
      scrolled.value = window.scrollY > 50;
    };

    const toggleCollapse = () => {
      if (bsCollapse) bsCollapse.toggle();
    };

    const closeNav = () => {
      if (bsCollapse && collapseOpen.value) bsCollapse.hide();
    };

    const handleLogout = async () => {
      await authStore.logout();
      closeNav();
      router.push("/");
    };

    watch(() => authStore.user, (newUser) => {
      if (newUser) fetchUserProfile(newUser.uid);
      else { userAvatar.value = ""; userName.value = ""; }
    });

    onMounted(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });

      if (authStore.user) fetchUserProfile(authStore.user.uid);

      if (collapseEl.value) {
        bsCollapse = new Collapse(collapseEl.value, { toggle: false });
        collapseEl.value.addEventListener("shown.bs.collapse", () => { collapseOpen.value = true; });
        collapseEl.value.addEventListener("hidden.bs.collapse", () => { collapseOpen.value = false; });
      }
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
      if (bsCollapse) bsCollapse.dispose();
    });

    return { scrolled, collapseEl, collapseOpen, userAvatar, userName, avatarUrl, navLinks, isHome, authStore, toggleCollapse, closeNav, handleLogout };
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
