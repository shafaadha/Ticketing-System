<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
      @click="isOpen = false"
    ></div>

    <aside
      :class="[
        'fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:block',
      ]"
    >
      <div class="px-6 py-5 flex items-center justify-between">
        <h1 class="text-xl font-bold text-blue-600">App</h1>

        <button
          class="md:hidden text-gray-600 hover:text-blue-600"
          @click="isOpen = false"
        >
          ✕
        </button>
      </div>

      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="item in filteredMenu" :key="item.name">
            <router-link
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium"
              :class="
                isActive(item.path)
                  ? 'bg-blue-200 text-blue-800 shadow-sm'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              "
              @click="isOpen = false"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="absolute bottom-0 left-0 w-full p-4">
        <button
          @click="logout"
          class="w-full px-4 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition"
        >
          Logout
        </button>
      </div>
    </aside>

    <button
      class="fixed top-6 right-6 md:hidden px-5 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition z-50"
      @click="isOpen = true"
    >
      ☰
    </button>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Sidebar",
  setup() {
    const isOpen = ref(false);
    const route = useRoute();
    const router = useRouter();

    const menuItems = [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        roles: ["admin"],
        icon: "📊",
      },
      {
        name: "Tickets",
        path: "/admin/tickets-list",
        roles: ["admin"],
        icon: "💰",
      },
      {
        name: "Users",
        path: "/admin/users-list",
        roles: ["admin"],
        icon: "👥",
      },

      {
        name: "Dashboard",
        path: "/agent/dashboard",
        roles: ["agent"],
        icon: "📊",
      },
      {
        name: "Tickets",
        path: "/agent/tickets",
        roles: ["agent"],
        icon: "🎫",
      },
    ];

    const userRole = localStorage.getItem("role");

    const filteredMenu = computed(() =>
      menuItems.filter((item) => item.roles.includes(userRole)),
    );

    const isActive = (path) => route.path.startsWith(path);

    const logout = () => {
      localStorage.clear();
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
