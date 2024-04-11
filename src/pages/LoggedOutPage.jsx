import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LoggedOutPage = () => {
    const navigate = useNavigate();

    const { t } = useTranslation();
  return (
    <article style={{marginTop: "40%"}}>
      <h4>You have successfully logged out</h4>
      <p>Thank you for using our Expense tracker application</p>

      <button type="button" onClick={() => navigate("/login")}>
				{t("Login again")}
			</button>
    </article>
  );
};

export default LoggedOutPage;
