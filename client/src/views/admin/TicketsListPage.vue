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
              <th class="p-3">Judul</th>
              <th class="p-3">Status</th>
              <th class="p-3">Prioritas</th>
              <th class="p-3">Agent</th>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Assign</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tickets.length === 0">
              <td colspan="7" class="p-4 text-center text-gray-500">
                Tidak ada ticket
              </td>
            </tr>
            <tr
              v-for="ticket in tickets"
              :key="ticket.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">{{ ticket.id }}</td>
              <td class="p-3">{{ ticket.title }}</td>
              <td class="p-3">
                <select
                  v-model="ticket.status"
                  class="border rounded px-2 py-1"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td class="p-3 capitalize">{{ ticket.priority }}</td>
              <td class="p-3">{{ ticket.assignedAgentName ?? "-" }}</td>
              <td class="p-3">{{ formatDate(ticket.createdAt) }}</td>
              <td class="p-3">
                <div class="flex gap-2 items-center">
                  <select
                    v-model="ticket.assignAgentId"
                    class="border rounded px-2 py-1"
                  >
                    <option value="">Pilih Agent</option>
                    <option
                      v-for="agent in agents"
                      :key="agent.id"
                      :value="agent.id"
                    >
                      {{ agent.name }}
                    </option>
                  </select>
                  <button
                    @click="assignAgent(ticket.id, ticket.assignAgentId)"
                    class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Assign
                  </button>
                  <button
                    @click="updateStatus(ticket.id, ticket.status)"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition ml-2"
                  >
                    Update
                  </button>
                </div>
              </td>
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

const tickets = ref([]);
const agents = ref([]);
const filters = ref({ status: "" });
const loading = ref(false);
const error = ref("");
const success = ref("");

const fetchTickets = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/tickets/list", {
      params: filters.value,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    tickets.value = res.data;

    tickets.value.forEach((ticket) => {
      ticket.assignAgentId = ticket.assignedAgentId ?? "";
    });
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "Failed to fetch tickets";
  } finally {
    loading.value = false;
  }
};

const fetchAgents = async () => {
  try {
    const res = await api.get("/users/agents", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    agents.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const assignAgent = async (ticketId, agentId) => {
  if (!agentId) return alert("Pilih agent dulu!");
  try {
    await api.post(
      `/tickets/${ticketId}/assign`,
      { agentId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    success.value = "Ticket berhasil di-assign!";
    fetchTickets();
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "Gagal assign ticket";
  }
};

const updateStatus = async (ticketId, status) => {
  try {
    await api.post(
      `/tickets/${ticketId}/update`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    success.value = "Status ticket berhasil di-update!";
    fetchTickets();
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "Gagal update status tiket";
  }
};

const formatDate = (date) => new Date(date).toLocaleString("id-ID");

onMounted(() => {
  fetchTickets();
  fetchAgents();
});
</script>
