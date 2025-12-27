import PrivacyPolicy from "@/views/auth/PrivacyPolicy.vue";
import UnAuthorized from "@/views/UnAuthorized.vue";
import Login from "@views/auth/Login.vue";
import newLogin from "@/views/auth/newLogin.vue";

export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/login-with-user",
    name: "login-with-user",
    component: newLogin,
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: UnAuthorized,
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicy,
  },
];
