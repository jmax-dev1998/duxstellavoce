<template>
  <div id="app">
    <NavbarComponent />
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    <FooterComponent />
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
  name: "App",
  components: {
    NavbarComponent,
    FooterComponent,
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

    return { transitionName };
  },
};
</script>

<style>
#app {
  width: 100%;
  overflow-x: hidden;
  position: relative;
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
</style>
