import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";

const Header = ({ loggedin }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header id="main-header">
      <nav>
        <ul>
          <Link to="/">
            <li>🤑</li>
          </Link>
        </ul>
        {loggedin ? (
          <ul>
            <li>
              <Sidebar />
            </li>
          </ul>
        ) : (
          <ul>
            <button
              type="button"
              className="button-small"
              onClick={() => navigate("/login")}
            >
              {t("login")}
            </button>
          </ul>
        )}
      </nav>
    </header>
  );
};
export default Header;
