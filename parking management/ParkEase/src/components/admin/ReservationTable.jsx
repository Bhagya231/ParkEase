import { useNavigate } from "react-router-dom";

import Card from "../common/Card";
import Button from "../common/Button";
import { formatDateTime } from "../../util/formateDate";

function ReservationTable({reservations = []})
{

    const navigate = useNavigate();

    function handleView(reservationId)
    {
        navigate(`/admin/reservations/${reservationId}`);
    }

    function getStatusClass(status) {
        switch (status) {
            case "RESERVED":
                return "bg-success-subtle text-success";

            case "CANCELLED":
                return "bg-danger-subtle text-danger";

            case "EXPIRED":
                return "bg-secondary-subtle text-secondary";

            case "COMPLETED":
                return "bg-primary-subtle text-primary";

            default:
                return "bg-light text-dark";
        }
    }

    return (

        <Card title="All Reservations">
            {reservations.length === 0 ? (
                <div className="text-center text-muted py-4">
                    No reservations found.
                </div>
            ) : ( <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Reservation No.</th>
                                <th>Location</th>
                                <th>Floor / Slot</th>
                                <th>Vehicle</th>
                                <th>Start Time</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                         <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="fw-semibold">
                                        {reservation.reservationNumber || "-"}
                                    </td>

                                    <td>
                                        {reservation.locationName || "-"}
                                    </td>

                                    <td>
                                        <div>
                                            {reservation.floorName || "-"}
                                        </div>
                                        <small className="text-muted">
                                            Slot: {reservation.slotNumber || "-"}
                                        </small>
                                    </td>

                                    <td>
                                        <div>
                                            {reservation.vehicleNumber || "-"}
                                        </div>
                                        <small className="text-muted">
                                            {reservation.vehicleType || "-"}
                                        </small>
                                    </td>

                                    <td>
                                        {formatDateTime(reservation.startTime)}
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${getStatusClass(
                                                reservation.reservationStatus
                                            )}`}
                                        >
                                            {reservation.reservationStatus || "-"}
                                        </span>
                                    </td>

                                     <td>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(reservation.id)}>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}




        </Card>
    )


}



export default ReservationTable;

