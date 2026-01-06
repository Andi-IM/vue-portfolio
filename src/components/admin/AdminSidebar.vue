<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { LayoutDashboard, FilePlus, Home, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref } from 'vue';

const route = useRoute();
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Posts', to: '/admin/posts', icon: FilePlus },
  { label: 'View Web', to: '/', icon: Home },
];
</script>

<template>
  <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div v-if="!isCollapsed" class="sidebar-logo">Andi<span>CMS</span></div>
      <button @click="toggleSidebar" class="toggle-btn">
        <ChevronLeft v-if="!isCollapsed" :size="20" />
        <ChevronRight v-else :size="20" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        :title="item.label"
      >
        <component :is="item.icon" :size="20" class="nav-icon" />
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <!-- Optional footer content -->
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 260px;
  height: 100vh;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.admin-sidebar.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.sidebar-logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-primary);
  letter-spacing: 0.05em;
}

.sidebar-logo span {
  color: var(--color-text-heading);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  background-color: var(--color-bg-card-hover);
  color: var(--color-primary);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.75rem;
  border-radius: 0.75rem;
  color: var(--color-text-body);
  text-decoration: none;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;
}

.admin-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}

.nav-item:hover {
  background-color: var(--color-bg-card-hover);
  color: var(--color-primary);
}

.nav-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-icon {
  min-width: 20px;
}

.nav-label {
  margin-left: 1rem;
  font-weight: 500;
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
