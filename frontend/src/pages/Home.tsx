import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-6 font-space-grotesk"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-xl"
            >
                <h1 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to GrainGuide</h1>
                <p className="text-lg text-gray-700 mb-10">
                    Discover the perfect film stock for your shooting style. <br />
                    Answer a few questions and get AI-powered recommendations.
                </p>
                <button
                    className="py-3 px-6 bg-primary text-white font-semibold rounded-md hover:bg-highlight hover:text-background transition-colors duration-200"
                    onClick={() => navigate("/filmfinder")}
                >
                    Get Started
                </button>
            </motion.div>
        </motion.div>
    );
};

export default Homepage;
