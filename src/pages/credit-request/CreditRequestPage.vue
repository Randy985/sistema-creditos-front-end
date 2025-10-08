<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card class="mb-6" elevation="3">
      <v-card-title class="d-flex align-center text-h5">
        <v-icon color="primary" class="me-3">mdi-file-document-edit-outline</v-icon>
        Solicitud de créditos
      </v-card-title>
      <v-card-subtitle>Ingreso, mantenimiento y gestión de solicitudes.</v-card-subtitle>
    </v-card>

    <!-- SECCIÓN 1: INGRESO DE SOLICITUD -->
    <v-card class="mb-8" elevation="2">
      <v-card-title class="text-h6">Ingreso de la solicitud</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="4">
              <v-select label="Tipo de crédito" :items="creditTypeNames" variant="outlined" density="comfortable" />

            </v-col>
            <v-col cols="12" md="4">
              <v-select label="Tipo de persona" :items="['Natural', 'Jurídica']" variant="outlined"
                density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="Monto solicitado" prefix="$" type="number" variant="outlined"
                density="comfortable" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Plazo" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tasa de interés" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>

          <v-btn color="primary" class="mt-3">Guardar solicitud</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- SECCIÓN 2: MANTENIMIENTO DE TIPOS DE CRÉDITO -->
    <v-card class="mb-8" elevation="2">
      <v-card-title class="text-h6">Mantenimiento para nuevos tipos de crédito</v-card-title>
      <v-card-text>
        <v-data-table :headers="headersTipos" :items="creditTypes" class="elevation-1" density="comfortable">
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Tipos de crédito registrados</v-toolbar-title>
              <v-spacer />
              <v-btn color="primary" size="small" @click="showTypeModal = true">
                Agregar nuevo tipo
              </v-btn>

            </v-toolbar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- SECCIÓN 3: MANTENIMIENTO DE SOLICITUDES -->
    <v-card elevation="2">
      <v-card-title class="text-h6">Mantenimiento de solicitudes</v-card-title>
      <v-card-text>
        <v-data-table :headers="headersSolicitudes" :items="requests" class="elevation-1" density="comfortable">
          <template #item.estado="{ item }">
            <v-chip :color="getEstadoColor(item.estado)" text-color="white" small class="font-weight-medium">
              {{ item.estado }}
            </v-chip>
          </template>

          <template #item.acciones>
            <v-btn icon variant="text" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon variant="text" color="red"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
  <CreditTypeModal v-model="showTypeModal" @saved="addCreditType" />

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import data from "@/data/credit-requests.json";
import CreditTypeModal from "./CreditTypeModal.vue";

interface CreditRequest {
  id: number;
  tipo: string;
  persona: string;
  monto: number;
  plazo: string;
  tasa: string;
  estado: string;
}

interface CreditType {
  id: number;
  nombre: string;
  plazo: string;
  tasa: string;
}

const requests = ref<CreditRequest[]>([]);
const creditTypes = ref<CreditType[]>([]);

const showTypeModal = ref(false);

const addCreditType = (newType: any) => {
  creditTypes.value.push({
    id: creditTypes.value.length + 1,
    nombre: newType.nombre,
    plazo: newType.plazo,
    tasa: newType.tasa,
  });
};

onMounted(() => {
  requests.value = data.requests;
  creditTypes.value = data.creditTypes;
});

// 👇 computed que devuelve los nombres
const creditTypeNames = computed(() =>
  creditTypes.value.map((c: CreditType) => c.nombre)
);

const headersTipos = [
  { title: "Nombre", key: "nombre" },
  { title: "Plazo", key: "plazo" },
  { title: "Tasa", key: "tasa" },
];

const headersSolicitudes = [
  { title: "ID", key: "id" },
  { title: "Tipo", key: "tipo" },
  { title: "Persona", key: "persona" },
  { title: "Monto", key: "monto" },
  { title: "Plazo", key: "plazo" },
  { title: "Tasa", key: "tasa" },
  { title: "Estado", key: "estado" },
  { title: "Acciones", key: "acciones", sortable: false },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Ingresado": return "blue";
    case "En análisis": return "amber";
    case "Aprobado": return "green";
    case "Rechazado": return "red";
    default: return "grey";
  }
};

</script>


<style scoped>
.v-card-title {
  font-weight: 600;
}

.v-data-table {
  border-radius: 12px;
  overflow: hidden;
}

.v-toolbar-title {
  font-weight: 500;
}

.v-chip {
  text-transform: capitalize;
}
</style>
