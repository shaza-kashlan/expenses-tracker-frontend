import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export const Login = () => {
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const { authenticateUser } = useContext(AuthContext);
	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
	const nav = useNavigate();
	const { t } = useTranslation();

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
		<>
			<form onSubmit={handleLogin} id="login-form">
				<input
					type="email"
					value={emailAddress}
					onChange={(e) => {
						setEmailAddress(e.target.value);
					}}
					required
					placeholder={t("email")}
				/>

				<input
					type="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					required
					placeholder={t("password")}
				/>

				<button type="submit">{t("login")}</button>
				{error ? <h4 className="error-message">{error}</h4> : null}
			</form>
			<p>
				Don't have an account yet? <Link to="/signup">Sign up</Link>
			</p>
		</>
	);
};
