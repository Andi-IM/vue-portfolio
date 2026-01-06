<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue';
</script>

<template>
  <div
    class="admin-layout"
    style="
      background-color: var(--color-bg-primary);
      color: var(--color-text-body);
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    "
  >
    <AdminSidebar />

    <main class="admin-main">
      <div class="admin-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
}

.admin-main {
  flex: 1;
  margin-left: 260px; /* Default sidebar width */
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}

/* Compensate for collapsed sidebar */
:deep(.admin-sidebar.collapsed) + .admin-main {
  margin-left: 80px;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }

  :deep(.admin-sidebar.collapsed) + .admin-main {
    margin-left: 0;
  }

  .admin-content {
    padding: 1.5rem;
  }
}
</style>
