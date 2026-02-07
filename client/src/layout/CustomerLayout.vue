<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navigator />

    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navigator from "../components/Navigator.vue";

export default {
  components: { Navigator },
};
</script>
