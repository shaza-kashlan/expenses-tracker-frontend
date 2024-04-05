// ExampleTranslation.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export default function ExampleTranslation() {
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("hello")}</h1>
      <button>{t("continue")}</button>
      <button onClick={() => handleChangeLanguage("en")}>
        Change to English
      </button>
      <button onClick={() => handleChangeLanguage("de")}>
        Change to Deutsch
      </button>
    </div>
  );
}
