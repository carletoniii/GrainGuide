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
        console.log("📌 Current Step:", step);
        console.log("📌 Current Question ID:", questions[step]?.id);
        console.log("📌 Selected Answer:", answer);

        if (step >= questions.length) {
            console.error("❌ ERROR: Step out of bounds! Attempted to access:", step);
            return;
        }

        const currentQuestion = questions[step];
        if (!currentQuestion) {
            console.error("❌ ERROR: Undefined question at step", step);
            return;
        }

        const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(updatedAnswers);

        console.log("✅ Answers updated:", updatedAnswers);

        // 📌 Handle Film Format Selection (First Question)
        if (currentQuestion.id === 1) {
            if (answer === "Instant Film") {
                console.log("➡️ Jumping to Instant Film selection (Q11)");
                setStep(10); // Jump to Q11
                return;
            } else if (answer === "Large Format") {
                console.log("➡️ Jumping to Large Format selection (Q12)");
                setStep(11); // Jump to Q12
                return;
            }
        }

        // 📌 Instant Film Users: Go Straight to Results After Q11
        if (currentQuestion.id === 11) {
            console.log("🎬 Navigating to results (Instant Film user)");
            navigate("/results", { state: { answers: updatedAnswers } });
            return;
        }

        // 📌 Large Format Users: Return to Normal Flow After Q12
        if (currentQuestion.id === 12) {
            console.log("🔄 Returning to normal flow after Large Format selection");
            setStep(2); // Resume from second question
            return;
        }

        // 🚨 Prevent Non-Instant Film Users from Seeing Question 11
        if (questions[step + 1]?.id === 11 && updatedAnswers[1] !== "Instant Film") {
            console.log("⏭ Skipping Q11 for non-Instant Film users");

            // ✅ Ensure we don’t go out of bounds
            if (12 < questions.length) {
                setStep(12); // ✅ If Q12 exists, skip to it
            } else {
                console.log("🎬 Navigating to results (End of questions)");
                navigate("/results", { state: { answers: updatedAnswers } });
            }
            return;
        }

        // ✅ Ensure we do not go out of bounds
        if (step + 1 >= questions.length) {
            console.log("🎬 Navigating to results (End of questions)");
            navigate("/results", { state: { answers: updatedAnswers } });
            return;
        }

        console.log("➡️ Moving to next question:", step + 1);
        setStep(step + 1);
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
