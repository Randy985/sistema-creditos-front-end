<template>
  <v-container class="text-center py-10">
    <v-card class="pa-6 mx-auto" max-width="500">
      <v-card-title class="text-h5">Sistema de Créditos</v-card-title>
      <v-card-text>
        <p>Bienvenido a la versión de demostración.</p>
        <v-btn color="primary" class="mt-4" @click="toggleDark">
          Cambiar tema ({{ isDark ? 'Oscuro' : 'Claro' }})
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const toggleDark = () => theme.global.name.value = isDark.value ? 'light' : 'dark'
</script>
