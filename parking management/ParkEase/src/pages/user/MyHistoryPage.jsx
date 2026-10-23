import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../util/api";
import {formatDateTime } from "../../util/formateDate"

function MyParkingHistory() {
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/user/sessions");
            const result = response.data?.data ?? response.data;

            setSessions(
                Array.isArray(result)
                    ? result
                    : result?.content ?? []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load parking history."
            );
        } finally {
            setLoading(false);
        }
    }

   
    function formatAmount(value) {
        if (value == null) return "—";

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(value);
    }

    return (
        <div className="container-fluid py-4 px-3 px-md-4">

            {/* Page Header */}
            <div className="d-flex flex-wrap justify-content-between
                            align-items-center gap-3 mb-4">

                <div>
                    <h2 className="fw-bold text-success mb-1">
                        Parking History
                    </h2>

                    <p className="text-secondary mb-0">
                        View your completed parking sessions and bills.
                    </p>
                </div>

                {!loading && !error && (
                    <div className="bg-success-subtle rounded-3 px-4 py-3 text-center">
                        <h4 className="fw-bold text-success mb-0">
                            {sessions.length}
                        </h4>
                        <small className="text-secondary">
                            Completed Sessions
                        </small>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-success"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="text-secondary mt-3">
                        Loading parking history...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="alert alert-danger d-flex
                                justify-content-between align-items-center gap-3">
                    <span>{error}</span>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={loadHistory}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && sessions.length === 0 && (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-clock-history fs-1 text-success" />

                        <h5 className="fw-bold mt-3">
                            No Parking History
                        </h5>

                        <p className="text-secondary mb-0">
                            Your completed parking sessions will appear here.
                        </p>
                    </div>
                </div>
            )}

            {/* Session Cards */}
            {!loading && !error && sessions.length > 0 && (
                <div className="row g-4">
                    {sessions.map((session) => {
                        const paymentStatus = String(
                            session.paymentStatus ?? ""
                        ).toUpperCase();

                        const isPaid = paymentStatus === "SUCCESSFUL";
                        const isPending = paymentStatus === "PENDING";

                        const finalAmount =
                            session.totalAmount ??
                            session.finalAmount ??
                            session.billAmount;

                        return (
                            <div className="col-12" key={session.id}>
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-3 p-md-4">

                                        {/* Location and Completion Status */}
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="bg-success-subtle text-success
                                                            rounded-3 p-3 flex-shrink-0">
                                                <i className="bi bi-geo-alt-fill fs-5" />
                                            </div>

                                            <div className="flex-grow-1 min-w-0">
                                                <h5 className="fw-bold text-success mb-1 text-break">
                                                    {session.locationName ||
                                                        "Parking Location"}
                                                </h5>

                                                <p className="text-secondary small mb-1 text-break">
                                                    
                                                    {session.locationName || "Address unavailable"}
                                                </p>

                                                

                                                
                                            </div>

                                           

                                            <span className="badge bg-success-subtle
                                                             text-success rounded-pill p-2 flex-shrink-0">
                                                Completed
                                            </span>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Session Information */}
                                        <div className="row g-3">
                                            <div className="col-6 col-lg-3">
                                               
                                                <div className="text-secondary small mb-1">
                                                    Vehicle Number
                                                </div>

                                                <div className="fw-semibold text-break">
                                                    {session.vehicleNumber ||"—"}
                                                </div>

                                                <small className="text-secondary">
                                                    {session.vehicleType || "—"}
                                                </small>
                                            </div>

                                            <div className="col-6 col-lg-3">
                                                <div className="text-secondary small mb-1">
                                                    Parking Slot
                                                </div>

                                                <div className="fw-semibold text-break">
                                                    {session.slotNumber
                                                        ? `Slot ${session.slotNumber}`
                                                        : "—"}
                                                </div>

                                                <small className="text-secondary">
                                                    {session.floorName || " -"}
                                                </small>
                                            </div>

                                            <div className="col-6 col-lg-3">
                                                <div className="text-secondary small mb-1">
                                                    Entry Time
                                                </div>

                                                <div className="fw-semibold small">
                                                    {formatDateTime(
                                                        session.entryTime ||
                                                        session.startTime
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-6 col-lg-3">
                                                <div className="text-secondary small mb-1">
                                                    Exit Time
                                                </div>

                                                <div className="fw-semibold small">
                                                    {formatDateTime(
                                                        session.exitTime ||
                                                        session.endTime
                                                    )}
                                                </div>

                                                 
                                            </div>


                                            <div className="col-6 col-lg-3">
                                                <div className="text-secondary small mb-1">
                                                    Reservation Num
                                                </div>

                                                <div className="fw-semibold small">
                                                    {session.reservationNumber} 
                                                </div>

                                                 
                                            </div>

                                            
                                        </div>

                                        <hr className="my-4" />

                                        {/* Bill and Actions */}
                                        <div className="d-flex flex-wrap
                                                        justify-content-between
                                                        align-items-center gap-3">

                                            <div>
                                                <div className="text-secondary small mb-1">
                                                    Final Bill
                                                </div>

                                                <h4 className="fw-bold text-success mb-0">
                                                    {formatAmount(session.parking_amount)}
                                                </h4>
                                            </div>

                                            <div className="d-flex flex-wrap
                                                            align-items-center gap-3">

                                                <div>
                                                    <div className="text-secondary small mb-1">
                                                        Payment Status
                                                    </div>

                                                    {isPaid ? (
                                                        <span className="text-success fw-semibold">
                                                            <i className="bi bi-check-circle-fill me-1" />
                                                            Paid
                                                        </span>
                                                    ) : isPending ? (
                                                        <span className="text-warning-emphasis fw-semibold">
                                                            <i className="bi bi-clock-fill me-1" />
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className="text-secondary">
                                                            {paymentStatus || "Unknown"}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-success px-4"
                                                    onClick={() =>
                                                        navigate(
                                                            `/customer/history/${session.id}`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-eye me-2" />
                                                    View
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyParkingHistory;