<script setup lang="ts">
import { RouterLink } from 'vue-router';

// Reuse existing navigation translations
</script>

<template>
  <div class="blog-header">
    <div class="blog-header-inner">
      <div class="blog-title-section">
        <RouterLink to="/blog" class="blog-title-link">
          <h1 class="blog-title">Blog</h1>
        </RouterLink>
      </div>
      <nav class="blog-nav-section">
        <RouterLink to="/blog" class="blog-nav-item font-bold">
          {{ $t('nav.blog.title') }}
        </RouterLink>
        <RouterLink to="/blog" class="blog-nav-item">
          {{ $t('nav.blog.cerita') }}
        </RouterLink>
        <RouterLink to="/blog" class="blog-nav-item">
          {{ $t('nav.blog.tutorial') }}
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.blog-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  margin-top: 5rem; /* Height of the fixed navbar */
  position: sticky;
  top: 5rem;
  z-index: 30;
  backdrop-filter: blur(8px);
  background: var(--color-bg-navbar);
}

.blog-header-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-title-link {
  text-decoration: none;
}

.blog-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-heading);
  margin: 0;
  line-height: 1;
}

.blog-nav-section {
  display: flex;
  gap: 2rem;
}

.blog-nav-item {
  color: var(--color-text-body);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.blog-nav-item:hover {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .blog-header-inner {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .blog-title {
    font-size: 1.75rem;
  }
}
</style>
