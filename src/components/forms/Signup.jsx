import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  const nav = useNavigate();

  const handleSignup = (event) => {
    event.preventDefault();
    // Check if passwords match
    if (password !== repeatPassword) {
      // Handle password mismatch error
      alert("Passwords do not match");
      return;
    }

    const userToCreate = { userName, emailAddress, password };

    axios
      .post(`${API_URL}/users/signup`, userToCreate)
      .then((response) => {
        console.log("new user was created", response.data);
        nav("/login");
      })
      .catch((err) => {
        console.log("there was an error signing up", err.response.data.message);
        setError(err.response.data.message);
      });
  };
  return (
    <div>
      <h2>Sign up with us</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={userName}
          placeholder="User Name"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={emailAddress}
          onChange={(e) => {
            setEmailAddress(e.target.value);
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        <input
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />
        <button>Sign Up</button>
      </form>
      {error ? <h4 className="error-message">{error}</h4> : null}
      <button onClick={() => nav("/home")}>Go Back</button>
    </div>
  );
}
