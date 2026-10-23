import { X, CarFront, CheckCircle2, Clock3, Ban, Pencil } from "lucide-react";
import Button from "./Button";

const statusConfig = {
    AVAILABLE: { label: "Available", className: "bg-success-subtle text-success" },
    RESERVED: { label: "Reserved", className: "bg-warning-subtle text-warning-emphasis" },
    OCCUPIED: { label: "Occupied", className: "bg-danger-subtle text-danger" },
    UNAVAILABLE: { label: "Unavailable", className: "bg-secondary-subtle text-secondary" },

}


function SlotDetailsModal({show,slot,onClose, onEdit, onDeactivate})
{
    if (!show || !slot) {
        return null;
    }

     const status = statusConfig[slot.slotStatus] ?? statusConfig.UNAVAILABLE;

    const details = [
        { label: "Slot Number", value: slot.slotNumber },
        { label: "Section", value: slot.sectionName },
        { label: "Vehicle Type", value: slot.vehicleType },
        { label: "Slot Type", value: slot.slotType },
    ];


    return (
        <div className="modal d-block"  tabIndex="-2"  role="dialog" aria-modal="true"  
        style={{   zIndex: 999 }}>

             <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4">
                    <div className="modal-header">
                        <div>
                            <h5 className="modal-title fw-bold">
                                Slot Details
                            </h5>
                            <small className="text-muted">
                                View and manage this parking slot
                            </small>
                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                     <div className="modal-body p-4">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="rounded-3 bg-success-subtle text-success p-3">
                                <CarFront size={32} />
                            </div>

                            <div>
                                <h4 className="fw-bold mb-1">
                                    {slot.slotNumber ?? "—"}
                                </h4>
                                <span className={`badge ${status.className}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>


                         <div className="row g-3">
                            {details.map((detail) => (
                                <div className="col-6" key={detail.label}>
                                    <div className="border rounded-3 p-3 h-100">
                                        <small className="text-muted d-block mb-1">
                                            {detail.label}
                                        </small>
                                        <div className="fw-semibold text-break">
                                            {detail.value ?? "—"}
                                        </div>
                                    </div>
                                </div>
                            ))}

                             <div className="col-12">
                                <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center">
                                    <span className="text-muted">
                                        Current Status
                                    </span>
                                    <span className={`badge ${status.className}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            Close
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => onEdit?.(slot)}
                        >
                            <Pencil size={15} className="me-1" />
                            Edit
                        </Button>

                        {slot.slotStatus !== "UNAVAILABLE" && (
                            <Button
                                variant="danger"
                                onClick={() => onDeactivate?.(slot)}
                            >
                                <Ban size={15} className="me-1" />
                                Deactivate
                            </Button>
                        )}
                    </div>
                </div>
            </div>



           





        </div>
    );
}


export default SlotDetailsModal;
