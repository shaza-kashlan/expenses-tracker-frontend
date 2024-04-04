import "./App.scss";
import { Route, Routes } from "react-router-dom";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LanguageSelector />} />
      </Routes>
    </>
  );
}

export default App;
