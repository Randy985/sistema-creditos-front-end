<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-account-multiple</v-icon>
        Mantenimiento de Usuarios
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Administración de los usuarios registrados en el sistema.
      </v-card-subtitle>
    </v-card>

    <!-- TABLA -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-account-outline</v-icon>
          Listado de Usuarios
        </v-toolbar-title>
        <v-spacer />
        <div class="d-flex align-center">
          <v-text-field
            v-model="search"
            placeholder="Buscar usuario..."
            hide-details
            variant="outlined"
            density="comfortable"
            rounded="pill"
            prepend-inner-icon="mdi-magnify"
            color="primary"
            class="me-3 search-input"
          />
          <v-btn
            color="primary"
            variant="elevated"
            rounded="md"
            size="default"
            class="text-capitalize"
          >
            <v-icon start>mdi-plus</v-icon>
            Nuevo Usuario
          </v-btn>
        </div>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        density="compact"
        class="modern-table rounded-lg"
      >
        <!-- Rol -->
        <template #item.rol="{ item }">
          <v-chip color="primary" variant="flat" size="small" text-color="white">
            {{ getRoleName(item.roleId) }}
          </v-chip>
        </template>

        <!-- Acciones -->
        <template #item.acciones="{ item }">
          <div class="d-flex justify-center align-center gap-1">
            <v-btn
              icon
              color="primary"
              variant="text"
              size="small"
              :title="'Editar usuario ' + item.name"
            >
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              variant="text"
              size="small"
              :title="'Eliminar usuario ' + item.name"
            >
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Usuario {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  name: string;
}

interface Rol {
  id: number;
  nombre: string;
}

const usuarios = ref<Usuario[]>([]);
const roles = ref<Rol[]>([]);
const search = ref("");

// ✅ Cargar datos desde /public
onMounted(async () => {
  const usuariosRes = await fetch("/usuarios.json");
  const rolesRes = await fetch("/roles.json");

  usuarios.value = await usuariosRes.json();
  roles.value = await rolesRes.json();
});

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Nombre", key: "name", align: "start" as const },
  { title: "Usuario", key: "username", align: "start" as const },
  { title: "Correo electrónico", key: "email", align: "start" as const },
  { title: "Rol", key: "rol", align: "center" as const },
  { title: "Acciones", key: "acciones", align: "center" as const, sortable: false },
];

const getRoleName = (roleId: number) => {
  const role = roles.value.find((r) => r.id === roleId);
  return role ? role.nombre : "Sin rol";
};

const filteredUsers = computed(() => {
  if (!search.value) return usuarios.value;
  return usuarios.value.filter((u) =>
    Object.values(u).some((v) =>
      String(v).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});
</script>

<style scoped>
.modern-table {
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9rem;
  margin-top: 8px;
}

.modern-table thead th {
  font-weight: 700 !important;
  background-color: #f9fafb !important;
}

.v-chip {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

.v-btn {
  min-width: 22px !important;
  height: 32px !important;
  margin: 0 2px !important;
}

.v-icon {
  font-size: 20px !important;
}

.search-input {
  width: 220px;
  font-size: 0.9rem;
}
</style>
