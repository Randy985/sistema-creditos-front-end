<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-account-tie</v-icon>
        Servicio al cliente
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Gestión del contrato y pagaré firmado por el cliente.
      </v-card-subtitle>
    </v-card>

    <!-- TABLA -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-file-account-outline</v-icon>
          Créditos del cliente
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
        :items="filteredCredits"
        density="compact"
        class="modern-table rounded-lg"
      >
        <!-- Estado contrato -->
        <template #item.estadoContrato="{ item }">
          <div class="d-flex justify-center">
            <v-chip
              :color="getEstadoColor(item.estadoContrato)"
              text-color="white"
              size="small"
              class="px-3 text-caption"
            >
              {{ item.estadoContrato }}
            </v-chip>
          </div>
        </template>

        <!-- Estado pagaré -->
        <template #item.pagaré="{ item }">
          <div class="d-flex justify-center">
            <v-chip
              :color="getPagareColor(item.pagaré)"
              text-color="white"
              size="small"
              class="px-3 text-caption"
            >
              {{ item.pagaré }}
            </v-chip>
          </div>
        </template>

        <!-- Acciones -->
        <template #item.acciones="{ item }">
          <div class="d-flex justify-center align-center gap-1">
            <v-btn
              icon
              color="primary"
              variant="text"
              size="small"
              :title="'Generar contrato de ' + item.cliente"
            >
              <v-icon size="20">mdi-file-document-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="success"
              variant="text"
              size="small"
              :title="'Subir pagaré de ' + item.cliente"
            >
              <v-icon size="20">mdi-upload</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import data from "@/data/customer-service.json";

interface CreditRecord {
  id: number;
  cliente: string;
  tipoCredito: string;
  monto: number;
  estadoContrato: string;
  pagaré: string;
}

const credits = ref<CreditRecord[]>([]);
const search = ref("");

onMounted(() => {
  credits.value = data.credits;
});

const refresh = () => {
  console.log("Actualizando datos...");
};

const headers = [
  { title: "ID", key: "id", align: "start" as const },
  { title: "Cliente", key: "cliente", align: "start" as const },
  { title: "Tipo de crédito", key: "tipoCredito", align: "start" as const },
  { title: "Monto", key: "monto", align: "end" as const },
  { title: "Contrato", key: "estadoContrato", align: "center" as const },
  { title: "Pagaré", key: "pagaré", align: "center" as const },
  { title: "Acciones", key: "acciones", align: "center" as const, sortable: false },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return "warning";
    case "Generado":
      return "primary";
    case "Enviado":
      return "success";
    default:
      return "grey";
  }
};

const getPagareColor = (estado: string) => {
  switch (estado) {
    case "Firmado":
      return "success";
    case "Pendiente":
      return "grey";
    default:
      return "primary";
  }
};

const filteredCredits = computed(() => {
  if (!search.value) return credits.value;
  return credits.value.filter((c) =>
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
