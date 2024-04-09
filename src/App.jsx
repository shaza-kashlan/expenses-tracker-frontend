import { useContext } from "react";
import "./App.scss";

import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import SignUp from "./components/forms/Signup";
import { Login } from "./components/forms/Login";
import { HomePage } from "./pages/HomePage";
import { IsProtected } from "./components/forms/IsProtected";
import ExpenseForm from "./components/forms/ExpenseForm";
import ExampleTranslation from "./components/ExampleTranslation";
import i18n from "../i18n";
import { useEffect } from "react";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
import LandingPage from "./pages/LandingPage";
import Header from "./components/navigation/Header";
import Dashboard from "./pages/Dashboard";
import UserProfileUpdateForm from "./components/forms/UserProfileUpdateForm";
import UpdateExpenseForm from "./components/forms/UpdateExpenseForm";
import Expenses from "./pages/Expenses.jsx";
import AddExpenseSource from "./components/forms/AddExpenseSource";
import UpdateExpenseSource from "./components/forms/UpdateExpenseSource";

import {myData} from "../demo-data"

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
						path="/dashboard"
						element={
							<IsProtected>
								<Dashboard data={myData} />
							</IsProtected>
						}
					/>
					<Route
						path="/home"
						element={
							<IsProtected>
								<HomePage />
							</IsProtected>
						}
					/>
					<Route path="*" element={<h1> 404 Not found</h1>} />

          <Route path="/translation" element={<ExampleTranslation />} />
          <Route
            path="/profile"
            element={
              <IsProtected>
                <HomePage />
              </IsProtected>
            }
          />
          <Route
            path="/sources"
            element={
              <IsProtected>
                <AddExpenseSource />
              </IsProtected>
            }
          />
          <Route
            path="/sources/:sourceId"
            element={
              <IsProtected>
                <UpdateExpenseSource />
              </IsProtected>
            }
          />
          <Route
            path="/expenses"
            element={
              <IsProtected>
                <ExpenseForm />
              </IsProtected>
            }
          />
          <Route
            path="/expenses/:expenseId"
            element={
              <IsProtected>
                <UpdateExpenseForm />
              </IsProtected>
            }
          />
          <Route path="*" element={<h1> 404 Not found</h1>} />

          <Route path="/translation" element={<ExampleTranslation />} />
        </Routes>
      </main>
    </>
  );

}

export default App;
