interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">
        Error fetching questions
      </h1>
      <p className="text-gray-400">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
