<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 mb-4">
            <div class="footer-brand">
              <img
                src="/logodummy_dsv.png"
                alt="Logo"
                width="50"
                height="50"
                class="rounded-circle mb-3"
                style="border: 2px solid var(--gold)"
              />
              <h5 class="fw-bold mb-3">Dux <span class="gold-text">Stella</span> Voce</h5>
              <p class="text-white-50">
                Bringing harmony to life through the power of choral music. Join us in our musical
                journey.
              </p>
            </div>
            <div class="social-links mt-3">
              <a href="#" class="social-icon" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-icon" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-icon" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              <a href="#" class="social-icon" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="social-icon" aria-label="Spotify"><i class="bi bi-spotify"></i></a>
            </div>
          </div>

          <div class="col-lg-2 col-md-4 mb-4">
            <h6 class="fw-bold mb-3 footer-heading">Quick Links</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/"><i class="bi bi-chevron-right me-1"></i>Home</router-link></li>
              <li><router-link to="/events"><i class="bi bi-chevron-right me-1"></i>Events</router-link></li>
              <li><router-link to="/members"><i class="bi bi-chevron-right me-1"></i>Members</router-link></li>
              <li><router-link to="/gallery"><i class="bi bi-chevron-right me-1"></i>Gallery</router-link></li>
              <li><router-link to="/library"><i class="bi bi-chevron-right me-1"></i>Library</router-link></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-4 mb-4">
            <h6 class="fw-bold mb-3 footer-heading">Support</h6>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/about"><i class="bi bi-chevron-right me-1"></i>About Us</router-link></li>
              <li><a href="#"><i class="bi bi-chevron-right me-1"></i>FAQ</a></li>
              <li><a href="#"><i class="bi bi-chevron-right me-1"></i>Privacy Policy</a></li>
              <li><a href="#"><i class="bi bi-chevron-right me-1"></i>Terms of Service</a></li>
              <li><a href="#"><i class="bi bi-chevron-right me-1"></i>Contact</a></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-4 mb-4">
            <h6 class="fw-bold mb-3 footer-heading">Contact</h6>
            <ul class="list-unstyled footer-contact">
              <li>
                <div class="contact-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>123 Music Avenue<br />New York, NY 10001</span>
                </div>
              </li>
              <li>
                <div class="contact-item">
                  <i class="bi bi-telephone"></i>
                  <span>+1 (555) 123-4567</span>
                </div>
              </li>
              <li>
                <div class="contact-item">
                  <i class="bi bi-envelope"></i>
                  <span>info@harmonyvoices.com</span>
                </div>
              </li>
              <li>
                <div class="contact-item">
                  <i class="bi bi-clock"></i>
                  <span>Mon-Fri: 9AM - 6PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start">
            <p class="mb-0">&copy; 2026 Dux Stella Voce. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span class="made-with">Made with <i class="bi bi-heart-fill text-gold"></i> for music</span>
          </div>
        </div>
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
.footer {
  background: linear-gradient(180deg, var(--dark) 0%, #0d0d1a 100%);
  color: rgba(255, 255, 255, 0.85);
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.footer-top {
  padding: 60px 0 40px;
}

.footer-brand h5 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
}

.gold-text {
  color: var(--gold);
}

.footer-heading {
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 20px;
  color: #fff;
  font-size: 1.1rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--gold);
  border-radius: 2px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  text-decoration: none;
  transition: var(--transition-smooth);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-icon:hover {
  background: var(--gold);
  color: #000;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
  border-color: var(--gold);
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: var(--transition-smooth);
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--gold);
  padding-left: 5px;
}

.footer-links i {
  font-size: 0.7rem;
  transition: var(--transition-smooth);
}

.footer-links a:hover i {
  color: var(--gold);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.contact-item i {
  font-size: 1.1rem;
  color: var(--gold);
  margin-top: 3px;
  flex-shrink: 0;
}

.footer-bottom {
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

.made-with i {
  animation: goldPulse 2s infinite;
  display: inline-block;
}

@media (max-width: 768px) {
  .footer-top {
    padding: 40px 0 20px;
  }
}
</style>
