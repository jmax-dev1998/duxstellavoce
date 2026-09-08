<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div id="app">
    <NavbarComponent />
    <div id="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
    <FooterComponent />
    <transition name="loader-fade">
      <LoadingScreen v-if="authStore.loading" />
    </transition>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
  name: "App",
  components: {
    NavbarComponent,
    FooterComponent,
    LoadingScreen,
  },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const transitionName = ref("page-fade");

    onMounted(() => {
      authStore.init();
    });

    watch(
      () => route.path,
      () => {
        transitionName.value = "page-fade";
      }
    );

    return { transitionName, authStore };
  },
};
</script>

<style>
#app {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--gold);
  color: #1a1a2e;
  padding: 8px 16px;
  z-index: 100000;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 8px 0;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.loader-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.loader-fade-leave-to {
  opacity: 0;
}
</style>
