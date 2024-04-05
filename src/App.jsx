import "./App.scss";
import { Route, Routes } from "react-router-dom";
import ExampleTranslation from "./components/ExampleTranslation";
import i18n from "../i18n";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Change language to English when the app starts
    i18n.changeLanguage("en");
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<ExampleTranslation />} />
      </Routes>
    </>
  );
}

export default App;
