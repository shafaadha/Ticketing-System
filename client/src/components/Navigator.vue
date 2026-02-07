<template>
  <nav class="bg-white shadow px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <h1 class="text-xl font-bold text-blue-600 flex items-center">
        App
      </h1>

      <ul class="hidden md:flex items-center gap-4">
        <li v-for="item in filteredMenu" :key="item.name">
          <router-link
            :to="item.path"
            class="px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center"
            :class="{
              'bg-blue-200 font-semibold text-blue-800': isActive(item.path),
            }"
          >
            {{ item.name }}
          </router-link>
        </li>

        <li>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
            @click="logout"
          >
            Logout
          </button>
        </li>
      </ul>

      <div class="relative md:hidden flex items-center">
        <button
          @click="isOpen = !isOpen"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
        >
          ☰
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border z-50"
        >
          <ul class="py-2">
            <li v-for="item in filteredMenu" :key="item.name">
              <router-link
                :to="item.path"
                class="block px-4 py-2 hover:bg-blue-100 transition"
                :class="{
                  'bg-blue-200 font-semibold text-blue-800': isActive(item.path),
                }"
                @click="isOpen = false"
              >
                {{ item.name }}
              </router-link>
            </li>

            <li>
              <button
                class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                @click="logout"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Navigator",
  setup() {
    const isOpen = ref(false);
    const route = useRoute();
    const router = useRouter();

    const menuItems = [
      { name: "Home", path: "/customer/tickets", roles: ["customer"] },
      { name: "Create Ticket", path: "/customer/ticket/create", roles: ["customer"] },
    ];

    const userRole = localStorage.getItem("role");

    const filteredMenu = computed(() =>
      menuItems.filter((item) => item.roles.includes(userRole))
    );

    const isActive = (path) => route.path.startsWith(path);

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/");
    };

    return {
      isOpen,
      filteredMenu,
      isActive,
      logout,
    };
  },
};
</script>
