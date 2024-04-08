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
import AddExpenseSourceForm from "./components/forms/AddExpenseSource";
import UpdateExpenseSource from "./components/forms/UpdateExpenseSource";
import LandingPage from "./pages/LandingPage";
import Header from "./components/navigation/Header";
import UpadteExpenseForm from "./components/forms/UpdateExpenseForm";

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
          <Route
            path="/sources"
            element={
              <IsProtected>
                <AddExpenseSourceForm />
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
                <UpadteExpenseForm />
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
