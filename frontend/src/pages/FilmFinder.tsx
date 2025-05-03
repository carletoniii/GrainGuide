import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const questions = [
    { id: 1, text: "What film format are you using?", options: ["35mm", "120 (Medium Format)", "Large Format", "Instant Film"] },
    { id: 2, text: "What type of lighting are you shooting in?", options: ["Daylight (Sunny)", "Golden Hour / Sunset", "Low Light / Night", "Indoor / Studio Lighting", "Mixed Lighting / Artificial Lights"] },
    { id: 3, text: "What are you primarily photographing?", options: ["Portraits", "Landscapes", "Street Photography", "Architecture / Urban Scenes", "Experimental / Abstract"] },
    { id: 4, text: "Do you want color or black & white film?", options: ["Color", "Black & White"] },
    { id: 5, text: "Do you prefer a higher or lower ISO?", options: ["Low ISO (50-200)", "Medium ISO (400-800)", "High ISO (1600+)"] },
    { id: 6, text: "How much contrast do you want in your images?", options: ["Low Contrast", "Medium Contrast", "High Contrast"] },
    { id: 7, text: "How much grain do you want?", options: ["Fine Grain", "Medium Grain", "Heavy Grain"] },
    { id: 8, text: "Do you prefer warm or cool tones in your color film?", options: ["Warm", "Cool", "Balanced"] },
    { id: 9, text: "Do you want a vintage or modern look?", options: ["Vintage", "Modern", "Doesn’t matter"] },
    { id: 10, text: "Would you rather have a sharp or dreamy look?", options: ["Sharp", "Dreamy", "Doesn’t matter"] },
    { id: 11, text: "What type of instant film are you using?", options: ["Fujifilm Instax Mini", "Fujifilm Instax Square", "Fujifilm Instax Wide", "Polaroid i-Type", "Polaroid 600", "Polaroid SX-70", "Polaroid 8x10"] },
    { id: 12, text: "What size of large format film are you using?", options: ["4x5", "8x10"] },
];

const FilmFinder = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    const getPath = () => {
        const format = answers[1];
        if (format === "Instant Film") {
            return [1, 11]; // Only Q1 and Q11 for Instant
        }

        if (format === "Large Format") {
            return [1, 12, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Q1, Q12, then standard questions Q2–Q10
        }

        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Standard flow (non-instant, non-large)
    };


    const currentPath = getPath();
    const currentQuestionId = currentPath[step];
    const currentQuestion = questions.find(q => q.id === currentQuestionId)!;
    const isLastStep = step === currentPath.length - 1;

    const handleNext = () => {
        const currentAnswer = answers[currentQuestion.id];
        if (!currentAnswer) return;

        // Handle Instant Film path
        if (currentQuestion.id === 11 && answers[1] === "Instant Film") {
            return navigate("/results", { state: { answers } });
        }

        // Handle end of standard or large format paths
        if (isLastStep) {
            return navigate("/results", { state: { answers } });
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSelect = (option: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: option,
        }));
    };

    return (
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-4 text-center font-sans"
        >
            <div className="text-sm text-gray-500 mb-4">
                Step {step + 1} of {currentPath.length}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-10 max-w-content">
                {currentQuestion.text}
            </h2>

            <div className="flex flex-col gap-4 w-full max-w-md">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        className={`py-3 px-6 rounded-md border transition-all duration-200 ${answers[currentQuestion.id] === option
                            ? "bg-primary text-background border-primary"
                            : "bg-white text-primary border-gray-300 hover:bg-highlight hover:text-background"
                            }`}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="flex gap-4 mt-10">
                {step > 0 && (
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 rounded-md border border-gray-300 text-primary hover:bg-highlight hover:text-background transition"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id]}
                    className={`px-4 py-2 rounded-md ${answers[currentQuestion.id]
                        ? "bg-primary text-background hover:bg-primary-dark"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        } transition`}
                >
                    {isLastStep ? "Submit" : "Next"}
                </button>
            </div>
        </motion.div>
    );
};

export default FilmFinder;
