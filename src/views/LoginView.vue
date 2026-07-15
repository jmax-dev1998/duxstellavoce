<template>
  <div class="auth-page">
    <div class="auth-bg-overlay"></div>
    <div class="auth-bg-ornament top-left"></div>
    <div class="auth-bg-ornament bottom-right"></div>

    <div class="auth-container">
      <div class="auth-card-wrapper">
        <div class="auth-card">
          <div class="auth-card-accent"></div>

          <div class="auth-card-inner">
            <div class="auth-header">
              <div class="auth-logo">
                <div class="auth-logo-ring">
                  <i class="bi bi-music-note-beamed"></i>
                </div>
              </div>
              <h1 class="auth-title">Welcome Back</h1>
              <p class="auth-subtitle">Sign in to continue your journey</p>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form" novalidate>
              <div class="form-floating mb-4">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="name@example.com"
                  required
                  autocomplete="email"
                  @input="clearError"
                />
                <label for="email">
                  <i class="bi bi-envelope me-2"></i>Email Address
                </label>
                <div class="form-focus-ring"></div>
              </div>

              <div class="form-floating mb-4">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Password"
                  required
                  autocomplete="current-password"
                  @input="clearError"
                />
                <label for="password">
                  <i class="bi bi-lock me-2"></i>Password
                </label>
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
                <div class="form-focus-ring"></div>
              </div>

              <transition name="alert-slide">
                <div v-if="error" class="auth-alert">
                  <i class="bi bi-exclamation-circle me-2"></i>
                  <span>{{ error }}</span>
                </div>
              </transition>

              <button type="submit" class="auth-submit-btn" :disabled="submitting">
                <span v-if="submitting" class="d-flex align-items-center justify-content-center">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing in...
                </span>
                <span v-else class="d-flex align-items-center justify-content-center">
                  Sign In
                  <i class="bi bi-arrow-right ms-2"></i>
                </span>
              </button>
            </form>

            <div class="auth-divider">
              <span>or continue with</span>
            </div>

            <button type="button" class="google-btn" :disabled="googleSubmitting" @click="handleGoogleLogin">
              <span v-if="googleSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <template v-else>
                <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </template>
            </button>

            <div class="auth-footer">
              <div class="auth-divider">
                <span>New to Dux Stella Voce?</span>
              </div>
              <router-link to="/register" class="auth-switch-btn">
                <i class="bi bi-person-plus me-2"></i>Create an Account
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const submitting = ref(false);
    const googleSubmitting = ref(false);
    const error = ref("");

    const handleLogin = async () => {
      error.value = "";
      submitting.value = true;
      try {
        await authStore.login(email.value, password.value);
        router.push("/");
      } catch (err) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            error.value = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            error.value = "Please enter a valid email address.";
            break;
          case "auth/user-disabled":
            error.value = "This account has been disabled.";
            break;
          case "auth/too-many-requests":
            error.value = "Too many attempts. Please try again later.";
            break;
          default:
            error.value = err.message;
        }
      } finally {
        submitting.value = false;
      }
    };

    const clearError = () => {
      if (error.value) error.value = "";
    };

    const handleGoogleLogin = async () => {
      error.value = "";
      googleSubmitting.value = true;
      try {
        await authStore.googleLogin();
        router.push("/");
      } catch (err) {
        if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
          error.value = err.message;
        }
      } finally {
        googleSubmitting.value = false;
      }
    };

    return { email, password, showPassword, submitting, googleSubmitting, error, handleLogin, clearError, handleGoogleLogin };
  },
};
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 30%, #16213e 60%, #0f0f23 100%);
  overflow: hidden;
  padding: 100px 24px 60px;
}

.auth-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 215, 0, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.03) 0%, transparent 40%);
  pointer-events: none;
}

.auth-bg-ornament {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.06);
  pointer-events: none;
}

.auth-bg-ornament::before {
  content: "";
  position: absolute;
  inset: 60px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.04);
}

.auth-bg-ornament.top-left {
  top: -200px;
  left: -200px;
}

.auth-bg-ornament.bottom-right {
  bottom: -250px;
  right: -200px;
}

.auth-container {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
}

