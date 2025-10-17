import { defineStore } from "pinia";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  name: string;
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    role: null as Role | null,
    accessToken: localStorage.getItem("accessToken") || "",
    loading: false,
    error: "",
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = "";

      try {
        // Carga usuarios y roles del sistema (desde /public)
        const usersRes = await fetch("/usuarios.json");
        const rolesRes = await fetch("/roles.json");

        const users = await usersRes.json();
        const roles = await rolesRes.json();

        const user = users.find(
          (u: User) => u.email === email && u.password === password
        );

        if (!user) throw new Error("Credenciales inválidas");

        // Buscar rol asociado al usuario
        const role = roles.find((r: Role) => r.id === user.roleId) || null;

        // Token simulado
        const token = "demo-token-" + Math.random().toString(36).substring(2);

        // Guardar en localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", JSON.stringify(role));

        this.accessToken = token;
        this.user = user;
        this.role = role;
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
      localStorage.removeItem("role");
      this.user = null;
      this.role = null;
      this.accessToken = "";
    },

    initialize() {
      const userData = localStorage.getItem("user");
      const roleData = localStorage.getItem("role");

      if (userData) this.user = JSON.parse(userData);
      if (roleData) this.role = JSON.parse(roleData);
    },
  },
});
