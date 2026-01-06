import { Login } from "@/features/auth";
import UnAuthorized from "@/components/common/UnAuthorized.vue";

export const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: UnAuthorized,
  },
];
