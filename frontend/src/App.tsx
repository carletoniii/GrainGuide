// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import FilmFinder from "./pages/FilmFinder";
import ResultsPage from "./pages/ResultsPage";
import About from "./pages/About"; // ✅ Import About
import Header from "./components/Header";

const App = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/filmfinder" element={<FilmFinder />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<About />} /> {/* ✅ Add new route */}
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
