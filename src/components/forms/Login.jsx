import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { authenticateUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const nav = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const userToLogin = { emailAddress, password };
    axios
      .post(`${API_URL}/users/login`, userToLogin)
      .then((response) => {
        console.log("you logged in", response.data);

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        return authenticateUser();
      })
      .then(() => nav("/home"))
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          console.log("inside catch", err);
          setError(err.response.data.message);
        } else {
          console.error("An unexpected error occurred:", err);
          setError("An unexpected error occurred. Please try again later.");
        }
      });
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          emailAddress:
          <input
            type="emailAddress"
            value={emailAddress}
            onChange={(e) => {
              setEmailAddress(e.target.value);
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button>Login</button>
      </form>
      {error ? <h4 className="error-message">{error}</h4> : null}
    </div>
  );
};
