<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card class="mb-6 pa-6" elevation="3">
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="primary" class="me-3">mdi-view-dashboard</v-icon>
        Panel principal de créditos
      </v-card-title>
      <v-card-subtitle>Resumen general del sistema de créditos</v-card-subtitle>
    </v-card>

    <!-- TARJETAS RESUMEN -->
    <v-row dense class="mb-6">
      <v-col
        v-for="card in resumen"
        :key="card.label"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card elevation="2" class="pa-4 text-center">
          <v-icon :color="card.color" size="36" class="mb-2">
            {{ card.icon }}
          </v-icon>
          <div class="text-h5 font-weight-bold">{{ card.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ card.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- GRAFICOS -->
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4 d-flex flex-column align-center">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Estados de solicitudes
          </div>
          <canvas id="chartSolicitudes"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4 d-flex flex-column align-center">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Montos por tipo de crédito
          </div>
          <canvas id="chartMontos"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4 d-flex flex-column align-center">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Estado de documentos
          </div>
          <canvas id="chartDocs"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4 d-flex flex-column align-center">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Contratos y pagarés
          </div>
          <canvas id="chartContratos"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import data from "@/data/dashboard.json";

const resumen = ref([
  {
    label: "Solicitudes totales",
    value: 385,
    icon: "mdi-file-document-outline",
    color: "primary",
  },
  {
    label: "Créditos aprobados",
    value: data.solicitudes.aprobadas,
    icon: "mdi-check-circle-outline",
    color: "green",
  },
  {
    label: "Documentos cargados",
    value: data.documentos.cargados,
    icon: "mdi-file-check-outline",
    color: "blue",
  },
  {
    label: "Contratos generados",
    value: data.contratos.generados,
    icon: "mdi-file-sign",
    color: "amber",
  },
]);

onMounted(() => {
  renderCharts();
});

const renderCharts = () => {
  // Gráfico de solicitudes
  new Chart(document.getElementById("chartSolicitudes") as HTMLCanvasElement, {
    type: "doughnut",
    data: {
      labels: ["Aprobadas", "Rechazadas", "Pendientes"],
      datasets: [
        {
          data: [
            data.solicitudes.aprobadas,
            data.solicitudes.rechazadas,
            data.solicitudes.pendientes,
          ],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        },
      ],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });

  // Montos por tipo
  new Chart(document.getElementById("chartMontos") as HTMLCanvasElement, {
    type: "bar",
    data: {
      labels: data.montos.map((m) => m.tipo),
      datasets: [
        {
          label: "Monto ($)",
          data: data.montos.map((m) => m.monto),
          backgroundColor: "#2196F3",
          borderRadius: 6,
        },
      ],
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } },
    },
  });

  // Documentos
  new Chart(document.getElementById("chartDocs") as HTMLCanvasElement, {
    type: "pie",
    data: {
      labels: ["Cargados", "Pendientes", "Incompletos"],
      datasets: [
        {
          data: [
            data.documentos.cargados,
            data.documentos.pendientes,
            data.documentos.incompletos,
          ],
          backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
        },
      ],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });

  // Contratos + Pagaré
  new Chart(document.getElementById("chartContratos") as HTMLCanvasElement, {
    type: "bar",
    data: {
      labels: ["Generados", "Enviados", "Pendientes", "Firmados (pagaré)"],
      datasets: [
        {
          data: [
            data.contratos.generados,
            data.contratos.enviados,
            data.contratos.pendientes,
            data.pagare.firmados,
          ],
          backgroundColor: ["#2196F3", "#03A9F4", "#FFC107", "#4CAF50"],
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
};
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}
.v-card {
  border-radius: 12px;
}
canvas {
  width: 100%;
  max-height: 260px;
}
.text-center {
  text-align: center;
}
</style>
