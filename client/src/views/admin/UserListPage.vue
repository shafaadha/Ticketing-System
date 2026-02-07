<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Daftar Ticket Pelanggan</h1>

      <div class="mb-4">
        <AlertBox
          v-if="error"
          type="error"
          title="Error"
          :message="error"
          @close="error = ''"
        />
        <AlertBox
          v-if="success"
          type="success"
          title="Success"
          :message="success"
          @close="success = ''"
        />
      </div>

      <div class="flex gap-4 mb-4">
        <select v-model="filters.status" class="border rounded px-3 py-2">
          <option value="">Semua Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button
          @click="fetchTickets"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Terapkan
        </button>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading tickets...
      </div>

      <div v-if="!loading" class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="7" class="p-4 text-center text-gray-500">
                Tidak ada ticket
              </td>
            </tr>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">{{ user.id }}</td>
              <td class="p-3">{{ user.name }}</td>
              <td class="p-3">{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlertBox from "../../components/AlertBox.vue";
import api from "../../api/axios";

const users = ref([]);
const filters = ref({ status: "" });
const loading = ref(false);
const error = ref("");
const success = ref("");

const fetchUsers = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/users/lists", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    users.value = res.data.data;
  } catch (err) {
    console.error(err);
    error.value = "Gagal mengambil daftar user";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