.auth-card-wrapper {
  animation: cardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card {
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

.auth-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

.auth-card-inner {
  padding: 48px 40px 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.auth-logo-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.5s ease;
}

.auth-logo-ring::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.1);
  animation: goldPulse 3s ease-in-out infinite;
}

.auth-logo-ring i {
  font-size: 1.75rem;
  color: var(--gold);
  transition: transform 0.5s ease;
}

.auth-card:hover .auth-logo-ring {
  border-color: rgba(255, 215, 0, 0.35);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
}

.auth-card:hover .auth-logo-ring i {
  transform: scale(1.1);
}

.auth-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 0.5px;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  margin: 0;
}

.auth-form {
  position: relative;
}

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

.form-floating .form-control::placeholder {
  color: transparent;
}

.form-floating .form-control:not(:placeholder-shown),
.form-floating .form-control:focus {
  padding-top: 22px;
  padding-bottom: 6px;
}

.form-floating label {
  position: absolute;
  top: 0;
  left: 0;
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

.password-toggle {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.1rem;
  padding: 4px;
  cursor: pointer;
  z-index: 3;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.password-toggle:hover {
  color: var(--gold);
}

.auth-alert {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 12px;
  color: #f7a8b8;
  font-size: 0.85rem;
  margin-bottom: 20px;
  line-height: 1.4;
}

.auth-alert i {
  font-size: 1rem;
  flex-shrink: 0;
}

.alert-slide-enter-active {
  animation: alertIn 0.35s ease;
}

.alert-slide-leave-active {
  animation: alertIn 0.25s ease reverse;
}

@keyframes alertIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-submit-btn {
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
}

.auth-submit-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  opacity: 0;
  transition: opacity 0.35s ease;
}

.auth-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.1);
}

.auth-submit-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.auth-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-submit-btn span {
  position: relative;
  z-index: 1;
}

.auth-submit-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.auth-submit-btn:hover:not(:disabled) i.bi-arrow-right {
  transform: translateX(4px);
}

.google-btn {
  width: 100%;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
  transform: translateY(-1px);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  flex-shrink: 0;
}

.auth-divider + .google-btn {
  margin-top: -8px;
}

.auth-footer {
  margin-top: 28px;
  text-align: center;
}

.auth-divider {
  position: relative;
  margin-bottom: 20px;
}

.auth-divider::before {
  content: "";
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin-bottom: 20px;
}

.auth-divider span {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
}

.auth-switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.auth-switch-btn:hover {
  background: rgba(255, 215, 0, 0.06);
  border-color: rgba(255, 215, 0, 0.2);
  color: var(--gold);
  transform: translateY(-1px);
}

.auth-switch-btn i {
  transition: transform 0.3s ease;
}

.auth-switch-btn:hover i {
  transform: scale(1.1);
}

@media (max-width: 576px) {
  .auth-page {
    padding: 90px 16px 40px;
    align-items: flex-start;
  }

  .auth-card-inner {
    padding: 40px 24px 32px;
  }

  .auth-card {
    border-radius: 20px;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-subtitle {
    font-size: 0.85rem;
  }

  .auth-logo-ring {
    width: 60px;
    height: 60px;
  }

  .auth-logo-ring i {
    font-size: 1.4rem;
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

  .auth-submit-btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  .auth-bg-ornament {
    display: none;
  }
}

@media (max-width: 360px) {
  .auth-card-inner {
    padding: 32px 18px 28px;
  }

  .auth-title {
    font-size: 1.3rem;
  }

  .auth-logo-ring {
    width: 52px;
    height: 52px;
  }

  .auth-logo-ring i {
    font-size: 1.2rem;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .auth-container {
    max-width: 500px;
  }

  .auth-card-inner {
    padding: 52px 44px 44px;
  }
}

@media (min-width: 992px) {
  .auth-container {
    max-width: 480px;
  }

  .auth-card-inner {
    padding: 56px 48px 44px;
  }

  .auth-page {
    padding: 120px 24px 80px;
  }
}

@media (min-width: 1400px) {
  .auth-container {
    max-width: 520px;
  }

  .auth-card-inner {
    padding: 60px 52px 48px;
  }

  .auth-title {
    font-size: 2rem;
  }
}
</style>
