<template>
  <footer class="bg-dark text-light py-5 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <h5 class="mb-3"><i class="bi bi-music-note-beamed me-2"></i>Harmony Voices</h5>
          <p class="text-muted">
            Bringing harmony to life through the power of choral music. Join us in our musical
            journey.
          </p>
          <div class="social-links">
            <a href="#" class="text-light me-3"><i class="bi bi-facebook fs-5"></i></a>
            <a href="#" class="text-light me-3"><i class="bi bi-instagram fs-5"></i></a>
            <a href="#" class="text-light me-3"><i class="bi bi-youtube fs-5"></i></a>
            <a href="#" class="text-light"><i class="bi bi-twitter fs-5"></i></a>
          </div>
        </div>

        <div class="col-lg-4 mb-4">
          <h5 class="mb-3">Quick Links</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-muted text-decoration-none">Home</router-link></li>
            <li>
              <router-link to="/events" class="text-muted text-decoration-none">Events</router-link>
            </li>
            <li>
              <router-link to="/members" class="text-muted text-decoration-none"
                >Members</router-link
              >
            </li>
            <li>
              <router-link to="/gallery" class="text-muted text-decoration-none"
                >Gallery</router-link
              >
            </li>
          </ul>
        </div>

        <div class="col-lg-4 mb-4">
          <h5 class="mb-3">Contact Us</h5>
          <ul class="list-unstyled text-muted">
            <li><i class="bi bi-geo-alt me-2"></i>123 Music Avenue, New York, NY 10001</li>
            <li><i class="bi bi-telephone me-2"></i>+1 (555) 123-4567</li>
            <li><i class="bi bi-envelope me-2"></i>info@harmonyvoices.com</li>
          </ul>
        </div>
      </div>

      <hr class="my-4 border-secondary" />

      <div class="text-center text-muted">
        <p class="mb-0">&copy; 2026 Harmony Voices Choir. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.social-links a {
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #ffd700 !important;
}

footer ul li {
  margin-bottom: 8px;
}

footer ul li a:hover {
  color: #ffd700 !important;
}
</style>
