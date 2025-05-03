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
                    GrainGuide is an interactive tool that helps photographers discover the perfect film stock based on their shooting preferences and conditions.
                    Whether you're chasing golden hour portraits or experimental black & white frames, GrainGuide is designed to make choosing film intuitive and personalized.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">How it works</h2>
                <p className="text-lg leading-relaxed">
                    Users answer a dynamic questionnaire tailored to their film format (35mm, 120, large format, or instant), and GrainGuide analyzes these preferences through a hybrid recommendation system.
                    The system combines smart filters with AI-driven logic powered by OpenAI's GPT-4-turbo to suggest relevant film stocks from a PostgreSQL database.
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
