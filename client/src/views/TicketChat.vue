<template>
  <div class="max-h-screen bg-gray-100 flex flex-col">
    <div class="bg-white shadow p-4 flex items-center justify-between">
      <button
        class="text-indigo-600 font-semibold"
        @click="router.push(`/${userRole}/tickets`)"
      >
        ← Back
      </button>

      <h1 class="text-lg font-bold">Ticket #{{ ticketId }} Chat</h1>

      <div class="text-sm text-gray-500">
        {{ userRole }}
      </div>
    </div>

    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 max-h-115">
      <div v-if="loading" class="text-gray-600">Loading messages...</div>
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <div v-if="messages.length === 0 && !loading" class="text-gray-500">
        No messages yet. Start conversation!
      </div>

      <div class="space-y-3">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex w-full"
          :class="msg.senderId === userId ? 'justify-start' : 'justify-end'"
        >
          <div
            class="relative px-4 py-2 text-sm shadow-md w-fit max-w-[70%]"
            :class="
              msg.senderId === userId
                ? 'bg-white px-3 py-2 text-gray-700 rounded-2xl rounded-bl-none shadow-md'
                : 'bg-blue-700 px-3 py-2 text-white rounded-2xl rounded-br-none shadow-md'
            "
          >
            <div class="text-xs font-semibold opacity-80 mb-1">
              {{ msg.sender?.name }}
              <span class="opacity-70">({{ msg.sender?.role }})</span>
            </div>

            <div class="whitespace-pre-wrap wrap-break-word">
              {{ msg.content }}
            </div>

            <div class="text-[10px] opacity-70 mt-1 text-right">
              {{ formatDate(msg.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 shadow flex gap-3">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type message..."
        class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
        @keyup.enter="sendMessage"
        :disabled="isClosed"
      />

      <button
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        :disabled="sending || newMessage.trim() === '' || isClosed"
        @click="sendMessage"
      >
        {{ isClosed ? "Closed" : sending ? "Sending..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { io } from "socket.io-client";

const route = useRoute();
const router = useRouter();
const socket = io("http://localhost:3000");

const ticketId = route.params.id;

const messages = ref([]);
const newMessage = ref("");
const loading = ref(false);
const sending = ref(false);
const error = ref("");
const ticketStatus = ref("");
const chatContainer = ref(null);

const userId = parseInt(localStorage.getItem("userId") || "0");
const userRole = localStorage.getItem("role") || "unknown";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

async function fetchTicketDetail() {
  try {
    const res = await api.get(`/tickets/${ticketId}`);
    ticketStatus.value = res.data.data.status;
    console.log(res);
  } catch (err) {
    console.log("Failed fetch ticket detail", err);
  }
}

const isClosed = computed(() => ticketStatus.value === "closed");

async function fetchMessages() {
  try {
    loading.value = true;
    error.value = "";

    const res = await api.get(`/tickets/${ticketId}/messages`);
    messages.value = res.data.data || [];
    scrollToBottom();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load messages";
  } finally {
    loading.value = false;
  }
}

async function sendMessage() {
  try {
    if (isClosed.value) {
      error.value = "Ticket sudah closed, tidak bisa mengirim pesan.";
      return;
    }
    sending.value = true;
    error.value = "";

    const payload = {
      content: newMessage.value,
    };

    await api.post(`/tickets/${ticketId}/messages`, payload);

    newMessage.value = "";

    await fetchMessages();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to send message";
  } finally {
    sending.value = false;
  }
}

function scrollToBottom() {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }, 10);
}

onMounted(async () => {
  await fetchTicketDetail();
  await fetchMessages();

  scrollToBottom();

  socket.emit("joinTicketRoom", ticketId);

  socket.on("newMessage", (msg) => {
    messages.value.push(msg);
    scrollToBottom();
  });
});
</script>
