type FilmStock = {
    id: number;
    name: string;
    brand: string;
    format: string[];
    iso: number;
    color: boolean;
    contrast: string;
    grain: string;
    description: string;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const FilmStockCard = ({ film }: { film: FilmStock }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-primary mb-2">{film.name}</h3>
            <p className="text-gray-700 text-sm mb-4">{film.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div>
                    <dt className="font-medium text-text">Brand</dt>
                    <dd>{film.brand}</dd>
                </div>
                <div>
                    <dt className="font-medium text-text">Available Formats</dt>
                    <dd>{film.format.join(", ")}</dd>
                </div>
                <div>
                    <dt className="font-medium text-text">ISO</dt>
                    <dd>{film.iso}</dd>
                </div>
                <div>
                    <dt className="font-medium text-text">Type</dt>
                    <dd>{film.color ? "Color" : "Black & White"}</dd>
                </div>
                <div>
                    <dt className="font-medium text-text">Contrast</dt>
                    <dd>{capitalize(film.contrast)}</dd>
                </div>
                <div>
                    <dt className="font-medium text-text">Grain</dt>
                    <dd>{capitalize(film.grain)}</dd>
                </div>
            </div>
        </div>
    );
};

export default FilmStockCard;
