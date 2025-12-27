import UnAuthorized from "@/views/UnAuthorized.vue";
import Login from "@views/auth/Login.vue";

export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/unauthorized",
    name: "unauthorized",
    component: UnAuthorized,
  },
];
