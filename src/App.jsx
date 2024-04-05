import { useContext } from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import SignUp from "./components/forms/Signup";
import { Login } from "./components/forms/Login";
import { HomePage } from "./pages/HomePage";
import { IsProtected } from "./components/forms/IsProtected";

function App() {
  //get information from contexts
  const { user, setUser } = useContext(AuthContext);

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
        <Route path="*" element={<h1> 404 Not found</h1>} />
      </Routes>
    </>
  );
}

export default App;
