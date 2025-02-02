import { Routes, Route } from "react-router-dom";
import Questionnaire from "./pages/Questionnaire";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Questionnaire />} />
      <Route path="/results" element={<h1>Results Page (Coming Soon)</h1>} />
    </Routes>
  );
};

export default App;
