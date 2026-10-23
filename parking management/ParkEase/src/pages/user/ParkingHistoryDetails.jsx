import { useState } from "react";
import {
    useLoaderData,
    useNavigate,
    useRevalidator
} from "react-router-dom";

import api from "../../util/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

function ParkingHistoryDetails() {
    const session = useLoaderData();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const paymentStatus = String(
        session.paymentStatus || ""
    ).toUpperCase();

    const isPending = paymentStatus === "PENDING";
    const isPaid = paymentStatus === "SUCCESSFUL";

    const sessionStatus = String(
        session.sessionStatus || session.status || ""
    ).toUpperCase();

    const isCompleted = sessionStatus === "COMPLETED";

    const totalAmount =
        session.totalAmount ??
        session.finalAmount ??
        session.billAmount ??
        session.parkingAmount;

    const locationName =
        session.locationName || "Parking Location";

    const vehicleNumber =
        session.vehicleNumber ||
        session.vehicleRegistrationNumber ||
        "—";

    const slotNumber = session.slotNumber || "—";
    const floorName = session.floorName || "—";

    function formatDateTime(value) {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatAmount(value) {
        if (value == null) return "—";

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(value);
    }

    function getPaymentBadge() {
        if (isPaid) return "bg-success";
        if (isPending) return "bg-warning text-dark";
        if (paymentStatus === "FAILED") return "bg-danger";

        return "bg-secondary";
    }

    async function handlePayment() {
        if (!isCompleted || !isPending || paying) {
            return;
        }

        try {
            setPaying(true);
            setError("");
            setMessage("");

            await api.post(
                `/user/sessions/${session.id}/payment`
            );

            setMessage("Payment processed successfully.");

            // Reload the session using the existing route loader.
            revalidator.revalidate();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to process payment. Please try again."
            );
        } finally {
            setPaying(false);
        }
    }

    return (
        <div className="container-fluid py-4">

            {/* Page heading */}
            <div className="mb-4">
                <button
                    type="button"
                    className="btn btn-link text-success text-decoration-none p-0 mb-3"
                    onClick={() => navigate("/customer/history")}
                >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Parking History
                </button>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h3 className="fw-bold mb-1">
                            Parking Session Details
                        </h3>

                        <p className="text-muted mb-0">
                            View your completed parking session and final bill.
                        </p>
                    </div>

                    <span className="badge bg-success fs-6">
                        {sessionStatus || "COMPLETED"}
                    </span>
                </div>
            </div>

            {/* Feedback messages */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                </div>
            )}

            {message && (
                <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2" />
                    {message}
                </div>
            )}

            <div className="row g-4">

                {/* Session details */}
                <div className="col-lg-12">

                    <Card
                        title={locationName}
                        description={ session.address || "-" }
                        
                        className="mb-4"
                    >
                        <div className="mb-3">
                            <span className="text-muted small">
                                Reservation Num
                            </span>

                            <div className="fw-semibold text-break">
                                {session.reservationNumber}
                            </div>
                        </div>

                        <hr />

                        <h5 className="fw-bold mb-3">
                            Vehicle and Slot Details
                        </h5>

                        <div className="row g-3">

                            <div className="col-md-6">
                                <div className="border rounded-3 p-3 h-100">
                                    <div className="text-muted small mb-2">
                                        <i className="bi bi-car-front me-2" />
                                        Vehicle Number
                                    </div>

                                    <h6 className="fw-bold mb-1">
                                        {vehicleNumber}
                                    </h6>

                                    <span className="text-muted small">
                                        {session.vehicleType || "—"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="border rounded-3 p-3 h-100">
                                    <div className="text-muted small mb-2">
                                        <i className="bi bi-p-square me-2" />
                                        Parking Slot
                                    </div>

                                    <h6 className="fw-bold mb-1">
                                        {slotNumber}
                                    </h6>

                                    <span className="text-muted small">
                                        Floor: {floorName}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <hr className="my-4" />

                        <h5 className="fw-bold mb-3">
                            Session Timeline
                        </h5>

                        <div className="row g-4">

                            <div className="col-md-6">
                                <div className="d-flex gap-3">
                                    <i className="bi bi-box-arrow-in-right text-success fs-4" />

                                    <div>
                                        <div className="text-muted small">
                                            Entry Time
                                        </div>

                                        <div className="fw-semibold">
                                            {formatDateTime(
                                                session.entryTime ||
                                                session.startTime
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex gap-3">
                                    <i className="bi bi-box-arrow-right text-danger fs-4" />

                                    <div>
                                        <div className="text-muted small">
                                            Exit Time
                                        </div>

                                        <div className="fw-semibold">
                                            {formatDateTime(
                                                session.exitTime ||
                                                session.endTime
                                            )}
                                        </div>
                                    </div>
                                  
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex gap-3">
                                    

                                    <div>
                                        <div className="text-muted small">
                                            Parking Charges
                                        </div>

                                        <div className="fw-semibold">{formatAmount(session.normalAmount)}</div>
                                    </div>
                                  
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex gap-3">
                                    

                                    <div>
                                        <div className="text-muted small">
                                            Total Amount
                                        </div>

                                        <div className="fw-semibold">
                                             {formatAmount(session.parking_amount)}
                                        </div>
                                    </div>
                                  
                                </div>
                            </div>

                             {isCompleted && isPending && (
                            <>
                                

                                <Button
                                    variant="primary"
                                    fullWidth
                                    loading={paying}
                                    onClick={handlePayment}
                                >
                                    <i className="bi bi-credit-card me-2" />
                                    Pay Bill
                                </Button>
                            </>
                        )}

                         {isPaid && (
                            <Button
                                variant="secondary"
                                fullWidth
                                disabled
                            >
                                <i className="bi bi-check-circle me-2" />
                                Paid
                            </Button>
                        )}




                             
                        

                        </div>
                     </Card>


                       

                       
                        {/* {!isCompleted && (
                            <div className="alert alert-info small mb-0">
                                Payment is available after the parking session
                                is completed.
                            </div>
                        )}

                        {isCompleted &&
                            !isPending &&
                            !isPaid && (
                                <div className="alert alert-secondary small mb-0">
                                    Payment is currently unavailable.
                                    Please contact the administrator if
                                    you need assistance.
                                </div>
                            )}
                    </Card> */} 

                </div>

               
            </div>
        </div>
    );
}

export default ParkingHistoryDetails;