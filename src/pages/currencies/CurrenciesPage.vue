<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card elevation="2" class="mb-6 pa-4 rounded-lg">
      <v-card-title class="d-flex align-center text-h5 font-weight-bold">
        <v-icon color="primary" size="28" class="me-3">mdi-currency-usd</v-icon>
        Mantenimiento de Monedas
      </v-card-title>
      <v-card-subtitle class="text-body-2 text-medium-emphasis ms-10">
        Catálogo de monedas utilizadas en los países de Centroamérica.
      </v-card-subtitle>
    </v-card>

    <!-- TABLA -->
    <v-card elevation="2" class="rounded-lg pa-4">
      <v-toolbar color="transparent" flat density="compact" class="px-0 mb-2">
        <v-toolbar-title class="d-flex align-center text-subtitle-1 font-weight-bold">
          <v-icon class="me-2" color="primary">mdi-cash-multiple</v-icon>
          Listado de Monedas
        </v-toolbar-title>
        <v-spacer />
        <div class="d-flex align-center">
          <v-text-field
            v-model="search"
            placeholder="Buscar moneda..."
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
            Nueva Moneda
          </v-btn>
        </div>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="filteredCurrencies"
        density="compact"
        class="modern-table rounded-lg"
      >
        <template #item.simbolo="{ item }">
          <div class="text-center font-weight-bold">{{ item.simbolo }}</div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import data from "@/data/currencies.json";

interface Moneda {
  codigo: string;
  nombre: string;
  simbolo: string;
  pais: string;
}

const currencies = ref<Moneda[]>([]);
const search = ref("");

onMounted(() => {
  currencies.value = data.currencies;
});

const headers = [
  { title: "Código", key: "codigo", align: "start" as const },
  { title: "Nombre", key: "nombre", align: "start" as const },
  { title: "Símbolo", key: "simbolo", align: "center" as const },
  { title: "País", key: "pais", align: "start" as const }
];

const filteredCurrencies = computed(() => {
  if (!search.value) return currencies.value;
  return currencies.value.filter((m) =>
    Object.values(m).some((v) =>
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
