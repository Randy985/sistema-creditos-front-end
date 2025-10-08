import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  name: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    accessToken: localStorage.getItem("accessToken") || "",
    loading: false,
    error: "",
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = "";

      try {
        const { data } = await axios.get("/src/data/usuarios.json");
        const user = data.find(
          (u: User) => u.email === email && u.password === password
        );

        if (!user) throw new Error("Credenciales inválidas");

        const token = "demo-token-" + Math.random().toString(36).substring(2);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        this.accessToken = token;
        this.user = user;
      } catch (err: any) {
        this.error = err.message || "Error al iniciar sesión";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      this.user = null;
      this.accessToken = "";
    },

    initialize() {
      const userData = localStorage.getItem("user");
      if (userData) this.user = JSON.parse(userData);
    },
  },
});
