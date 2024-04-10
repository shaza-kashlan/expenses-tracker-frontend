import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";
import LanguageIcon from '@mui/icons-material/Language';
import ToggleLanguage from "../ToggleLanguage";

const Header = ({ loggedin }) => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Function to change the language
  };

  const { user, setUser } = useContext(AuthContext);

  return (
    <header id="main-header">
      <nav>
        <ul>
          {loggedin ? (
            <Link to="/dashboard">
              <li>
                <img src={logo} />
              </li>
            </Link>
          ) : (
            <Link to="/">
              <img src={logo} />
            </Link>
          )}
        </ul>
        {loggedin ? (
          <ul>
            <li>
              <Sidebar loggedin={user ? true : false} />
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <ToggleLanguage />
            </li>
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
      {/* </article> */}
    </header>
  );
};

export default Header;
