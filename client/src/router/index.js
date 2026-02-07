import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import TicketForm from "../views/customer/TicketForm.vue";
import CustomerLayout from "../layout/CustomerLayout.vue";
import CustomerDashboard from "../views/customer/CustomerDashboard.vue";
import AdminLayout from "../layout/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import TicketChat from "../views/TicketChat.vue";
import AgentDashboard from "../views/agent/AgentDashboard.vue";
import AgentLayout from "../layout/AgentLayout.vue";
import TicketListPage from "../views/agent/TicketListPage.vue";
import UserListPage from "../views/admin/UserListPage.vue";
import TicketsListPage from "../views/admin/TicketsListPage.vue";
import Unauthorized from "../components/Unauthorized.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  { path: "/", name: "login", component: LoginView },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "dashboard", component: AdminDashboard },
      { path: "tickets-list", component: TicketsListPage },
      { path: "users-list", component: UserListPage },
    ],
  },

  {
    path: "/agent",
    component: AgentLayout,
    meta: { requiresAuth: true, role: "agent" },
    children: [
      { path: "dashboard", component: AgentDashboard },
      { path: "tickets", component: TicketListPage },
      { path: "tickets/:id/chat", component: TicketChat },
    ],
  },

  {
    path: "/customer",
    component: CustomerLayout,
    meta: { requiresAuth: true, role: "customer" },
    children: [
      { path: "tickets", component: CustomerDashboard },
      { path: "ticket/create", component: TicketForm },
      { path: "tickets/:id/chat", component: TicketChat },
    ],
  },
];
routes.push(
  { path: "/unauthorized", component: Unauthorized },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth) {
    if (!token) {
      return next("/");
    }

    if (role !== to.meta.role) {
      alert("Access denied: role tidak sesuai");
      return next("/unauthorized");
    }
  }

  next();
});

export default router;
