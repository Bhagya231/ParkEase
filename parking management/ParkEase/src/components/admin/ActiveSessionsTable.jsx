
import { Form } from "react-router-dom";

import Button from "../common/Button";
import { formatDateTime } from "../../util/formateDate";

function ActiveSessionsTable({ sessions = [], isSubmitting = false})
{

    if (sessions.length === 0) {
        return (
            <div className="text-center py-5">
                <h6 className="fw-semibold">No active parking sessions</h6>
                <p className="text-muted small mb-0">
                    There are currently no vehicles parked.
                </p>
            </div>
        );
    }

    
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Reservation Number</th>
                        <th>vehicleNumber</th>
                        <th>Entry Time</th>
                        <th>Session Status</th>
                        <th>Action</th>
                    </tr>
                </thead>


                <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td className="text-break">
                                {session.reservationNumber || "-"}
                            </td>

                            <td className="text-break">
                                {session.vehicleNumber || "-"}
                            </td>

                            <td>
                                {formatDateTime(session.entryTime)}
                            </td>

                            <td>
                                <span className="badge bg-success-subtle text-success">
                                    {session.sessionStatus || "-"}
                                </span>
                            </td>

                             <td>
                                <Form method="post">
                                    <input
                                        type="hidden"
                                        name="sessionId"
                                        value={session.id}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                    >
                                        Exit Vehicle
                                    </Button>
                                </Form>
                            </td>

                             </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );












}


export default ActiveSessionsTable;