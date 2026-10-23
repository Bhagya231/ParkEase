
import Button from "../common/Button";

function FloorPagination({
    currentPage = 0,
    totalPages = 0,
    onPageChange
}) {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        return Array.from(
            { length: totalPages },
            (_, index) => index
        );
    };

    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
            <p className="text-muted mb-0">
                Page {currentPage + 1} of {totalPages}
            </p>

            <div className="d-flex align-items-center flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline-secondary"
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </Button>

                {getPageNumbers().map((page) => (
                    <Button
                        key={page}
                        type="button"
                        variant={
                            page === currentPage
                                ? "success"
                                : "outline-secondary"
                        }
                        onClick={() => onPageChange(page)}
                    >
                        {page + 1}
                    </Button>
                ))}

                <Button
                    type="button"
                    variant="outline-secondary"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default FloorPagination;
