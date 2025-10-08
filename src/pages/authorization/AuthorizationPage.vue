<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-check-decagram</v-icon>
        Autorización de créditos
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Revisión, aprobación o rechazo de solicitudes de crédito.
      </v-card-subtitle>
    </v-card>

    <!-- TABLA DE AUTORIZACIONES -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-file-document-multiple-outline</v-icon>
          Solicitudes en proceso
        </v-toolbar-title>
        <v-spacer />
        <div class="d-flex align-center">
          <v-text-field
            v-model="search"
            placeholder="Buscar..."
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
            @click="refresh"
          >
            <v-icon start>mdi-refresh</v-icon>
            Actualizar
          </v-btn>
        </div>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredAuthorizations"
        density="compact"
        class="modern-table rounded-lg"
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
            <v-btn
              icon
              color="success"
              variant="text"
              size="small"
              :title="'Aprobar solicitud de ' + item.solicitante"
              @click="updateEstado(item, 'Aprobado')"
            >
              <v-icon size="20">mdi-check-circle-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              variant="text"
              size="small"
              :title="'Rechazar solicitud de ' + item.solicitante"
              @click="updateEstado(item, 'Rechazado')"
            >
              <v-icon size="20">mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import data from "@/data/authorizations.json";

interface Authorization {
  id: number;
  solicitante: string;
  tipoCredito: string;
  monto: number;
  plazo: string;
  analista: string;
  estado: string;
}

const authorizations = ref<Authorization[]>([]);
const search = ref("");

onMounted(() => {
  authorizations.value = data.authorizations;
});

const refresh = () => {
  console.log("Actualizando lista...");
};

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Solicitante", key: "solicitante", align: "start" as const },
  { title: "Tipo de crédito", key: "tipoCredito", align: "start" as const },
  { title: "Monto", key: "monto", align: "end" as const },
  { title: "Plazo", key: "plazo", align: "center" as const },
  { title: "Analista asignado", key: "analista", align: "start" as const },
  { title: "Estado", key: "estado", align: "center" as const },
  { title: "Acciones", key: "acciones", align: "center" as const, sortable: false },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return "blue";
    case "Aprobado":
      return "success";
    case "Rechazado":
      return "error";
    default:
      return "grey";
  }
};

const filteredAuthorizations = computed(() => {
  if (!search.value) return authorizations.value;
  return authorizations.value.filter((a) =>
    Object.values(a).some((v) =>
      String(v).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const updateEstado = (item: Authorization, nuevoEstado: string) => {
  const target = authorizations.value.find((a) => a.id === item.id);
  if (target) target.estado = nuevoEstado;
};
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

.v-data-table .v-btn {
  min-width: 22px !important;
  height: 22px !important;
  margin: 0 1px !important;
}

.v-data-table .v-btn .v-icon {
  font-size: 20px !important;
}

.v-toolbar-title {
  padding-left: 0 !important;
}

.search-input {
  width: 220px;
  font-size: 0.9rem;
}

.v-card {
  border: 1px solid #e0e0e0;
}
</style>
