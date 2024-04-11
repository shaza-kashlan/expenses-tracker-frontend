import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("Welcome ")} {user.userName}</h1>

      <button onClick={handleLogout}>{t("logout")}</button>
    </div>
  );
};
