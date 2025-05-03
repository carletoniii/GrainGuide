import { Link } from "react-router-dom";
import logo from "../assets/Grain-Guide-Logo.png";

const Header = () => {
    return (
        <header className="w-full bg-background shadow-md fixed top-0 left-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
            <Link to="/" className="flex items-center">
                <img
                    src={logo}
                    alt="GrainGuide logo"
                    className="h-14 sm:h-16 md:h-18 lg:h-20 xl:h-20 transition-all duration-300"
                />
            </Link>
        </header>
    );
};

export default Header;
