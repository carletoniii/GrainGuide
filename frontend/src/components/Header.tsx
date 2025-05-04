import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Grain-Guide-Logo.webp";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <header className="w-full bg-background shadow-md fixed top-0 left-0 z-50 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
            {/* Logo */}
            {location.pathname === "/" ? (
                <a href="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="GrainGuide logo"
                        className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-20 transition-all duration-300"
                    />
                </a>
            ) : (
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="GrainGuide logo"
                        className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-20 transition-all duration-300"
                    />
                </Link>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 pr-16">
                <Link to="/filmfinder" className="text-text hover:text-primary transition-colors text-base md:text-lg lg:text-xl font-medium">Film Finder</Link>
                <Link to="/catalog" className="text-text hover:text-primary transition-colors text-base md:text-lg lg:text-xl font-medium">Film Catalog</Link>
                <Link to="/about" className="text-text hover:text-primary transition-colors text-base md:text-lg lg:text-xl font-medium">About</Link>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-text text-xl focus:outline-none"
                >
                    ☰
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-40 bg-background shadow-lg rounded-md py-2 z-50"
                        >
                            <Link
                                to="/filmfinder"
                                className="block px-4 py-2 text-sm text-text hover:bg-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                Film Finder
                            </Link>
                            <Link
                                to="/catalog"
                                className="block px-4 py-2 text-sm text-text hover:bg-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                Film Catalog
                            </Link>
                            <Link
                                to="/about"
                                className="block px-4 py-2 text-sm text-text hover:bg-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                About
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
