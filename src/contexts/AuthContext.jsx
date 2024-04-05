import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

//This is the wrapper that will wrap our <App/>
const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  const authenticateUser = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      return axios
        .get(`${API_URL}/users/verify`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log("Authentication successful:", response.data);
          setUser(response.data);
          setIsLoading(false);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log(
              "Authentication failed: Unauthorized Access Token check The refresh token"
            );
            handleUnauthorizedErrorForAccessToken(refreshToken); // generate new access token
          } else {
            console.log("Authentication failed for other reasons");
            handleAuthenticationFailure(); // Handle other authentication failures
          }
        });
    } else {
      handleAuthenticationFailure();
    }
  };

  const handleAuthenticationFailure = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoading(false);
    setIsLoggedIn(false);
  };

  const handleUnauthorizedErrorForAccessToken = (refreshToken) => {
    if (refreshToken) {
      return axios
        .post(
          `${API_URL}/users/refresh`,
          {},
          {
            headers: {
              authorization: `Bearer ${refreshToken}`,
            },
          }
        )
        .then((response) => {
          console.log(
            "Successfully generate new access token:",
            response.data.token
          );
          localStorage.setItem("accessToken", response.data.token);
          authenticateUser();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            console.log(
              "Authentication failed: Unauthorized refresh token please log in !"
            );

            handleAuthenticationFailure();
          } else {
            console.log("Authentication refresh token  for other reasons");
            setError(err.response.data.message);
            handleAuthenticationFailure(); // Handle other authentication failures
          }
        });
    } else {
      handleAuthenticationFailure();
    }
  };

  //every time the application mounts, we try to authenticate the user
  useEffect(() => {
    authenticateUser();
  }, []);

  //logout function
  const handleLogout = async () => {
    console.log("handle log ot \n \n");
    localStorage.removeItem("accessToken");
    await authenticateUser();
  };
  return (
    //the value is basically the frig, where all the food is stored
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
//make sure to export both the wrapper and the context
export { AuthContext, AuthWrapper };
