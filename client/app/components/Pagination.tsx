import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage}
                className={`px-4 py-2 rounded-md transition-colors ${
                    isFirstPage
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
            >
                Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                        page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage}
                className={`px-4 py-2 rounded-md transition-colors ${
                    isLastPage
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
