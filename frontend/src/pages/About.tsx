import { motion } from "framer-motion";

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-background text-text px-6 pt-32 sm:pt-40 pb-16 mx-auto w-full max-w-5xl font-space-grotesk"
        >
            <h1 className="text-4xl font-bold mb-8 text-center">About GrainGuide</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">What is GrainGuide?</h2>
                <p className="text-lg leading-relaxed">
                    GrainGuide is a personalized film stock recommendation app designed for photographers who shoot on analog formats like 35mm, 120 (medium format), large format, or instant film. It helps users discover film stocks that match their artistic style, lighting conditions, and creative goals—whether that means high-contrast black & white portraits, dreamy vintage landscapes, or clean modern color street shots.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    Rather than offering generic suggestions, GrainGuide tailors recommendations through a dynamic questionnaire and a backend system that combines rule-based filtering with AI-assisted insight. The result is a smarter, more human-like recommendation process—one that reflects both the photographer’s intent and the personality of each film stock.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">How it works</h2>
                <p className="text-lg leading-relaxed">
                    GrainGuide is a full-stack web application built with React (Vite) on the frontend, Express and TypeScript on the backend, PostgreSQL for data persistence, and OpenAI's GPT-4-turbo for AI-assisted recommendations. Styling is handled with TailwindCSS, and animated transitions use Framer Motion for smooth visual flow.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    Users begin by completing a multi-step questionnaire that adapts to their chosen film format (35mm, 120, large format, or instant). As they progress, their answers are collected into a structured preference object.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    Once submitted, the backend filters a curated PostgreSQL film stock database using those preferences—removing any options that clearly do not match based on ISO range, color vs. black & white, grain level, contrast, and other key metadata. If the resulting set is large or ambiguous, a prompt is generated using film metadata and passed to OpenAI’s GPT-4-turbo via API call, which ranks and selects the top three film stock recommendations.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    To avoid unnecessary OpenAI calls, the system includes a caching layer: each unique answer combination is hashed and stored in a separate recommendations table. If the same set of answers is submitted again, the system retrieves the cached recommendations instead of making a new API call—improving performance and reducing cost.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    This hybrid architecture provides fast, cost-efficient, and highly personalized recommendations by blending deterministic filtering with the creativity of AI. It also showcases the potential of full-stack development combined with modern AI tooling.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">About the Creator</h2>
                <p className="text-lg leading-relaxed">
                    Hi! My name is Carleton Barrett Foster III. I'm a full-stack web developer with a passion for design, digital marketing, and film photography.
                    My background bridges creative and technical fields—from building React apps and managing e-commerce infrastructure to analyzing marketing performance and developing backend systems.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                    I hold a Bachelor's in Computer Science and a Master's in Geology, and I’ve spent the last several years refining my technical skills through real-world projects,
                    managing complex digital systems, and contributing to creative initiatives. GrainGuide is both a technical showcase and a personal passion project—one that reflects my love of film
                    and thoughtfully crafted user experiences.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p className="text-lg leading-relaxed">
                    Have questions about GrainGuide or just want to say hello? Feel free to reach out to me directly at{" "}
                    <a
                        href="mailto:carletonfosteriii@gmail.com"
                        className="text-primary underline hover:text-highlight transition-colors"
                    >
                        carletonfosteriii@gmail.com
                    </a>.
                </p>
            </section>
        </motion.div>
    );
};

export default About;
