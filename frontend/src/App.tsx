import { Routes, Route } from "react-router-dom";
import Questionnaire from "./pages/Questionnaire";
import ResultsPage from "./pages/ResultsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Questionnaire />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

export default App;
