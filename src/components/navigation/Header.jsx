import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import logo from "../../assets/logo.png";

const Header = ({ loggedin }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Function to change the language
  };

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
              <Sidebar />
            </li>
            <li>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="en">En</option>
                <option value="de">DE</option>
              </select>
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
            <li>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="en">En</option>
                <option value="de">DE</option>
              </select>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
