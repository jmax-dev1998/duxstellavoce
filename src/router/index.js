import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/EventsView.vue"),
  },
  {
    path: "/members",
    name: "Members",
    component: () => import("../views/MembersView.vue"),
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: () => import("../views/GalleryView.vue"),
  },
  {
    path: "/library",
    name: "Library",
    component: () => import("../views/LibraryView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfileView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
