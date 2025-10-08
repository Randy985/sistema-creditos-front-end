<template>
  <v-app>
    <!-- Drawer -->
    <v-navigation-drawer app v-model="drawer" width="240" :color="isDark ? 'grey-darken-4' : 'grey-lighten-3'"
      elevation="2" class="modern-drawer">

      <div class="pa-4 text-h6 font-weight-bold text-center">
        <v-icon color="primary" size="26" class="me-2">mdi-bank</v-icon>
        Créditos
      </div>
      <v-divider class="mb-2" />

      <v-list nav density="comfortable">
        <v-list-item v-for="item in navItems" :key="item.to" :to="item.to" link rounded="lg" class="nav-item"
          :active="isActive(item.to)" active-class="nav-active">
          <template #prepend>
            <font-awesome-icon :icon="item.icon" class="me-3 nav-icon" />
          </template>
          <v-list-item-title class="text-subtitle-2">
            {{ item.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <v-divider class="my-2" />
        <v-list-item link @click="logout" class="nav-item">
          <template #prepend>
            <font-awesome-icon icon="right-from-bracket" class="me-3" />
          </template>
          <v-list-item-title class="text-red">Cerrar sesión</v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar flat elevation="4" class="app-bar px-4" :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'">
      <v-btn icon variant="text" class="me-2" @click="drawer = !drawer">
        <v-icon>{{ drawer ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
      </v-btn>

      <v-toolbar-title class="font-weight-bold">
        Bienvenido, {{ user?.name }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon variant="text" @click="toggleDark" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Content -->
    <v-main :class="isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-4'">
      <v-container fluid class="py-6 fade-in" style="padding-inline: 30px;">
        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

const drawer = ref(true);
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const toggleDark = () => {
  const next = isDark.value ? "light" : "dark";
  const t: any = theme;
  if (typeof t.change === "function") t.change(next);
  else if (t.global?.name) t.global.name.value = next;
};

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = computed(() => auth.user);

const logout = () => {
  auth.logout();
  router.push("/login");
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "chart-line" },
  { to: "/dashboard/solicitud-de-credito", label: "Solicitud de crédito", icon: "file-pen" },
  { to: "/dashboard/documentacion", label: "Documentación", icon: "folder-open" },
  { to: "/dashboard/autorizacion", label: "Autorización", icon: "check-circle" },
  { to: "/dashboard/servicio-al-cliente", label: "Servicio al cliente", icon: "handshake" },
  { to: "/dashboard/analitica", label: "Analítica", icon: "chart-pie" },
];

// Activo exacto (evita que /dashboard quede activo en rutas hijas)
const isActive = (path: string) => route.path === path;
</script>

<style scoped>
.modern-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

/* ícono hereda color */
.nav-icon {
  color: currentColor;
}

/* Estado normal */
.nav-item {
  color: var(--v-theme-on-surface);
  transition: background-color 0.18s ease, transform 0.12s ease, color 0.18s ease;
}

/* Hover */
.nav-item:hover {
  background-color: rgba(120, 120, 120, 0.1);
  transform: translateX(3px);
}

/* Activo gris neutro */
.nav-active {
  background-color: rgba(96, 125, 139, 0.20) !important;
  color: var(--v-theme-on-surface) !important;
  font-weight: 600;
  border-radius: 12px;
}

/* App bar */
.app-bar {
  backdrop-filter: blur(10px);
}

/* Transición de vista */
.fade-in {
  animation: fade 0.3s ease;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
