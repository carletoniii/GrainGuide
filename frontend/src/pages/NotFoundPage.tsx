const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text font-space-grotesk p-6">
            <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
            <p className="mb-6 text-center max-w-md">
                Oops! We couldn't find the page you're looking for.
                Try heading back to the home page or exploring film recommendations.
            </p>
            <a
                href="/"
                className="px-4 py-2 rounded-xl bg-primary text-white font-medium transition hover:bg-primary/80"
            >
                Go Home
            </a>
        </div>
    );
};

export default NotFoundPage;
