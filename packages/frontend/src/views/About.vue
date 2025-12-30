<template>
  <div class="container">
    <div class="about">
      <h1>About WalkyDoggy</h1>
      
      <div class="content">
        <section>
          <h2>🎯 Our Mission</h2>
          <p>
            WalkyDoggy connects pet owners with professional pet care providers, 
            making it easy to find reliable services for your furry friends.
          </p>
        </section>

        <section>
          <h2>✨ What We Offer</h2>
          <ul>
            <li>🚶 Dog Walking Services</li>
            <li>🏠 Pet Boarding & Sitting</li>
            <li>✂️ Grooming Services</li>
            <li>🎓 Pet Training</li>
            <li>🏥 Pet Daycare</li>
          </ul>
        </section>

        <section>
          <h2>🔧 Tech Stack</h2>
          <div class="tech-stack">
            <div class="tech-item">
              <strong>Frontend:</strong> Vue.js 3, Pinia, Vue Router
            </div>
            <div class="tech-item">
              <strong>Backend:</strong> Node.js, Express, MongoDB, Redis
            </div>
            <div class="tech-item">
              <strong>Infrastructure:</strong> Docker, AWS
            </div>
            <div class="tech-item">
              <strong>Payments:</strong> Stripe
            </div>
            <div class="tech-item">
              <strong>Maps:</strong> Mapbox
            </div>
          </div>
        </section>

        <section>
          <h2>📚 Documentation</h2>
          <p>Check out our comprehensive documentation:</p>
          <ul>
            <li><a href="https://github.com/your-org/walkydoggy">GitHub Repository</a></li>
            <li><router-link to="/">Back to Home</router-link></li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
};
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1f2937;
  text-align: center;
}

.content section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.content h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.content p {
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 1rem;
}

.content ul {
  list-style: none;
  padding-left: 0;
}

.content li {
  padding: 0.5rem 0;
  color: #4b5563;
}

.tech-stack {
  display: grid;
  gap: 1rem;
}

.tech-item {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 4px;
  color: #4b5563;
}

.tech-item strong {
  color: #1f2937;
}

.content a {
  color: #3b82f6;
  text-decoration: none;
}

.content a:hover {
  text-decoration: underline;
}
</style>

