
import { useEffect, useState } from "react";
import axios from "axios";
import FilmStockCard from "../components/FilmStockCard";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";

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

const FilmCatalog = () => {
    const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
    const [filters, setFilters] = useState({
        format: [] as string[],
        iso: [] as number[],
        color: [] as string[],
        contrast: [] as string[],
        grain: [] as string[],
    });
    const [sortOption, setSortOption] = useState("name-asc");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchFilmStocks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/film-stocks");
                setFilmStocks(response.data);
            } catch (error) {
                console.error("Failed to fetch film stocks", error);
            }
        };
        fetchFilmStocks();
    }, []);

    const isFormatMatch = (formats: string[], selected: string[]) => {
        if (selected.length === 0) return true;
        return selected.some((sel) => {
            if (sel === "Large Format") return formats.some(f => f.includes("Large Format"));
            if (sel === "Instant Film") return formats.some(f =>
                ["Polaroid", "Instax", "Instant"].some(keyword => f.includes(keyword))
            );
            return formats.includes(sel);
        });
    };

    const isIsoMatch = (filmIso: number, selected: number[]) => {
        if (selected.length === 0) return true;
        return selected.some(groupIso => {
            if (groupIso === 50) return filmIso >= 40 && filmIso <= 200;
            if (groupIso === 400) return filmIso >= 201 && filmIso <= 800;
            if (groupIso === 1600) return filmIso >= 801;
            return false;
        });
    };

    const filteredStocks = filmStocks.filter((film) => {
        const { format, iso, color, contrast, grain } = filters;
        const matchesColor =
            color.length === 0 ||
            (color.includes("Color") && film.color) ||
            (color.includes("Black & White") && !film.color);

        return (
            isFormatMatch(film.format, format) &&
            isIsoMatch(film.iso, iso) &&
            matchesColor &&
            (contrast.length === 0 || contrast.includes(film.contrast.toLowerCase())) &&
            (grain.length === 0 || grain.includes(film.grain.toLowerCase()))
        );
    });

    const sortedStocks = [...filteredStocks].sort((a, b) => {
        if (sortOption === "name-desc") return b.name.localeCompare(a.name);
        if (sortOption === "iso-asc") return a.iso - b.iso;
        if (sortOption === "iso-desc") return b.iso - a.iso;
        return a.name.localeCompare(b.name); // default: name-asc
    });

    const clearAllFilters = () => {
        setFilters({
            format: [],
            iso: [],
            color: [],
            contrast: [],
            grain: [],
        });
    };

    const renderFilters = () => (
        <div className="space-y-6 text-sm text-gray-800">
            <div>
                <h3 className="font-medium mb-2">Format</h3>
                {["35mm", "120", "Large Format", "Instant Film"].map((fmt) => (
                    <label key={fmt} className="block">
                        <input
                            type="checkbox"
                            checked={filters.format.includes(fmt)}
                            onChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    format: prev.format.includes(fmt)
                                        ? prev.format.filter((f) => f !== fmt)
                                        : [...prev.format, fmt],
                                }))
                            }
                            className="mr-2"
                        />
                        {fmt}
                    </label>
                ))}
            </div>
            <div>
                <h3 className="font-medium mb-2">ISO</h3>
                {[
                    { label: "50–200", value: 50 },
                    { label: "400–800", value: 400 },
                    { label: "1600+", value: 1600 },
                ].map(({ label, value }) => (
                    <label key={value} className="block">
                        <input
                            type="checkbox"
                            checked={filters.iso.includes(value)}
                            onChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    iso: prev.iso.includes(value)
                                        ? prev.iso.filter((i) => i !== value)
                                        : [...prev.iso, value],
                                }))
                            }
                            className="mr-2"
                        />
                        {label}
                    </label>
                ))}
            </div>
            <div>
                <h3 className="font-medium mb-2">Type</h3>
                {["Color", "Black & White"].map((type) => (
                    <label key={type} className="block">
                        <input
                            type="checkbox"
                            checked={filters.color.includes(type)}
                            onChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    color: prev.color.includes(type)
                                        ? prev.color.filter((c) => c !== type)
                                        : [...prev.color, type],
                                }))
                            }
                            className="mr-2"
                        />
                        {type}
                    </label>
                ))}
            </div>
            <div>
                <h3 className="font-medium mb-2">Contrast</h3>
                {["low", "medium", "high"].map((level) => (
                    <label key={level} className="block">
                        <input
                            type="checkbox"
                            checked={filters.contrast.includes(level)}
                            onChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    contrast: prev.contrast.includes(level)
                                        ? prev.contrast.filter((c) => c !== level)
                                        : [...prev.contrast, level],
                                }))
                            }
                            className="mr-2"
                        />
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                ))}
            </div>
            <div>
                <h3 className="font-medium mb-2">Grain</h3>
                {["fine", "medium", "heavy"].map((type) => (
                    <label key={type} className="block">
                        <input
                            type="checkbox"
                            checked={filters.grain.includes(type)}
                            onChange={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    grain: prev.grain.includes(type)
                                        ? prev.grain.filter((g) => g !== type)
                                        : [...prev.grain, type],
                                }))
                            }
                            className="mr-2"
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                ))}
            </div>
            <button
                className="text-sm text-primary underline pt-2"
                onClick={clearAllFilters}
            >
                Clear All Filters
            </button>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen pt-28 sm:pt-32 md:pt-36 lg:pt-40 px-4 pb-12 bg-background text-text font-space-grotesk max-w-7xl mx-auto"
        >
            <div className="md:hidden mb-6 flex justify-end">
                <button
                    className="px-4 py-2 text-sm border rounded text-primary border-primary"
                    onClick={() => setMobileFiltersOpen(true)}
                >
                    Filters
                </button>
            </div>

            <Dialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} className="relative z-50 md:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
                <div className="fixed inset-0 flex">
                    <Dialog.Panel className="bg-white w-80 max-w-full h-full p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <XMarkIcon className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                        {renderFilters()}
                    </Dialog.Panel>
                </div>
            </Dialog>

            <div className="flex flex-col md:flex-row gap-6">
                <aside className="hidden md:block md:w-1/4">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                    {renderFilters()}
                </aside>

                <main className="flex-1">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Film Catalog</h1>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border text-sm rounded px-2 py-1"
                            >
                                <option value="name-asc">Name (A–Z)</option>
                                <option value="name-desc">Name (Z–A)</option>
                                <option value="iso-asc">ISO (Low to High)</option>
                                <option value="iso-desc">ISO (High to Low)</option>
                            </select>
                        </div>
                        <motion.div
                            layout
                            transition={{ duration: 0.3 }}
                            className="grid gap-8"
                        >
                            {sortedStocks.map((film) => (
                                <motion.div key={film.id} layout>
                                    <FilmStockCard film={film} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default FilmCatalog;
