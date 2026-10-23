
import { Eye, Layers } from "lucide-react";
import Button from "../common/Button";

function FloorSectionsTable({
    floor,
    sections,
    onViewSlots,
}) {
    if (!floor) {
        return (
            <div className="text-center text-muted border rounded p-4 mt-4">
                Select a floor to view its sections.
            </div>
        );
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">
                        {floor.floorName}
                    </h5>

                    <p className="text-muted mb-0">
                        Sections available on this floor
                    </p>
                </div>

                <span className="badge bg-light text-dark border">
                    <Layers size={14} className="me-1" />
                    {sections.length} Sections
                </span>
            </div>

            {sections.length === 0 ? (
                <div className="text-center border rounded p-4">
                    <p className="text-muted mb-0">
                        No sections found for this floor.
                    </p>
                </div>
            ) : (
                <div className="table-responsive border rounded">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                               <th className="px-3 py-3">Section</th>
                                <th className="py-3">Vehicle Type</th>
                                <th className="py-3">Slot Type</th>
                                <th className="py-3">Total Slots</th>
                                <th className="py-3">Available Slots</th>
                                <th className="text-end px-3 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sections.map((section) => (
                                <tr key={section.sectionName}>
                                    <td className="px-3 fw-semibold">
                                        Section {section.sectionName}
                                    </td>

                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {section.vehicleType}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {section.slotType}
                                        </span>
                                    </td>

                                    <td>
                                        {section.totalSlots}
                                    </td>

                                    <td>
                                        <span className="text-success fw-semibold">
                                            {section.availableSlots}
                                        </span>
                                    </td>

                                    <td className="text-end px-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onViewSlots(
                                                    floor,
                                                    section
                                                )
                                            }
                                        >
                                            <Eye
                                                size={15}
                                                className="me-1"
                                            />
                                            View Slots
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FloorSectionsTable;
