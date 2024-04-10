import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
<<<<<<< HEAD
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
=======
import logo from "../../assets/logo.png";
>>>>>>> main

const Header = ({ loggedin }) => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, setUser } = useContext(AuthContext);
  return (
       <header id="main-header"> 
       {/* <article data-theme={isDarkMode ? "dark" : "light"}> */}
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
              <Sidebar loggedin={user ? true : false}/>
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
          <ul>
            <button
              type="button"
              className="button-small"
              onClick={() => navigate("/login")}
            >
              {t("login")}
            </button>
          </ul>
      </nav>
      {/* </article> */}
    </header>
  );
};

export default Header;
