import { createI18n } from "vue-i18n";
import en from "./locales/en";
import mm from "./locales/mm";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    mm,
  },
});

export default i18n;
