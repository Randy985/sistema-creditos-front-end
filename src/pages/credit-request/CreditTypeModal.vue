<template>
    <v-dialog v-model="dialog" max-width="520" transition="dialog-bottom-transition">
        <v-card elevation="8" class="pa-4" :class="isDark ? 'bg-grey-darken-3 text-white' : 'bg-grey-lighten-5'"
            rounded="lg">
            <!-- Header -->
            <div class="d-flex align-center mb-2">
                <div class="rounded-circle d-flex align-center justify-center me-3"
                    style="width: 0px; height: 0px; background-color: var(--v-theme-primary);">
                    <v-icon color="white">mdi-plus</v-icon>
                </div>
                <div>
                    <div class="text-h6 font-weight-bold">Nuevo tipo de crédito</div>
                    <div class="text-caption opacity-80">Ingresa los datos del nuevo producto crediticio</div>
                </div>
            </div>

            <v-divider class="mb-4" />

            <!-- Form -->
            <v-form ref="formRef" class="pb-2">
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field v-model="form.nombre" label="Nombre del crédito"
                            prepend-inner-icon="mdi-text-box-outline" variant="outlined" density="comfortable"
                            color="primary" rounded="lg" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.plazo" label="Plazo" prepend-inner-icon="mdi-calendar-range"
                            variant="outlined" density="comfortable" color="primary" rounded="lg"
                            placeholder="Ej: 30 días" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.tasa" label="Tasa (%)" prepend-inner-icon="mdi-percent"
                            variant="outlined" density="comfortable" color="primary" rounded="lg"
                            placeholder="Ej: 8%" />
                    </v-col>
                </v-row>
            </v-form>

            <v-divider class="my-4" />

            <!-- Actions -->
            <div class="d-flex justify-end ga-2">
                <v-btn variant="text" color="grey" @click="close">Cancelar</v-btn>
                <v-btn color="primary" variant="elevated" class="px-5" size="large" @click="save">
                    <v-icon start>mdi-content-save-outline</v-icon>
                    Guardar
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import { useTheme } from "vuetify";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "saved"]);

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const formRef = ref();
const form = ref({
    nombre: "",
    plazo: "",
    tasa: ""
});

// Enlace v-model
const dialog = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit("update:modelValue", value),
});

const close = () => (dialog.value = false);

const save = () => {
    if (!form.value.nombre || !form.value.plazo || !form.value.tasa) return;
    emit("saved", { ...form.value });
    close();
    form.value = { nombre: "", plazo: "", tasa: "" };
};
</script>

<style scoped>
.v-card {
    animation: popIn 0.25s ease;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.text-caption {
    color: rgba(0, 0, 0, 0.6);
}

:deep(.v-input__details) {
    display: none;
}
</style>
