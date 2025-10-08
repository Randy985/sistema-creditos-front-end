<template>
  <v-container fluid>
    <!-- ENCABEZADO PRINCIPAL -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-folder-upload</v-icon>
        Documentación de soporte
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Gestión de documentos requeridos según tipo de crédito y persona.
      </v-card-subtitle>
    </v-card>

    <!-- FILTROS -->
    <v-card elevation="2" class="mb-8 rounded-lg pa-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="filtroPersona"
            label="Tipo de persona"
            :items="['Natural', 'Jurídica', 'Todas']"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="filtroCredito"
            label="Tipo de crédito"
            :items="creditTypes"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4" class="d-flex align-center justify-end">
          <v-btn
            color="primary"
            variant="flat"
            rounded="md"
            size="default"
            @click="resetFiltros"
          >
            <v-icon start>mdi-filter-off-outline</v-icon>
            Limpiar filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- TABLA -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-file-document-outline</v-icon>
          Listado de documentos requeridos
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          variant="elevated"
          rounded="md"
          size="default"
          class="text-capitalize"
        >
          <v-icon start>mdi-plus</v-icon>
          Nuevo documento
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredDocuments"
        density="compact"
        class="custom-table rounded-lg"
      >
        <!-- ESTADO -->
        <template #item.estado="{ item }">
          <div class="d-flex justify-center">
            <v-chip
              :color="getEstadoColor(item.estado)"
              text-color="white"
              size="small"
              class="px-3 text-caption"
            >
              {{ item.estado }}
            </v-chip>
          </div>
        </template>

        <!-- ACCIONES -->
        <template #item.acciones="{ item }">
          <div class="d-flex justify-center align-center gap-1">
            <v-btn icon color="primary" variant="text" size="small" :title="'Subir ' + item.nombre">
              <v-icon size="18">mdi-upload</v-icon>
            </v-btn>
            <v-btn icon color="success" variant="text" size="small" :title="'Ver ' + item.nombre">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
            <v-btn icon color="error" variant="text" size="small" :title="'Eliminar ' + item.nombre">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import data from "@/data/documentation.json";

interface DocumentItem {
  id: number;
  nombre: string;
  tipoPersona: string;
  tipoCredito: string;
  estado: string;
}

const documents = ref<DocumentItem[]>([]);
const filtroPersona = ref("Todas");
const filtroCredito = ref("Todos");

onMounted(() => {
  documents.value = data.documents;
});

const creditTypes = [
  "Crédito 7 días",
  "Crédito 8-30 días",
  "Crédito herramientas",
  "Todos",
];

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Nombre del documento", key: "nombre", align: "start" as const },
  { title: "Tipo de persona", key: "tipoPersona", align: "start" as const },
  { title: "Tipo de crédito", key: "tipoCredito", align: "start" as const },
  { title: "Estado", key: "estado", align: "center" as const },
  { title: "Acciones", key: "acciones", align: "center" as const, sortable: false },
];


const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Cargado":
      return "success";
    case "Pendiente":
      return "warning";
    case "Incompleto":
      return "error";
    default:
      return "grey";
  }
};

const filteredDocuments = computed(() => {
  return documents.value.filter((d) => {
    const matchPersona =
      filtroPersona.value === "Todas" || d.tipoPersona.includes(filtroPersona.value);
    const matchCredito =
      filtroCredito.value === "Todos" || d.tipoCredito === filtroCredito.value;
    return matchPersona && matchCredito;
  });
});

const resetFiltros = () => {
  filtroPersona.value = "Todas";
  filtroCredito.value = "Todos";
};
</script>

<style scoped>
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9rem;
  margin-top: 8px;
}

.custom-table thead th {
  font-weight: 700 !important;
  background-color: #f9fafb !important;
}

.v-chip {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

.v-data-table .v-btn {
  min-width: 22px !important;
  height: 22px !important;
  margin: 0 1px !important; /* botones más juntos */
}

.v-data-table .v-btn .v-icon {
  font-size: 20px !important; /* ícono un poco más grande */
}

.v-toolbar-title {
  padding-left: 0 !important;
}

.v-card {
  border: 1px solid #e0e0e0;
}
</style>

