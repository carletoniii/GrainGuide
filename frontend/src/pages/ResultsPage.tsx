import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ResultsPage = () => {
    const location = useLocation();
    const userAnswers = location.state?.answers || {};
    const [recommendations, setRecommendations] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/recommendations", {
                    answers: Object.values(userAnswers),
                });

                if (response.data) {
                    const filmStockIds = [
                        response.data.film_stock_1,
                        response.data.film_stock_2,
                        response.data.film_stock_3,
                    ].filter(Boolean); // Remove null values

                    const filmStockDetails = await Promise.all(
                        filmStockIds.map(async (id) => {
                            const stockResponse = await axios.get(`http://localhost:5000/api/film-stocks/${id}`);
                            return stockResponse.data;
                        })
                    );

                    setRecommendations(filmStockDetails);
                }
            } catch (err) {
                setError("Failed to fetch recommendations. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (Object.keys(userAnswers).length > 0) {
            fetchRecommendations();
        }
    }, [userAnswers]);

    if (loading) return <h1>Loading recommendations...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold">Your Recommended Film Stocks</h2>
            <div className="mt-4 flex flex-col gap-4">
                {recommendations.length > 0 ? (
                    recommendations.map((film) => (
                        <div key={film.id} className="p-4 border rounded-lg">
                            <h3 className="text-lg font-bold">{film.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>No recommendations found.</p>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
