
import Card from "../common/Card";
import Button from "../common/Button";


function SlotTable({ slots = [],loading = false,onEdit,onStatusChange})
{
     if (loading) {
        return (
            <Card title="Parking Slots">
                <p className="text-center py-4 mb-0">
                    Loading parking slots...
                </p>
            </Card>
        );
    }

    return (
         <Card title={`Parking Slots (${slots.length})`}>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                         <tr>
                            <th>Slot Number</th>
                            <th>Section</th>
                            <th>Vehicle Type</th>
                            <th>Slot Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                         {slots.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-4"
                                >
                                    No parking slots found.
                                </td>
                            </tr>
                        ) : (
                            slots.map((slot) => (
                                <tr key={slot.id}>
                                    <td>{slot.slotNumber}</td>
                                    <td>{slot.sectionName}</td>
                                    <td>{slot.vehicleType}</td>
                                    <td>{slot.slotType}</td>
                                    <td>
                                         <span
                                            className={`badge ${
                                                slot.slotStatus === "AVAILABLE"
                                                    ? "bg-success"
                                                    : slot.slotStatus === "RESERVED"
                                                    ? "bg-warning text-dark"
                                                    : slot.slotStatus === "OCCUPIED"
                                                    ? "bg-primary"
                                                    : "bg-secondary"
                                            }`}
                                        >
                                            {slot.slotStatus}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => onEdit(slot)}
                                            >
                                                Edit
                                            </Button>

                                             {slot.slotStatus === "UNAVAILABLE" && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() => onStatusChange( slot, "AVAILABLE")}

                                                >
                                                    Make Available
                                                </Button>
                                            )}

                                            {slot.slotStatus === "AVAILABLE" && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => onStatusChange(slot,"UNAVAILABLE")}
                                                 
                                                >
                                                    Make Unavailable
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr> ))   
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
   
    
 export default SlotTable;   
    
    
    