import { defineStore } from "pinia";
import { ref } from "vue";
import {
  auth,
  db,
  doc,
  setDoc,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "../firebase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);

  const init = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = false;
    });
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffd700&color=1a1a2e&size=200`;
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      avatar: defaultAvatar,
      role: "guest",
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, init, login, register, logout };
});
