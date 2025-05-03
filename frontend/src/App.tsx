// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import FilmFinder from "./pages/FilmFinder";
import ResultsPage from "./pages/ResultsPage";
import Header from "./components/Header"; // 👈 Add this

const App = () => {
  const location = useLocation();

  return (
    <>
      <Header /> {/* 👈 Displayed on every route */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/filmfinder" element={<FilmFinder />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
