import Card from "../common/Card";


function HistoryTable({sessions, page, totalPages, totalElements, size})
{

    function changePage(nextPage) {
        const params = new URLSearchParams(window.location.search);

        params.set("page", nextPage);
        params.set("size", size);

        window.location.search = params.toString();
    }

    function formatDateTime(value) {
        if (!value) return "-";

        return new Date(value).toLocaleString();
    }

    function formatDuration(minutes) {
        if (minutes == null) return "-";

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return hours > 0
            ? `${hours}h ${remainingMinutes}m`
            : `${remainingMinutes}m`;
    }

    return (
        <>
       
         <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Reservation No.</th>
                            <th>Customer</th>
                            <th>Vehicle</th>
                            <th>Location</th>
                            <th>Entry Time</th>
                            <th>Exit Time</th>
                            <th>Duration</th>
                            <th>Total Amount</th>
                            <th>Payment</th>
                        </tr>
                    </thead>

                    <tbody>
                        
                        {sessions.map((session) => (
                                <tr key={session.id}>
                                    <td>
                                        {session.reservationNumber ??
                                            session.reservationId ?? "-"}
                                    </td>

                                    <td>
                                        <div>{session.customerName ?? "-"}</div>
                                        {/* <small className="text-muted">
                                            {session.customerEmail ?? ""}
                                        </small> */}
                                    </td>

                                    <td>
                                        <div>{session.vehicleNumber ?? "-"}</div>
                                        <small className="text-muted">
                                            {session.vehicleType ?? ""}
                                        </small>
                                    </td>

                                    <td>{session.locationName ?? "-"}</td>

                                    <td>{formatDateTime(session.entryTime)}</td>

                                    <td>{formatDateTime(session.exitTime)}</td>

                                    <td>
                                        {formatDuration(session.durationMinutes)}
                                    </td>

                                    <td>
                                        ₹{Number(session.parking_amount ?? 0).toFixed(2)}
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                session.paymentStatus === "SUCCESSFUL"
                                                    ? "bg-success"
                                                    : session.paymentStatus === "FAILED"
                                                    ? "bg-danger"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >
                                            {session.paymentStatus ?? "PENDING"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                    Total completed sessions: {totalElements}
                </small>

                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        disabled={page <= 0}
                        onClick={() => changePage(page - 1)}
                    >
                        Previous
                    </button>

                    <span className="small">
                        Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
                    </span>

                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        disabled={page >= totalPages - 1}
                        onClick={() => changePage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>


        </>
    )
}


export default HistoryTable;

