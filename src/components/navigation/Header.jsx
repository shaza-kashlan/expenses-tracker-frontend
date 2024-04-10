import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Header = ({ loggedin }) => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, setUser } = useContext(AuthContext);
  return (
       <header id="main-header"> 
        <nav>
          <ul>
            {/* Render the correct link based on login status */}
            {loggedin ? (
              <Link to="/dashboard">
                <li>🤑</li>
              </Link>
            ) : (
              <Link to="/">
                <li>🤑</li>
              </Link>
            )}
          </ul>
          {loggedin ? (
            <ul>
              <li>
                <Sidebar loggedin={true}/>
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
