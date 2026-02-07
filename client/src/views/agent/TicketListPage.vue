<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Daftar Pengajuan Ticket</h1>

      <div class="flex gap-4 mb-4">
        <select v-model="filters.status" class="border rounded px-3 py-2">
          <option value="">Semua Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        <button
          @click="fetchTickets"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Terapkan
        </button>
      </div>

      <div class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Judul</th>
              <th class="p-3">Status</th>
              <th class="p-3">Prioritas</th>
              <th class="p-3">Agent</th>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Chat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tickets.length === 0">
              <td colspan="6" class="p-4 text-center text-gray-500">
                Tidak ada ticket
              </td>
            </tr>
            <tr v-for="ticket in tickets" :key="ticket.id" class="border-t">
              <td class="p-3">{{ ticket.id }}</td>
              <td class="p-3">{{ ticket.title }}</td>
              <td class="p-3">
                <div v-if="ticket.status !== 'resolved'">
                  <button
                    @click="updateStatus(ticket.id)"
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Mark as Resolved
                  </button>
                </div>
                <div v-else class="text-gray-500 font-medium">Resolved</div>
              </td>

              <td class="p-3 capitalize">{{ ticket.priority }}</td>
              <td class="p-3">{{ ticket.assignedAgentId ?? "-" }}</td>
              <td class="p-3">{{ formatDate(ticket.createdAt) }}</td>
              <td>
                <button
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  @click="goToChat(ticket.id)"
                >
                  Chat
                </button>
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
import router from "../../router";
import api from "../../api/axios";

const tickets = ref([]);
const filters = ref({ status: "" });

const fetchTickets = async () => {
  try {
    const res = await api.get("/tickets/list", {
      params: filters.value,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    tickets.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const updateStatus = async (ticketId) => {
  try {
    await api.post(
      `/tickets/${ticketId}/update`,
      { status: "resolved" },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    alert("Ticket berhasil di-resolve!");
    fetchTickets(); // refresh data
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Gagal update status ticket");
  }
};

function goToChat(ticketId) {
  router.push(`/agent/tickets/${ticketId}/chat`);
}

const formatDate = (date) => new Date(date).toLocaleString("id-ID");

const formatStatus = (status) => {
  if (!status) return "-";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

onMounted(fetchTickets);
</script>
