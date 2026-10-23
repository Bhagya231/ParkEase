
import { Plus } from "lucide-react";
import FloorCard from "../common/FloorCard";
import Button from "../common/Button";

function FloorCardList({
    floors,
    selectedFloorId,
    onSelectFloor,
    onAddFloor,
    onEditFloor,
    onDeactivateFloor,
}) {
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1">Floors</h5>
                    <p className="text-muted mb-0">
                        Select a floor to view its sections.
                    </p>
                </div>

                <Button
                    onClick={onAddFloor}
                    variant="primary"
                >
                    <Plus size={16} className="me-2" />
                    Add Floor
                </Button>
            </div>

            {floors.length === 0 ? (
                <div className="text-center border rounded p-4">
                    <p className="text-muted mb-2">
                        No floors have been added to this location yet.
                    </p>

                    <Button
                        onClick={onAddFloor}
                        variant="primary"
                    >
                        <Plus size={16} className="me-2" />
                        Add First Floor
                    </Button>
                </div>
            ) : (
                <div className="row g-3">
                    {floors.map((floor) => (
                        <div
                            className="col-12 col-md-6 col-xl-4"
                            key={floor.id}
                        >
                            <FloorCard
                                floor={floor}
                                isSelected={
                                    selectedFloorId === floor.id
                                }
                                onSelect={onSelectFloor}
                                onEdit={onEditFloor}
                                onDeactivate={onDeactivateFloor}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FloorCardList;
