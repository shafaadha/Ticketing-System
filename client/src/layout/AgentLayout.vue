<template>
  <div class="min-h-screen flex bg-gray-50">
    <SideBar />

    <main class="flex-1">
      <div class="max-w-6xl mx-auto p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import SideBar from "../components/SideBar.vue";

export default {
  components: { SideBar },
};
</script>
