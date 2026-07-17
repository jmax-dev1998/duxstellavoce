<template>
  <div id="app">
    <NavbarComponent />
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
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
