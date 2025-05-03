import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FilmStockCard from "../components/FilmStockCard";
import { motion, AnimatePresence } from "framer-motion";

interface FilmStock {
    id: number;
    name: string;
    brand: string;
    format: string[];
    iso: number;
    color: boolean;
    contrast: string;
    grain: string;
    description: string;
}

const SkeletonCard = () => (
    <motion.div
        className="h-40 rounded-md bg-gray-200 w-full max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
    />
);

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userAnswers = location.state?.answers || {};
    const [recommendations, setRecommendations] = useState<FilmStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!location.state?.answers) {
            navigate("/", { replace: true });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setRecommendations([]);
            try {
                const response = await axios.post("http://localhost:5000/api/recommendations", {
                    answers: Object.values(userAnswers),
                });

                const filmStockIds = [
                    response.data.film_stock_1,
                    response.data.film_stock_2,
                    response.data.film_stock_3,
                ].filter(Boolean);

                const filmStockDetails = await Promise.all(
                    filmStockIds.map(async (id) => {
                        try {
                            const stockResponse = await axios.get(`http://localhost:5000/api/film-stocks/${id}`);
                            return stockResponse.data;
                        } catch {
                            return null;
                        }
                    })
                );

                setRecommendations(filmStockDetails.filter(Boolean));
            } catch (err) {
                setError("Failed to fetch recommendations. Please try again.");
                console.error(err);
            } finally {
                setTimeout(() => setLoading(false), 400); // small buffer for smoother UX
            }
        };

        if (Object.keys(userAnswers).length > 0) {
            fetchRecommendations();
        }
    }, [userAnswers]);

    return (
        <div className="min-h-screen bg-background text-text px-6 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-12 font-space-grotesk">
            <h2 className="text-3xl font-bold text-center mb-10">Your Recommended Film Stocks</h2>
            <div className="grid gap-10 max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <>
                            <SkeletonCard key="skeleton-1" />
                            <SkeletonCard key="skeleton-2" />
                            <SkeletonCard key="skeleton-3" />
                        </>
                    ) : error ? (
                        <motion.p
                            key="error"
                            className="text-center text-red-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {error}
                        </motion.p>
                    ) : recommendations.length > 0 ? (
                        recommendations.map((film, i) => (
                            <motion.div
                                key={film.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                            >
                                <FilmStockCard film={film} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.p
                            key="no-results"
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            No recommendations found.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResultsPage;
