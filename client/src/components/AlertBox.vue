<template>
  <div
    v-if="visible"
    :class="[
      'flex items-start justify-between gap-3 p-4 rounded-lg border shadow-sm',
      alertStyle.bg,
      alertStyle.border,
      alertStyle.text,
    ]"
  >
    <div class="flex gap-3">
      <div class="text-xl">
        <span v-if="type === 'success'"></span>
        <span v-else-if="type === 'error'"></span>
        <span v-else-if="type === 'warning'"></span>
        <span v-else>ℹ️</span>
      </div>

      <div>
        <h3 v-if="title" class="font-semibold text-base">
          {{ title }}
        </h3>
        <p class="text-sm">
          {{ message }}
        </p>
      </div>
    </div>

    <button
      v-if="closable"
      @click="closeAlert"
      class="text-lg font-bold opacity-70 hover:opacity-100 transition"
    >
      ✖
    </button>
  </div>
</template>

<script>
export default {
  name: "AlertBox",
  props: {
    type: {
      type: String,
      default: "info",
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    alertStyle() {
      const styles = {
        success: {
          bg: "bg-green-50",
          border: "border-green-300",
          text: "text-green-800",
        },
        error: {
          bg: "bg-red-50",
          border: "border-red-300",
          text: "text-red-800",
        },
        warning: {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          text: "text-yellow-800",
        },
        info: {
          bg: "bg-blue-50",
          border: "border-blue-300",
          text: "text-blue-800",
        },
      };

      return styles[this.type] || styles.info;
    },
  },
  methods: {
    closeAlert() {
      this.visible = false;
      this.$emit("close");
    },
  },
};
</script>
