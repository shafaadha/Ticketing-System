<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 class="text-5xl font-bold mb-4">403</h1>
    <p class="text-xl mb-4">Access Denied</p>
    <button
      @click="goBack"
      class="text-blue-600 hover:underline"
    >
      Kembali
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>
