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
import AGGridDemo from "./pages/AGGridDemo";
import TanTable from "./pages/TanTable.tsx";
import TanFilterTable from "./pages/TanFilterTable.tsx";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
import LandingPage from "./pages/LandingPage";
import Header from "./components/navigation/Header";


function App() {
	//get information from contexts
	const { user, setUser } = useContext(AuthContext);

	useEffect(() => {
		// Change language to English when the app starts
		i18n.changeLanguage("en");
	}, []);

	return (
		<>
			<Routes>
				<Route path="/" element={<SignUp />} />
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
				<Route path="/grid" element={<AGGridDemo />} />
				<Route path="/tantable" element={<TanTable />} />
				<Route path="/tanfiltertable" element={<TanFilterTable />} />

				<Route path="*" element={<h1> 404 Not found</h1>} />
			</Routes>
		</>
	);
}

export default App;
