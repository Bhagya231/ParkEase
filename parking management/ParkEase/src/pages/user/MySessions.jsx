
import { useEffect, useState } from "react";
import api from "../../util/api";
import Card from "../../components/common/Card";
import { Car } from "lucide-react";

function MySessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadSessions() {
            setLoading(true);
            setError("");

            try {
                // Replace with the exact endpoint from your backend.
                const response = await api.get("/user/sessions" , {params:{status: "ACTIVE"}});

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || [];

                if (!cancelled) {
                    setSessions(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load active sessions."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadSessions();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-1">My Sessions</h2>
                <p className="text-muted mb-0">
                    View your active parking sessions.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            { sessions.length === 0 ? (
                <Card>
                    <div className="text-center py-5">
                        <i className="bi bi-clock-history fs-1 text-secondary" />
                        <h5 className="mt-3">No active sessions</h5>
                        <p className="text-muted mb-0">
                            Your active parking sessions will appear here.
                        </p>
                    </div>
                </Card>
                    ):
                    (

            <Card title={`Active Sessions (${sessions.length})`}>
                {loading ? (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-success"
                            role="status"
                        />
                        <p className="text-muted mt-2 mb-0">
                            Loading active sessions...
                        </p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-clock-history fs-1 text-secondary" />
                        <h5 className="mt-3">No active sessions</h5>
                        <p className="text-muted mb-0">
                            Your active parking sessions will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {sessions.map((session) => (
                            <div
                                className="col-12 col-lg-6"
                                key={session.id}
                            >
                                <div className="border rounded-3 p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                        <div className="d-flex gap-3 align-items-center">
                                            <div className="rounded-3 bg-success bg-opacity-10 text-success p-3">
                                                <i className="bi bi-car-front fs-3" />
                                            </div>

                                            <div>
                                                <h5 className="fw-bold mb-1">
                                                    {session.vehicleNumber || "Vehicle"}
                                                </h5>
                                                <p className="text-muted mb-0">
                                                    {session.locationName || "Parking location"}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="badge bg-success">
                                            Active
                                        </span>
                                    </div>

                                    <hr />

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <small className="text-muted">
                                                FLOOR
                                            </small>
                                            <p className="fw-semibold mb-0">
                                                {session.floorName || "-"}
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <small className="text-muted">
                                                SLOT
                                            </small>
                                            <p className="fw-semibold mb-0">
                                                {session.slotNumber || "-"}
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <small className="text-muted">
                                                START TIME
                                            </small>
                                            <p className="fw-semibold mb-0">
                                                {session.startTime || "-"}
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <small className="text-muted">
                                                END TIME
                                            </small>
                                            <p className="fw-semibold mb-0">
                                                {session.endTime || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
                    )}
        </div>
    );
}

export default MySessions;
