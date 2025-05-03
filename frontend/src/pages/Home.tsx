import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import filmImage from "../assets/film-rolls.png";

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-6 font-space-grotesk"
        >
            <div className="text-center max-w-xl">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to GrainGuide</h1>

                <motion.img
                    src={filmImage}
                    alt="Four film canisters on a neutral background"
                    className="mx-auto mb-8 w-48 sm:w-64 md:w-72 lg:w-80 xl:w-96 drop-shadow-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <p className="text-lg text-gray-700 mb-10">
                    Discover the perfect film stock for your shooting style. <br />
                    GrainGuide uses AI-driven logic and smart filtering to recommend film stocks based on your preferences and conditions.
                </p>

                <button
                    className="py-3 px-6 bg-primary text-white font-semibold rounded-md hover:bg-highlight hover:text-background transition-colors duration-200"
                    onClick={() => navigate("/filmfinder")}
                >
                    Get Started
                </button>
            </div>
        </motion.div>
    );
};

export default Homepage;
