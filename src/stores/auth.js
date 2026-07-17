import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "../firebase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const profile = ref(null);
  const loading = ref(true);

  const isAdminOrManager = computed(() => {
    const role = profile.value?.role;
    return role === "admin" || role === "manager";
  });

  const init = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser;
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          profile.value = snap.exists() ? snap.data() : null;
        } catch {
          profile.value = null;
        }
      } else {
        profile.value = null;
      }
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

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userDoc = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) {
      await setDoc(userDoc, {
        name: cred.user.displayName || cred.user.email.split("@")[0],
        email: cred.user.email,
        avatar: cred.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cred.user.displayName || cred.user.email)}&background=ffd700&color=1a1a2e&size=200`,
        role: "guest",
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, profile, loading, isAdminOrManager, init, login, register, googleLogin, logout };
});
