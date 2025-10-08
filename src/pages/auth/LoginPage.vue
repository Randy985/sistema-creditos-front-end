<template>
  <div class="login-page">
    <div class="background-gradient"></div>

    <v-card class="login-card" elevation="8">
      <div class="header">
        <v-avatar size="70" color="primary" class="avatar">
          <v-icon color="white" size="38">mdi-finance</v-icon>
        </v-avatar>
        <h2 class="title">Sistema de Créditos</h2>
        <p class="subtitle">Inicia sesión para continuar</p>
      </div>

      <v-card-text>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
        >
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="onSubmit" v-model="valid">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            color="primary"
            density="comfortable"
            class="mb-4"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            density="comfortable"
            class="mb-6"
            required
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            rounded="lg"
            elevation="2"
            :loading="loading"
          >
            <v-icon start>mdi-login-variant</v-icon>
            Ingresar
          </v-btn>
        </v-form>
      </v-card-text>

      <v-divider class="my-4" />
      <p class="text-center text-grey-darken-1 mb-2">
        ¿Olvidaste tu contraseña?
        <RouterLink to="#" class="text-primary">Recupérala aquí</RouterLink>
      </p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const valid = ref(true);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const onSubmit = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (e: any) {
    errorMessage.value = e?.message || "Error al iniciar sesión.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

:deep(.background-gradient) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: linear-gradient(145deg, #f8fafc 0%, #e0e7ef 35%, #cfd8e3 100%);
  backdrop-filter: blur(2px);
}


/* ✅ Tarjeta visible sobre el fondo */
.login-card {
  position: relative;
  width: 380px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.93);
  backdrop-filter: blur(14px);
  color: #1e293b;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding-top: 16px;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

.avatar {
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.title {
  font-weight: 700;
  color: #0f172a;
  margin-top: 10px;
  margin-bottom: 4px;
}

.subtitle {
  color: #475569;
  font-size: 0.9rem;
}
</style>

<style>
.v-field__input,
.v-field__overlay {
  background-color: transparent !important;
}

.v-field__input:-webkit-autofill,
.v-field__input:-webkit-autofill:hover,
.v-field__input:-webkit-autofill:focus,
.v-field__input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  -webkit-text-fill-color: #000 !important;
  transition: background-color 9999s ease-in-out 0s !important;
}

.v-field__input:-moz-autofill {
  box-shadow: 0 0 0px 1000px transparent inset !important;
  -moz-text-fill-color: #000 !important;
}

.v-field__prepend-inner,
.v-field__append-inner {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
