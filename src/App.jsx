import { useContext } from "react";
import "./App.scss";

import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import SignUp from "./components/forms/Signup";
import { Login } from "./components/forms/Login";
import { HomePage } from "./pages/HomePage";
import { IsProtected } from "./components/forms/IsProtected";
import ExampleTranslation from "./components/ExampleTranslation";
import i18n from "../i18n";
import { useEffect } from "react";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
import LandingPage from "./pages/LandingPage";
import Header from "./components/navigation/Header";
import Expenses from "./pages/Expenses.jsx";


function App() {
	//get information from contexts
	const { user, setUser } = useContext(AuthContext);

	useEffect(() => {
		// Change language to English when the app starts
		i18n.changeLanguage("en");
	}, []);

	return (
		<>
			<Header loggedin={user ? true : false} />

			<main>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/home"
						element={
							<IsProtected>
								<HomePage />
							</IsProtected>
						}
					/>

					<Route path="/" element={<ExampleTranslation />} />

					<Route path="/expenses" element={<IsProtected><Expenses /></IsProtected>} />

					<Route path="*" element={<h1> 404 Not found</h1>} />
				</Routes>
			</main>
		</>
	);
}

export default App;
