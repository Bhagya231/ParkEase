
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../util/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";


function ReservationConfirmationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Prevent opening the page without selected parking details.
    if (!state?.locationId || !state?.slotId || !state?.vehicleId) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    Reservation details are missing. Please select a
                    parking slot first.
                </div>

                <Button
                    variant="primary"
                    onClick={() => navigate("/customer/locations")}
                >
                    Find Parking
                </Button>
            </div>
        );
    }

    const {
        locationId,
        locationName,
        locationArea,
        vehicleId,
        vehicleNumber,
        vehicleType,
        floorId,
        floorName,
        slotId,
        slotNumber,
        reservationDate,
        startTime,
        endTime,
        hourlyPrice,
        estimatedPrice,
    } = state;

    const duration = (new Date(`2000-01-01T${endTime}`) -   new Date(`2000-01-01T${startTime}`)) / (1000 * 60 * 60);

    function formatTime(time) 
    {
        if (!time) return "-";

        const [hours, minutes] = time.split(":");

        return new Date(2000, 0, 1, Number(hours), Number(minutes)).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
    }

    function formatDate(date) {
        if (!date) return "-";

        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    async function handleConfirm() {
        setError("");
        setLoading(true);

        try {
            // Confirm the endpoint and request fields against
            // your ReservationController and ReservationRequest.
            const response = await api.post("/user/reservation", {
                vehicleId,
                slotId,
                reservationDate,
                startTime: `${reservationDate}T${startTime}:00`,
                endTime: `${reservationDate}T${endTime}:00`,
            });

            navigate("/customer/reservations", {
                replace: true,
                state: { successMessage: "Reservation confirmed successfully.",  reservation: response.data, },
            });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to confirm the reservation. Please try again." );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Confirm Reservation</h2>
                <p className="text-muted mb-0">
                    Review your details before confirming your parking slot.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <Card title="Reservation Details">
                        <div className="d-flex gap-3 align-items-start mb-4">
                            <div className="rounded-3 bg-success bg-opacity-10 text-success p-3">
                                <i className="bi bi-geo-alt fs-3" />
                            </div>

                            <div>
                                <h5 className="fw-bold mb-1">
                                    {locationName}
                                </h5>
                                <p className="text-muted mb-0">
                                    {locationArea}
                                </p>
                            </div>
                        </div>

                        <hr />

                        <div className="row g-4">
                            <div className="col-sm-6">
                                <small className="text-muted">
                                    FLOOR
                                </small>
                                <p className="fw-semibold mb-0">
                                    {floorName || "Selected floor"}
                                </p>
                            </div>

                            <div className="col-sm-6">
                                <small className="text-muted">
                                    PARKING SLOT
                                </small>
                                <p className="fw-semibold mb-0">
                                    {slotNumber}
                                </p>
                            </div>

                            <div className="col-sm-6">
                                <small className="text-muted">
                                    VEHICLE NUMBER
                                </small>
                                <p className="fw-semibold mb-0">
                                    {vehicleNumber}
                                </p>
                            </div>

                            <div className="col-sm-6">
                                <small className="text-muted">
                                    VEHICLE TYPE
                                </small>
                                <p className="fw-semibold mb-0">
                                    {vehicleType}
                                </p>
                            </div>

                            <div className="col-sm-6">
                                <small className="text-muted">
                                    RESERVATION DATE
                                </small>
                                <p className="fw-semibold mb-0">
                                    {formatDate(reservationDate)}
                                </p>
                            </div>

                            <div className="col-sm-6">
                                <small className="text-muted">
                                    DURATION
                                </small>
                                <p className="fw-semibold mb-0">
                                    {duration > 0 ? `${duration} hours` : "-"}
                                </p>
                            </div>

                            <div className="col-12">
                                <small className="text-muted">
                                    PARKING TIME
                                </small>
                                <p className="fw-semibold mb-0">
                                    {formatTime(startTime)} –{" "}
                                    {formatTime(endTime)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 col-lg-4">
                    <Card title="Price Summary">
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-muted">
                                Hourly price
                            </span>
                            <span>
                                ₹{Number(hourlyPrice).toFixed(2)}
                            </span>
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-muted">
                                Duration
                            </span>
                            <span>{duration} hours</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fw-semibold">
                                Estimated total
                            </span>
                            <h4 className="fw-bold text-success mb-0">
                                ₹{Number(estimatedPrice).toFixed(2)}
                            </h4>
                        </div>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                onClick={handleConfirm}
                                loading={loading}
                                disabled={loading}
                            >
                                Confirm Reservation
                            </Button>

                            <Button
                                variant="outline"
                                disabled={loading}
                                onClick={() => navigate(-1)}
                            >
                                Go Back to Floors & Slots
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ReservationConfirmationPage;
