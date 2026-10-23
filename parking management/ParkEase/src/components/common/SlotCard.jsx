import {CarFront, CheckCircle2, Clock3,Ban  } from "lucide-react";
import Card from "./Card";



const statusConfig = {
    AVAILABLE: {
        label: "Available",
        color: "success",
        icon: CheckCircle2,
        background: "#f0fdf4",
        border: "#86efac",
        text: "#166534"
    },
    RESERVED: {
        label: "Reserved",
        color: "warning",
        icon: Clock3,
        background: "#fffbeb",
        border: "#fcd34d",
        text: "#92400e"
    },
    OCCUPIED: {
        label: "Occupied",
        color: "danger",
        icon: CarFront,
        background: "#fef2f2",
        border: "#fca5a5",
        text: "#991b1b"
    },
    UNAVAILABLE: {
        label: "Unavailable",
        color: "secondary",
        icon: Ban,
        background: "#f8fafc",
        border: "#cbd5e1",
        text: "#475569"
    }
};



function SlotCard({ slot, onClick})
{
    const config = statusConfig[slot.slotStatus] ?? statusConfig.UNAVAILABLE;

    const StatusIcon = config.icon;


    return (
        <div onClick={() => onClick?.(slot)} role="button" tabIndex={0} onKeyDown={(event) => {
           if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.(slot);
            }
        }}
        className="h-100" style={{cursor: "pointer"}}
        >
         <Card className="h-100 border-0 shadow-sm">
            <div className="rounded-3 p-3 h-100" style={{
                    backgroundColor: config.background,
                    border: `1px solid ${config.border}`
                }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <small className="text-muted">
                            Slot Number
                        </small>

                        <h5 className="fw-bold mb-0 mt-1">
                            {slot.slotNumber}
                        </h5>
                    </div>

                    <CarFront size={25} color={config.text}/>
                </div>

                <div
                    className="d-flex align-items-center gap-2 fw-semibold small"
                    style={{ color: config.text }}
                >
                    <StatusIcon size={17} />
                    <span>{config.label}</span>
                </div>
            </div>
        </Card>
    </div>

    );
}


export default SlotCard;