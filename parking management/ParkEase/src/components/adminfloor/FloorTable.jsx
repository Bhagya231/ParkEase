
import Button from "../common/Button";
import Card from "../common/Card";

function FloorTable({
    floors = [],
    onEdit,
    onStatusChange,
    loading = false
}) {
    if (loading) {
        return (
            <Card>
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-success"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-2 mb-0">
                        Loading floors...
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>S.No.</th>
                            <th>Parking Location</th>
                            <th>Floor Name</th>
                            <th>Floor Number</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {floors.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-4 text-muted"
                                >
                                    No floors found.
                                </td>
                            </tr>
                        ) : (
                            floors.map((floor, index) => (
                                <tr key={floor.id}>
                                    <td>{index + 1}</td>

                                    <td>{floor.locationName}</td>

                                    <td>{floor.floorName}</td>

                                    <td>{floor.floorNumber}</td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                floor.status === "ACTIVE"
                                                    ? "text-bg-success"
                                                    : "text-bg-secondary"
                                            }`}
                                        >
                                            {floor.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline-primary"
                                                onClick={() =>
                                                    onEdit?.(floor)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                type="button"
                                                variant={
                                                    floor.status === "ACTIVE"
                                                        ? "outline-danger"
                                                        : "outline-success"
                                                }
                                                onClick={() =>
                                                    onStatusChange?.(floor)
                                                }
                                            >
                                                {floor.status === "ACTIVE"
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default FloorTable;
