import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Aura from "@primeuix/themes/aura";
import "./assets/main.css";
import router from "./router/index";
import { createPinia } from "pinia";
import i18n from "./i18n";
import ToastService from "primevue/toastservice";
import ConfirmService from "primevue/confirmationservice";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Tooltip from "primevue/tooltip";
import Popover from "primevue/popover";
import ConfirmDialog from "primevue/confirmdialog";
import Galleria from "primevue/galleria";
import Accordion from "primevue/accordion";
import GoogleSignInPlugin from "vue3-google-signin";
// @ts-ignore

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  unstyled: false,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".dark",
      cssLayer: true,
    },
  },
});

app.use(i18n);
app.use(ToastService);
app.use(ConfirmService);
app.component("ConfirmDialog", ConfirmDialog);
app.directive("tooltip", Tooltip);
app.component("Galleria", Galleria);
app.component("Popover", Popover);
app.component("Accordion", Accordion);
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_AUTH,
});

app.mount("#app");
