<template>
  <v-container fluid>
    <!-- ENCABEZADO -->
    <v-card class="mb-6" elevation="3">
      <v-card-title class="d-flex align-center text-h5">
        <v-icon color="primary" class="me-3">mdi-chart-line</v-icon>
        Analítica de créditos
      </v-card-title>
      <v-card-subtitle>
        Reportes visuales de solicitudes, montos y estatus de aprobación.
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
  <!-- GRAFICOS -->
<v-row dense>
  <v-col cols="12" md="6">
    <v-card elevation="2" class="pa-4 d-flex flex-column align-center justify-center" style="height: 380px;">
      <div class="text-subtitle-1 font-weight-medium mb-4">
        Distribución de solicitudes
      </div>
      <div style="max-width: 280px; width: 100%;">
        <canvas id="chartSolicitudes"></canvas>
      </div>
    </v-card>
  </v-col>

  <v-col cols="12" md="6">
    <v-card elevation="2" class="pa-4 d-flex flex-column align-center justify-center" style="height: 380px;">
      <div class="text-subtitle-1 font-weight-medium mb-4">
        Montos aprobados por tipo de crédito
      </div>
      <div style="max-width: 550px; width: 100%;">
        <canvas id="chartMontos"></canvas>
      </div>
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
  // Inicializa tarjetas de resumen
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
  // Gráfico de solicitudes (doughnut)
  const ctx1 = document.getElementById("chartSolicitudes") as HTMLCanvasElement;
  new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Aprobadas", "Rechazadas", "En análisis"],
      datasets: [
        {
          data: [
            data.summary.aprobadas,
            data.summary.rechazadas,
            data.summary.enAnalisis,
          ],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });

  // Gráfico de montos (bar)
  const ctx2 = document.getElementById("chartMontos") as HTMLCanvasElement;
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: data.montos.map((m) => m.tipo),
      datasets: [
        {
          label: "Monto aprobado ($)",
          data: data.montos.map((m) => m.monto),
          backgroundColor: "#2196F3",
          borderRadius: 6,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
};
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

canvas {
  width: 100%;
}

/* Redondeo general */
.v-card {
  border-radius: 12px;
}

/* Subtítulo */
.v-card-subtitle {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}

/* 🔥 Igualar altura de ambos gráficos */
.v-col > .v-card {
  height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Centrar ambos gráficos perfectamente */
.v-col canvas {
  max-height: 240px;
  margin: 0 auto;
  display: block;
}
</style>
