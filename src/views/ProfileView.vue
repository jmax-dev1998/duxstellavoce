<template>
  <div class="profile-page">
    <div class="profile-bg-overlay"></div>
    <div class="profile-bg-ornament top-left"></div>
    <div class="profile-bg-ornament bottom-right"></div>

    <div class="profile-container">
      <div class="profile-card-wrapper">
        <div class="profile-card">
          <div class="profile-card-accent"></div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="profile-card-inner">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-line w-50 mx-auto mb-4"></div>
            <div class="skeleton-line w-75 mx-auto mb-5"></div>
            <div class="skeleton-line mb-3"></div>
            <div class="skeleton-line mb-3"></div>
            <div class="skeleton-line mb-4"></div>
            <div class="skeleton-line w-100" style="height: 50px; border-radius: 14px;"></div>
          </div>

          <div v-else class="profile-card-inner stagger-fade">
            <!-- Header -->
            <div class="profile-header">
              <div class="avatar-wrapper">
                <div class="avatar-ring">
                  <img
                    :src="avatarDisplay"
                    :alt="form.name"
                    class="avatar-img"
                    @error="avatarError = true"
                  />
                  <div class="avatar-ring-pulse"></div>
                </div>
                <div class="avatar-badge" :class="emailVerified ? 'verified' : 'unverified'">
                  <i :class="emailVerified ? 'bi bi-patch-check-fill' : 'bi bi-exclamation-triangle-fill'"></i>
                </div>
              </div>
              <h1 class="profile-title">{{ form.name || 'Your Profile' }}</h1>
              <p class="profile-subtitle">{{ authStore.user?.email }}</p>
              <span class="role-badge" :class="'role-' + (userRole || 'guest')">
                <i class="bi bi-shield-check me-1"></i>{{ userRole || 'Member' }}
              </span>
            </div>

            <div class="section-divider">
              <span class="section-divider-dot"></span>
            </div>

            <!-- Personal Information -->
            <div class="profile-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-person-badge"></i>
                </div>
                <div>
                  <h3 class="section-title">Personal Information</h3>
                  <p class="section-desc">Update your display name and profile picture</p>
                </div>
              </div>

              <div class="form-floating mb-3">
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Your Name"
                  required
                />
                <label for="name">
                  <i class="bi bi-person me-2"></i>Display Name
                </label>
                <div class="form-focus-ring"></div>
              </div>

              <div class="form-floating">
                <input
                  id="avatar"
                  v-model="form.avatar"
                  type="url"
                  class="form-control"
                  placeholder="https://example.com/avatar.jpg"
                  @input="updatePreview"
                />
                <label for="avatar">
                  <i class="bi bi-image me-2"></i>Avatar URL
                </label>
                <div class="form-focus-ring"></div>
              </div>
            </div>

            <div class="section-divider">
              <span class="section-divider-dot"></span>
            </div>

            <!-- Email & Verification -->
            <div class="profile-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-envelope"></i>
                </div>
                <div>
                  <h3 class="section-title">Email & Verification</h3>
                  <p class="section-desc">Manage your email address and verification status</p>
                </div>
              </div>

              <div class="form-floating mb-2">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-verified': emailVerified, 'is-unverified': !emailVerified && authStore.user }"
                  placeholder="name@example.com"
                  required
                />
                <label for="email">
                  <i class="bi bi-envelope me-2"></i>Email Address
                </label>
                <div class="form-focus-ring"></div>
              </div>

              <div class="email-status-bar">
                <div class="status-badge" :class="emailVerified ? 'status-verified' : 'status-unverified'">
                  <i :class="emailVerified ? 'bi bi-patch-check-fill' : 'bi bi-exclamation-triangle-fill'" class="me-1"></i>
                  <span>{{ emailVerified ? 'Verified' : 'Not verified' }}</span>
                </div>
                <div class="status-actions">
                  <button
                    v-if="!emailVerified && !verifying"
                    type="button"
                    class="btn btn-sm btn-gold-soft"
                    @click="sendVerification"
                  >
                    <i class="bi bi-envelope-check me-1"></i>Resend
                  </button>
                  <button
                    v-if="!emailVerified && !verifying"
                    type="button"
                    class="btn btn-sm btn-icon-soft"
                    @click="refreshEmailStatus"
                    title="Refresh status"
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                  <span v-if="verifying" class="verifying-spinner">
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>Sending...
                  </span>
                </div>
              </div>
            </div>

            <div class="section-divider">
              <span class="section-divider-dot"></span>
            </div>

            <!-- Account Details -->
            <div class="profile-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div>
                  <h3 class="section-title">Account Details</h3>
                  <p class="section-desc">Your account information and security settings</p>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Role</span>
                  <span class="info-value">
                    <span class="role-badge-sm" :class="'role-' + (userRole || 'guest')">
                      {{ userRole || 'Guest' }}
                    </span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value text-truncate">{{ authStore.user?.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">User ID</span>
                  <span class="info-value text-mono">{{ authStore.user?.uid?.slice(0, 12) }}...</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Provider</span>
                  <span class="info-value">{{ providerName }}</span>
                </div>
              </div>
            </div>

            <div class="section-divider">
              <span class="section-divider-dot"></span>
            </div>

            <!-- Security -->
            <div class="profile-section">
              <div class="section-header">
                <div class="section-icon section-icon-danger">
                  <i class="bi bi-shield-exclamation"></i>
                </div>
                <div>
                  <h3 class="section-title">Security</h3>
                  <p class="section-desc">Update your password to keep your account secure</p>
                </div>
              </div>

              <button type="button" class="btn btn-outline-gold w-100" @click="handleChangePassword" :disabled="changingPw">
                <span v-if="changingPw" class="d-flex align-items-center justify-content-center">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Sending...
                </span>
                <span v-else class="d-flex align-items-center justify-content-center">
                  <i class="bi bi-key me-2"></i>Send Password Reset Email
                </span>
              </button>
            </div>

            <!-- Alerts -->
            <transition name="alert-slide">
              <div v-if="message" class="profile-alert" :class="'alert-' + messageType">
                <div class="alert-icon">
                  <i :class="messageType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-info-circle-fill'"></i>
                </div>
                <span class="alert-text">{{ message }}</span>
                <button type="button" class="alert-dismiss" @click="message = ''">&times;</button>
              </div>
            </transition>

            <transition name="alert-slide">
              <div v-if="error" class="profile-alert alert-error">
                <div class="alert-icon">
                  <i class="bi bi-exclamation-circle-fill"></i>
                </div>
                <span class="alert-text">{{ error }}</span>
                <button type="button" class="alert-dismiss" @click="error = ''">&times;</button>
              </div>
            </transition>

            <!-- Save Button -->
            <button type="submit" class="profile-save-btn" :disabled="saving" @click="handleSave">
              <span v-if="saving" class="d-flex align-items-center justify-content-center">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving Changes...
              </span>
              <span v-else class="d-flex align-items-center justify-content-center">
                <i class="bi bi-check2-circle me-2"></i>Save Changes
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { db, doc, getDoc, setDoc } from "../firebase";
import { updateProfile, verifyBeforeUpdateEmail, sendEmailVerification, reload, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default {
  name: "ProfileView",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref({ name: "", email: "", avatar: "" });
    const previewUrl = ref("");
    const avatarError = ref(false);
    const emailVerified = ref(false);
    const userRole = ref("");
    const saving = ref(false);
    const verifying = ref(false);
    const changingPw = ref(false);
    const error = ref("");
    const message = ref("");
    const messageType = ref("success");
    const originalEmail = ref("");
    const loading = ref(true);

    const avatarDisplay = computed(() => {
      if (previewUrl.value && !avatarError.value) return previewUrl.value;
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(form.value.name || 'U')}&background=ffd700&color=1a1a2e&size=160`;
    });

    const providerName = computed(() => {
      const user = authStore.user;
      if (!user) return "";
      const providerData = user.providerData?.[0];
      if (!providerData) return "Email";
      const pid = providerData.providerId;
      if (pid === "password") return "Email";
      if (pid === "google.com") return "Google";
      if (pid === "facebook.com") return "Facebook";
      if (pid === "github.com") return "GitHub";
      return pid || "Email";
    });

    const loadProfile = async () => {
      if (!authStore.user) {
        router.push("/login");
        return;
      }

      const user = authStore.user;
      emailVerified.value = user.emailVerified;
      originalEmail.value = user.email || "";

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          form.value = {
            name: data.name || user.displayName || "",
            email: user.email || data.email || "",
            avatar: data.avatar || user.photoURL || "",
          };
          previewUrl.value = data.avatar || user.photoURL || "";
          userRole.value = data.role || "guest";
        } else {
          form.value = {
            name: user.displayName || "",
            email: user.email || "",
            avatar: user.photoURL || "",
          };
          previewUrl.value = user.photoURL || "";
          userRole.value = "guest";
        }
      } catch {
        form.value = {
          name: user.displayName || "",
          email: user.email || "",
          avatar: user.photoURL || "",
        };
        previewUrl.value = user.photoURL || "";
        userRole.value = "guest";
      } finally {
        loading.value = false;
      }
    };

    const updatePreview = () => {
      avatarError.value = false;
      previewUrl.value = form.value.avatar;
    };

    const sendVerification = async () => {
      if (!authStore.user) return;
      verifying.value = true;
      error.value = "";
      try {
        await sendEmailVerification(authStore.user, {
          url: window.location.origin + "/profile",
        });
        message.value = "Verification email sent! Please check your inbox.";
        messageType.value = "success";
      } catch (e) {
        error.value = e.message;
      } finally {
        verifying.value = false;
      }
    };

    const refreshEmailStatus = async () => {
      if (!authStore.user) return;
      try {
        await reload(authStore.user);
        emailVerified.value = authStore.user.emailVerified;
        if (authStore.user.emailVerified) {
          message.value = "Email verified successfully!";
          messageType.value = "success";
        }
      } catch {
        // silent
      }
    };

    const handleChangePassword = async () => {
      if (!authStore.user?.email) return;
      changingPw.value = true;
      error.value = "";
      message.value = "";
      try {
        await sendPasswordResetEmail(auth, authStore.user.email);
        message.value = "Password reset email sent! Check your inbox.";
        messageType.value = "success";
      } catch (e) {
        error.value = e.message;
      } finally {
        changingPw.value = false;
      }
    };

    const handleSave = async () => {
      if (!authStore.user) return;
      saving.value = true;
      error.value = "";
      message.value = "";

      try {
        const user = authStore.user;
        const uid = user.uid;
        const data = {
          name: form.value.name,
          email: form.value.email,
          avatar: form.value.avatar || "",
        };

        await setDoc(doc(db, "users", uid), data, { merge: true });

        if (user.displayName !== form.value.name) {
          await updateProfile(user, { displayName: form.value.name });
        }

        if (form.value.email !== originalEmail.value && form.value.email !== user.email) {
          try {
            await verifyBeforeUpdateEmail(user, form.value.email);
            message.value = "Verification email sent to the new address. Your email will update after you confirm.";
            messageType.value = "success";
          } catch (e) {
            if (e.code === "auth/requires-recent-login") {
              error.value = "Please log out and sign in again before changing your email.";
            } else {
              error.value = e.message;
            }
            saving.value = false;
            return;
          }
        } else {
          message.value = "Profile updated successfully!";
          messageType.value = "success";
        }

        originalEmail.value = form.value.email;
        avatarError.value = false;
      } catch (e) {
        error.value = e.message;
      } finally {
        saving.value = false;
      }
    };

    onMounted(() => {
      loadProfile();
    });

    return {
      form, previewUrl, avatarError, avatarDisplay, emailVerified, userRole,
      providerName, loading, saving, verifying, changingPw, error, message, messageType,
      authStore, updatePreview, sendVerification, refreshEmailStatus,
      handleChangePassword, handleSave,
    };
  },
};
</script>

<style scoped>
/* ─── Page Layout ─── */
.profile-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 30%, #16213e 60%, #0f0f23 100%);
  overflow: hidden;
  padding: 120px 24px 80px;
}

.profile-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 215, 0, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.03) 0%, transparent 40%);
  pointer-events: none;
}

.profile-bg-ornament {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.06);
  pointer-events: none;
}

.profile-bg-ornament::before {
  content: "";
  position: absolute;
  inset: 60px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.04);
}

.profile-bg-ornament.top-left { top: -200px; left: -200px; }
.profile-bg-ornament.bottom-right { bottom: -250px; right: -200px; }

.profile-container {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.profile-card-wrapper {
  animation: cardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardEntry {
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.profile-card {
  position: relative;
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 24px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 215, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.profile-card-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% 0; }
  100% { background-position: 200% 0; }
}

.profile-card-inner {
  padding: 48px 40px 40px;
}

/* ─── Header / Avatar ─── */
.profile-header {
  text-align: center;
  margin-bottom: 8px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar-ring {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark), var(--gold));
  background-size: 200% 200%;
  animation: ringRotate 4s linear infinite;
  cursor: pointer;
  transition: transform 0.4s ease;
}

.avatar-ring:hover {
  transform: scale(1.05);
}

@keyframes ringRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.avatar-ring-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.2);
  animation: pulseRing 2.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulseRing {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.08); opacity: 0; }
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.avatar-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 3px solid rgba(26, 26, 46, 0.95);
  z-index: 2;
}

.avatar-badge.verified {
  background: #198754;
  color: #fff;
  box-shadow: 0 0 20px rgba(25, 135, 84, 0.4);
}

.avatar-badge.unverified {
  background: #ffc107;
  color: #1a1a2e;
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
}

.profile-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
  letter-spacing: 0.5px;
}

.profile-subtitle {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.9rem;
  margin: 0 0 12px;
}

/* ─── Role Badge ─── */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.role-badge.role-admin { background: rgba(220, 53, 69, 0.15); color: #f7a8b8; border: 1px solid rgba(220, 53, 69, 0.2); }
.role-badge.role-manager { background: rgba(255, 193, 7, 0.15); color: #ffda6a; border: 1px solid rgba(255, 193, 7, 0.2); }
.role-badge.role-guest { background: rgba(255, 255, 255, 0.06); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.08); }

.role-badge-sm {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.role-badge-sm.role-admin { background: rgba(220, 53, 69, 0.15); color: #f7a8b8; }
.role-badge-sm.role-manager { background: rgba(255, 193, 7, 0.15); color: #ffda6a; }
.role-badge-sm.role-guest { background: rgba(255, 255, 255, 0.06); color: rgba(255,255,255,0.5); }

/* ─── Section Divider ─── */
.section-divider {
  position: relative;
  margin: 28px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-divider::before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.15), transparent);
}

.section-divider-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* ─── Sections ─── */
.profile-section {
  margin-bottom: 4px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gold);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.section-icon-danger {
  background: rgba(220, 53, 69, 0.08);
  border-color: rgba(220, 53, 69, 0.15);
  color: #f7a8b8;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}

.section-desc {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  line-height: 1.4;
}

/* ─── Form Controls ─── */
.form-floating {
  position: relative;
}

.form-floating .form-control {
  height: 58px;
  padding: 16px 16px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.form-floating .form-control:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.15);
  outline: none;
}

.form-floating .form-control::placeholder { color: transparent; }

.form-floating .form-control:not(:placeholder-shown),
.form-floating .form-control:focus {
  padding-top: 22px;
  padding-bottom: 6px;
}

.form-floating label {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  padding: 17px 16px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  font-weight: 400;
  pointer-events: none;
  border: 1px solid transparent;
  border-radius: 14px;
  transition: all 0.25s ease;
  z-index: 2;
  display: flex;
  align-items: center;
}

.form-floating label i {
  font-size: 0.85rem;
  color: rgba(255, 215, 0, 0.5);
  transition: color 0.3s ease;
}

.form-floating .form-control:focus ~ label,
.form-floating .form-control:not(:placeholder-shown) ~ label {
  padding-top: 6px;
  padding-bottom: 24px;
  font-size: 0.75rem;
  color: rgba(255, 215, 0, 0.7);
}

.form-floating .form-control:focus ~ label i,
.form-floating .form-control:not(:placeholder-shown) ~ label i {
  color: var(--gold);
  opacity: 0.7;
  font-size: 0.7rem;
}

.form-focus-ring {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: 0;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.08);
}

.form-floating .form-control:focus ~ .form-focus-ring {
  opacity: 1;
}

.form-control.is-verified { border-color: rgba(25, 135, 84, 0.4) !important; }
.form-control.is-unverified { border-color: rgba(255, 193, 7, 0.3) !important; }

/* ─── Email Status ─── */
.email-status-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-verified {
  background: rgba(25, 135, 84, 0.12);
  color: #75b798;
  border: 1px solid rgba(25, 135, 84, 0.2);
}

.status-unverified {
  background: rgba(255, 193, 7, 0.12);
  color: #ffda6a;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.status-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.btn-gold-soft {
  color: var(--gold);
  border: 1px solid rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.06);
  border-radius: 8px;
  padding: 4px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gold-soft:hover {
  background: var(--gold);
  color: #1a1a2e;
  border-color: var(--gold);
}

.btn-icon-soft {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.82rem;
  transition: all 0.3s ease;
}

.btn-icon-soft:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.verifying-spinner {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ─── Info Grid ─── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.info-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.info-value {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.text-mono {
  font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
}

/* ─── Alerts ─── */
.profile-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  line-height: 1.4;
  animation: alertSlide 0.35s ease;
}

@keyframes alertSlide {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-alert.alert-success {
  background: rgba(25, 135, 84, 0.1);
  border: 1px solid rgba(25, 135, 84, 0.2);
  color: #75b798;
}

.profile-alert.alert-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  color: #f7a8b8;
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1.1rem;
}

.alert-text { flex: 1; }

.alert-dismiss {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.4;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: opacity 0.2s ease;
}

.alert-dismiss:hover { opacity: 0.8; }

.alert-slide-enter-active { animation: alertSlide 0.35s ease; }
.alert-slide-leave-active { animation: alertSlide 0.25s ease reverse; }

/* ─── Save Button ─── */
.profile-save-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  border: none;
  border-radius: 14px;
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.profile-save-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  opacity: 0;
  transition: opacity 0.35s ease;
}

.profile-save-btn span { position: relative; z-index: 1; }

.profile-save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.1);
}

.profile-save-btn:hover:not(:disabled)::before { opacity: 1; }

.profile-save-btn:active:not(:disabled) { transform: translateY(0); }

.profile-save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── Password Reset Button ─── */
.btn-outline-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(255, 215, 0, 0.04);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 14px;
  color: rgba(255, 215, 0, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline-gold:hover:not(:disabled) {
  background: var(--gold);
  color: #1a1a2e;
  border-color: var(--gold);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.btn-outline-gold:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ─── Skeleton ─── */
.skeleton-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 20px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}

.skeleton-line {
  height: 14px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}

@keyframes skeletonShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Responsive ─── */
@media (max-width: 576px) {
  .profile-page {
    padding: 100px 16px 60px;
    align-items: flex-start;
  }

  .profile-card-inner {
    padding: 36px 20px 32px;
  }

  .profile-card { border-radius: 20px; }

  .profile-title { font-size: 1.45rem; }

  .avatar-ring { width: 100px; height: 100px; }
  .avatar-badge { width: 26px; height: 26px; font-size: 0.7rem; }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .form-floating .form-control {
    height: 52px;
    font-size: 0.9rem;
    padding: 14px 14px 6px;
  }

  .form-floating label {
    padding: 14px 14px;
    font-size: 0.85rem;
  }

  .profile-save-btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  .email-status-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .status-actions {
    margin-left: 0;
    justify-content: flex-end;
  }

  .profile-bg-ornament { display: none; }
}

@media (max-width: 360px) {
  .profile-card-inner { padding: 28px 16px 28px; }
  .profile-title { font-size: 1.25rem; }
  .avatar-ring { width: 84px; height: 84px; }
  .avatar-badge { width: 22px; height: 22px; font-size: 0.6rem; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .profile-container { max-width: 600px; }
  .profile-card-inner { padding: 52px 44px 44px; }
}

@media (min-width: 992px) {
  .profile-container { max-width: 580px; }
  .profile-card-inner { padding: 56px 48px 44px; }
  .profile-page { padding: 140px 24px 80px; }
}

@media (min-width: 1400px) {
  .profile-container { max-width: 620px; }
  .profile-card-inner { padding: 60px 52px 48px; }
  .profile-title { font-size: 1.85rem; }
}
</style>
