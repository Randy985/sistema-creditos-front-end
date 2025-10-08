<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card class="mb-6" elevation="3">
      <v-card-title class="d-flex align-center text-h5">
        <v-icon color="primary" class="me-3">mdi-chart-box</v-icon>
        Analítica de créditos
      </v-card-title>
      <v-card-subtitle>
        Análisis de solicitudes, montos y comportamiento de aprobación.
      </v-card-subtitle>
    </v-card>

    <!-- RESUMEN -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="3" v-for="item in resumen" :key="item.label">
        <v-card elevation="2" class="pa-4 text-center">
          <v-icon :color="item.color" size="32" class="mb-2">{{ item.icon }}</v-icon>
          <div class="text-h5 font-weight-bold">{{ item.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ item.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- GRAFICOS -->
    <v-row dense>
      <!-- GRÁFICO 1: barras horizontales -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-4 text-center">
            Solicitudes por estatus
          </div>
          <canvas id="chartSolicitudesH"></canvas>
        </v-card>
      </v-col>

      <!-- GRÁFICO 2: línea -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-4 text-center">
            Evolución de montos aprobados
          </div>
          <canvas id="chartLineaMontos"></canvas>
        </v-card>
      </v-col>

      <!-- GRÁFICO 3: radar -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-4 text-center">
            Comparativa entre tipos de crédito
          </div>
          <canvas id="chartRadar"></canvas>
        </v-card>
      </v-col>

      <!-- GRÁFICO 4: polar area -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-4 text-center">
            Distribución porcentual de montos
          </div>
          <canvas id="chartPolar"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import data from "@/data/analytics.json";
import Chart from "chart.js/auto";

const resumen = ref<any[]>([]);

onMounted(() => {
  resumen.value = [
    {
      label: "Total de solicitudes",
      value: data.summary.totalSolicitudes,
      icon: "mdi-file-document-outline",
      color: "primary",
    },
    {
      label: "Aprobadas",
      value: data.summary.aprobadas,
      icon: "mdi-check-circle-outline",
      color: "green",
    },
    {
      label: "Rechazadas",
      value: data.summary.rechazadas,
      icon: "mdi-close-circle-outline",
      color: "red",
    },
    {
      label: "En análisis",
      value: data.summary.enAnalisis,
      icon: "mdi-timer-sand",
      color: "amber",
    },
  ];

  renderCharts();
});

const renderCharts = () => {
  // 1️⃣ Barras horizontales
  new Chart(document.getElementById("chartSolicitudesH") as HTMLCanvasElement, {
    type: "bar",
    data: {
      labels: ["Aprobadas", "Rechazadas", "En análisis"],
      datasets: [
        {
          label: "Cantidad",
          data: [
            data.summary.aprobadas,
            data.summary.rechazadas,
            data.summary.enAnalisis,
          ],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y", // 🔹 barras horizontales
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { beginAtZero: true },
      },
    },
  });

  // 2️⃣ Línea (simulando evolución)
  const labels = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
  ];
  const montos = data.montos.map((m) => m.monto);
  new Chart(document.getElementById("chartLineaMontos") as HTMLCanvasElement, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Montos aprobados ($)",
          data: montos.slice(0, 10),
          borderColor: "#2196F3",
          backgroundColor: "rgba(33,150,243,0.2)",
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#2196F3",
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });

  // 3️⃣ Radar (comparativa)
  new Chart(document.getElementById("chartRadar") as HTMLCanvasElement, {
    type: "radar",
    data: {
      labels: data.montos.map((m) => m.tipo),
      datasets: [
        {
          label: "Monto relativo",
          data: data.montos.map((m) => m.monto / 1000),
          backgroundColor: "rgba(76,175,80,0.3)",
          borderColor: "#4CAF50",
          pointBackgroundColor: "#4CAF50",
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });

  // 4️⃣ Polar area (distribución)
  new Chart(document.getElementById("chartPolar") as HTMLCanvasElement, {
    type: "polarArea",
    data: {
      labels: data.montos.map((m) => m.tipo),
      datasets: [
        {
          data: data.montos.map((m) => m.monto),
          backgroundColor: [
            "#2196F3",
            "#4CAF50",
            "#FFC107",
            "#FF5722",
            "#9C27B0",
            "#00BCD4",
            "#8BC34A",
            "#E91E63",
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "right" },
      },
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
