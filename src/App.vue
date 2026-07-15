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
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
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
    const transitionName = ref("page-fade");

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
