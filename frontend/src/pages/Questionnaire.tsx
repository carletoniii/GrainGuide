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

const Questionnaire = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    const handleNext = (answer: string) => {
        const currentQuestion = questions[step];
        const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(updatedAnswers);

        if (currentQuestion.id === 1) {
            if (answer === "Instant Film") return setStep(10);
            if (answer === "Large Format") return setStep(11);
        }

        if (currentQuestion.id === 11) {
            return navigate("/results", { state: { answers: updatedAnswers } });
        }

        if (currentQuestion.id === 12) {
            return setStep(2);
        }

        if (questions[step + 1]?.id === 11 && updatedAnswers[1] !== "Instant Film") {
            if (12 < questions.length) return setStep(12);
            return navigate("/results", { state: { answers: updatedAnswers } });
        }

        if (step + 1 >= questions.length) {
            return navigate("/results", { state: { answers: updatedAnswers } });
        }

        setStep(step + 1);
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
            <h2 className="text-2xl sm:text-3xl font-semibold mb-10 max-w-content">
                {questions[step].text}
            </h2>
            <div className="flex flex-col gap-4 w-full max-w-md">
                {questions[step].options.map((option) => (
                    <button
                        key={option}
                        className="py-3 px-6 rounded-md bg-white text-primary border border-gray-300 shadow-sm hover:bg-highlight hover:text-background transition-colors duration-200"
                        onClick={() => handleNext(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </motion.div>

    );
};

export default Questionnaire;
