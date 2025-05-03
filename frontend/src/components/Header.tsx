import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Grain-Guide-Logo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-background shadow-md fixed top-0 left-0 z-50 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center">
                <img
                    src={logo}
                    alt="GrainGuide logo"
                    className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-20 transition-all duration-300"
                />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 pr-12">
                <Link
                    to="/about"
                    className="text-text hover:text-primary transition-colors text-base md:text-lg lg:text-xl font-medium"
                >
                    About
                </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-text text-xl focus:outline-none"
                >
                    ☰
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-background shadow-lg rounded-md py-2 z-50">
                        <Link
                            to="/about"
                            className="block px-4 py-2 text-sm text-text hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </Link>
                        {/* Add more mobile links here */}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
