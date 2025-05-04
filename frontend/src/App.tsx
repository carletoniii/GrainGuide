// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import FilmFinder from "./pages/FilmFinder";
import ResultsPage from "./pages/ResultsPage";
import About from "./pages/About";
import Header from "./components/Header";
import FilmCatalog from "./pages/FilmCatalog";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const location = useLocation();

  return (
    <div className="font-space-grotesk bg-background text-text min-h-screen">
      <Header />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/filmfinder" element={<FilmFinder />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<FilmCatalog />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
