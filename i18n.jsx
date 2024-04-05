// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./src/assets/locales/en/en.json"; // English translations
import deTranslations from "./src/assets/locales/de/de.json"; // German translations

i18n
  .use(initReactI18next) // Initialize i18next with React
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },
    lng: "en", // Set default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
