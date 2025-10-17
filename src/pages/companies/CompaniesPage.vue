<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-domain</v-icon>
        Mantenimiento de Empresas
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Administración general de las empresas registradas en el sistema.
      </v-card-subtitle>
    </v-card>

    <!-- TABLA -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-office-building-outline</v-icon>
          Listado de Empresas
        </v-toolbar-title>
        <v-spacer />
        <div class="d-flex align-center">
          <v-text-field
            v-model="search"
            placeholder="Buscar empresa..."
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
            Nueva Empresa
          </v-btn>
        </div>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredCompanies"
        density="compact"
        class="modern-table rounded-lg"
      >
        <template #item.estado="{ item }">
          <div class="d-flex justify-center">
            <v-chip
              :color="item.estado === 'Activa' ? 'success' : 'grey'"
              text-color="white"
              size="small"
              class="px-3 text-caption"
            >
              {{ item.estado }}
            </v-chip>
          </div>
        </template>

        <template #item.acciones="{ item }">
          <div class="d-flex justify-center align-center gap-1">
            <v-btn
              icon
              color="primary"
              variant="text"
              size="small"
              :title="'Editar ' + item.nombre"
            >
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              variant="text"
              size="small"
              :title="'Eliminar ' + item.nombre"
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
import data from "@/data/companies.json";

interface Empresa {
  id: number;
  nombre: string;
  pais: string;
  moneda: string;
  estado: string;
}

const companies = ref<Empresa[]>([]);
const search = ref("");

onMounted(() => {
  companies.value = data.companies;
});

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Nombre", key: "nombre", align: "start" as const },
  { title: "País", key: "pais", align: "start" as const },
  { title: "Moneda", key: "moneda", align: "center" as const },
  { title: "Estado", key: "estado", align: "center" as const },
  { title: "Acciones", key: "acciones", align: "center" as const, sortable: false }
];

const filteredCompanies = computed(() => {
  if (!search.value) return companies.value;
  return companies.value.filter((c) =>
    Object.values(c).some((v) =>
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
