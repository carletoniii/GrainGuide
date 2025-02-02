import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const questions = [
    { id: 1, text: "What type of lighting are you shooting in?", options: ["Daylight (Sunny)", "Golden Hour / Sunset", "Low Light / Night", "Indoor / Studio Lighting", "Mixed Lighting / Artificial Lights"] },
    { id: 2, text: "What are you primarily photographing?", options: ["Portraits", "Landscapes", "Street Photography", "Architecture / Urban Scenes", "Experimental / Abstract"] },
    { id: 3, text: "What film format are you using?", options: ["35mm", "120 (Medium Format)", "Large Format", "Instant Film"] },
    { id: 4, text: "Do you want color or black & white film?", options: ["Color", "Black & White"] },
    { id: 5, text: "Do you prefer a higher or lower ISO?", options: ["Low ISO (50-200) – Less grain, better for bright conditions", "Medium ISO (400-800) – Versatile, balanced grain", "High ISO (1600+) – Best for low light, noticeable grain"] },
    { id: 6, text: "How much contrast do you want in your images?", options: ["Low Contrast (Soft, muted tones)", "Medium Contrast (Balanced look)", "High Contrast (Deep blacks, punchy highlights)"] },
    { id: 7, text: "How much grain do you want?", options: ["Fine Grain (Smooth, clean look)", "Medium Grain (Classic film look)", "Heavy Grain (Gritty, textured aesthetic)"] },
    { id: 8, text: "Do you prefer warm or cool tones in your color film?", options: ["Warm (Golden, rich skin tones)", "Cool (Bluish, neutral tones)", "Balanced (Natural, true-to-life colors)"] },
    { id: 9, text: "Do you want a vintage or modern look?", options: ["Vintage (Muted tones, lower saturation)", "Modern (Crisp, vibrant colors)", "Doesn’t matter"] },
    { id: 10, text: "Would you rather have a sharp or dreamy look?", options: ["Sharp (Crisp details, high resolution)", "Dreamy (Soft focus, glowing highlights)", "Doesn’t matter"] },
    { id: 11, text: "What type of instant film are you using?", options: ["Fujifilm Instax Mini", "Fujifilm Instax Square", "Fujifilm Instax Wide", "Polaroid i-Type", "Polaroid 600", "Polaroid SX-70", "Polaroid 8x10"] },
    { id: 12, text: "What size of large format film are you using?", options: ["4x5", "8x10"] },
];

const Questionnaire = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const navigate = useNavigate();

    const handleNext = (answer: string) => {
        setAnswers((prev) => ({ ...prev, [questions[step].id]: answer }));

        // Check if the user needs to be shown a follow-up question
        if (step === 2) { // After film format selection
            if (answer === "Instant Film") {
                setStep(11); // Skip to instant film question
                return;
            } else if (answer === "Large Format") {
                setStep(12); // Skip to large format question
                return;
            }
        }

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            navigate("/results", { state: { answers } });
        }
    };

    return (
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-screen"
        >
            <h2 className="text-xl font-semibold">{questions[step].text}</h2>
            <div className="mt-4 flex flex-col gap-4">
                {questions[step].options.map((option) => (
                    <button
                        key={option}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
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
