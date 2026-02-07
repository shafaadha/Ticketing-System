<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-100 to-purple-100"
  >
    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-center text-lg font-bold mb-4 text-blue-600">Login</h1>

      <AlertBox
        v-if="message"
        :type="alertType"
        :message="message"
        closable
        @close="message = ''"
        class="mb-5"
      />

      <form @submit.prevent="login" class="flex flex-col gap-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition"
        />

        <button
          type="submit"
          class="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 active:bg-blue-700 transition-all shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import AlertBox from "../components/AlertBox.vue";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export default {
  name: "LoginView",
  components: { AlertBox },
  data() {
    return {
      email: "",
      password: "",
      message: "",
      alertType: "info",
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        const { token, role } = res.data;
        const { userId } = jwtDecode(token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        this.alertType = "success";
        this.message = "Login berhasil!";

        if (role === "admin") this.$router.push("/admin/dashboard");
        else if (role === "agent") this.$router.push("/agent/dashboard");
        else if (role === "customer") this.$router.push("/customer/tickets");
      } catch (err) {
        this.alertType = "error";
        this.message =
          err.response?.data?.error || "Terjadi kesalahan. Silakan coba lagi.";
      }
    },
  },
};
</script>
