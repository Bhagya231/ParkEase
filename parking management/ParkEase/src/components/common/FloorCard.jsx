import { useState } from "react";
import { MoreVertical, Pencil, Power } from "lucide-react";
import Card from "./Card";

function FloorCard({ floor, isSelected, onSelect,onDeactivate,onAddSlots})
{
    const [showMenu, setShowMenu] = useState(false);

     const handleAction = (event, action) => {
        event.stopPropagation();
        setShowMenu(false);
        action?.(floor);
    };

    return (

         <Card
            className={`h-100 border ${isSelected ? "border-success border-2 shadow-sm" : "border-light shadow-sm"}`}>
            <div className="p-3" role="button" tabIndex={0}  onClick={() => onSelect(floor)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(floor);
                    }
                }}>

                 <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="mb-1">
                            {floor.floorName}
                        </h5>

                        <small className="text-muted">
                            Floor {floor.floorNumber}
                        </small>
                    </div>

                    <div  className="position-relative"  onClick={(event) => event.stopPropagation()}>
                        <button type="button"
                           
                            className="btn btn-light btn-sm border-0"
                            aria-label="Floor actions"
                            aria-expanded={showMenu}
                            onClick={() => setShowMenu((previous) => !previous)
                            }
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div
                                className="position-absolute end-0 bg-white border rounded shadow-sm p-1"
                                style={{
                                    top: "100%",
                                    width: "175px",
                                    zIndex: 10,
                                }}
                            >

                                 <button type="button"  className="btn btn-outline-success btn-sm w-100"
                                    onClick={() => onAddSlots?.(floor)} >
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Add Slots
                                </button>
                                

                                <button
                                    type="button"
                                    className="btn btn-light btn-sm w-100 text-start d-flex align-items-center gap-2 text-danger"
                                    onClick={(event) =>
                                        handleAction(event, onDeactivate)
                                    }
                                >
                                    <Power size={16} />
                                    {floor.status === "ACTIVE" ? "Deactivate Floor" : "Activate Floor"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="row g-2 mt-2">
                    <div className="col-6">
                        <div className="bg-light rounded p-2">
                            <small className="text-muted d-block">
                                Total Slots
                            </small>
                            <h4 className="mb-0">
                                {floor.totalSlots ?? 0}
                            </h4>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="bg-light rounded p-2">
                            <small className="text-muted d-block">
                                Available Slots
                            </small>
                            <h4 className="mb-0 text-success">
                                {floor.availableSlots ?? 0}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <span
                        className={`badge ${
                            floor.status === "ACTIVE"
                                ? "bg-success"
                                : "bg-secondary"
                        }`}
                    >
                        {floor.status}
                    </span>

                    {isSelected && (
                        <span className="ms-2 small text-success fw-semibold">
                            Selected
                        </span>
                    )}
                </div>
            </div>
        </Card>




    );
}


export default FloorCard;