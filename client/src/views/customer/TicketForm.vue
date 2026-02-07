<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Create Ticket</h2>

    <div class="space-y-4 mb-4">
      <AlertBox
        v-if="success"
        type="success"
        title="Berhasil!"
        :message="success"
        @close="success = ''"
      />

      <AlertBox
        v-if="error"
        type="error"
        title="Gagal!"
        :message="error"
        @close="error = ''"
      />
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Title</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded p-2"
          placeholder="Masukkan judul ticket"
          required
        />
      </div>

      <div>
        <label class="block font-medium mb-1">Description</label>
        <textarea
          v-model="form.description"
          class="w-full border rounded p-2"
          placeholder="Masukkan deskripsi masalah"
          rows="4"
          required
        ></textarea>
      </div>

      <div>
        <label class="block font-medium mb-1">Priority</label>
        <select
          v-model="form.priority"
          class="w-full border rounded p-2"
          required
        >
          <option disabled value="">Pilih priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Ticket
      </button>
    </form>
  </div>
</template>

<script>
import AlertBox from "../../components/AlertBox.vue";
import api from "../../api/axios";

export default {
  components: { AlertBox },
  data() {
    return {
      form: {
        title: "",
        description: "",
        priority: "",
      },
      error: "",
      success: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.error = "";
      this.success = "";

      try {
        const token = localStorage.getItem("token");

        const res = await api.post(
          "/tickets",
          this.form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.success = "Ticket berhasil dibuat!";
        console.log("Ticket created:", res.data);

        this.form.title = "";
        this.form.description = "";
        this.form.priority = "";

        setTimeout(() => {
          this.success = "";
        }, 3000);
      } catch (err) {
        console.log(err);

        this.error = err.response?.data?.error || "Gagal membuat ticket";

        setTimeout(() => {
          this.error = "";
        }, 3000);
      }
    },
  },
};
</script>
