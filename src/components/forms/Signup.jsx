import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../App";

export default function SignUp() {
	const [userName, setUserName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [error, setError] = useState("");

	const nav = useNavigate();

	const { t } = useTranslation();

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
				//console.log("new user was created", response.data);
				nav("/login");
			})
			.catch((err) => {
				console.log("there was an error signing up", err.response.data.message);
				setError(err.response.data.message);
			});
	};
	return (
		<>
			<h2>{t("sign_up_with_us")}</h2>
			<form onSubmit={handleSignup} id="signup-form">
				<input
					type="text"
					value={userName}
					placeholder={t("user_name")}
					onChange={(e) => {
						setUserName(e.target.value);
					}}
					required
				/>
				<input
					type="email"
					placeholder={t("email")}
					value={emailAddress}
					onChange={(e) => {
						setEmailAddress(e.target.value);
					}}
					required
				/>

				<input
					type="password"
					placeholder={t("password")}
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					required
				/>

				<input
					type="password"
					placeholder={t("repeat_password")}
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.target.value)}
					required
				/>
				<footer>
					<button type="submit">Sign Up</button>
					<button type="button" onClick={() => nav("/")}>
						Go back
					</button>
				</footer>
				{error ? <h4 className="error-message">{error}</h4> : null}
			</form>
		</>
	);
}
