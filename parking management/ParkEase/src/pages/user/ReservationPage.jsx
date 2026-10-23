import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/common/Card";
import api from "../../util/api";

function getStatusClass(status) {
  switch (status) {
    case "RESERVED":
      return "text-bg-success";
    case "COMPLETED":
      return "text-bg-primary";
    case "CANCELLED":
      return "text-bg-secondary";
    case "EXPIRED":
      return "text-bg-danger";
    default:
      return "text-bg-light";
  }
}

function MyReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReservations() {
      try {
        setLoading(true);
        setError("");

        // Keep your existing endpoint and page parameter names.
        const response = await api.get(
          `/user/reservation?page=${currentPage}&size=6`
        );

        const data = response.data;

        setReservations(data.content ?? []);
        setTotalElements(data.totalElements ?? 0);
        setTotalPages(data.totalPages ?? 0);
      } catch (e) {
        setError(
          e.response?.data?.message ||
            "Failed to fetch reservations."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, [currentPage]);

  const reservedCount = reservations.filter(
    (reservation) => reservation.reservationStatus === "RESERVED"
  ).length;

  const completedCount = reservations.filter(
    (reservation) => reservation.reservationStatus === "COMPLETED"
  ).length;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Reservations</h2>
          <p className="text-secondary mb-0">
            Track your parking reservations.
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={() => navigate("/customer/find-parking")}
        >
          Find Parking
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <Card title="Total Reservations" className="h-100 border-0 shadow-sm">
            <h3 className="fw-bold mb-0">{totalElements}</h3>
          </Card>
        </div>

        <div className="col-12 col-md-4">
          <Card title="Reserved" className="h-100 border-0 shadow-sm">
            <h3 className="fw-bold text-success mb-0">
              {reservedCount}
            </h3>
          </Card>
        </div>

        <div className="col-12 col-md-4">
          <Card title="Completed " className="h-100 border-0 shadow-sm">
            <h3 className="fw-bold mb-0">{completedCount}</h3>
          </Card>
        </div>
      </div>

      {loading ? (
        <p className="text-secondary">Loading reservations...</p>
      ) : (
        <>
          {reservations.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <div className="text-center py-4">
                <i className="bi bi-calendar-x fs-1 text-secondary"></i>
                <h5 className="mt-3">No reservations found</h5>
                <p className="text-secondary mb-0">
                  Find a parking location to make your first reservation.
                </p>
              </div>
            </Card>
          ) : (
            <div className="row g-3">
              {reservations.map((reservation) => (
                <div className="col-12 col-lg-6" key={reservation.id}>
                  <Card className="h-100 border-0 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {reservation.locationName}
                        </h5>
                        <span className="text-secondary small">
                          Slot: {reservation.slotNumber}
                        </span>
                      </div>

                      <span className={`badge ${getStatusClass(reservation.reservationStatus)}`}>
                        {reservation.reservationStatus}
                      </span>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <p className="text-secondary small mb-1">Vehicle</p>
                        <p className="fw-semibold mb-0">
                          {reservation.vehicleNumber}
                        </p>
                        <span className="text-secondary small">
                          {reservation.vehicleType}
                        </span>
                      </div>

                      <div className="col-6">
                        <p className="text-secondary small mb-1">Floor</p>
                        <p className="fw-semibold mb-0">
                          {reservation.floorName}
                        </p>
                      </div>

                      <div className="col-12">
                        <p className="text-secondary small mb-1">Start Time</p>
                        <p className="mb-0">
                          {new Date(reservation.startTime).toLocaleString()}
                        </p>
                      </div>

                      <div className="col-12">
                        <p className="text-secondary small mb-1">End Time</p>
                        <p className="mb-0">
                          {new Date(reservation.endTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-success"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Previous
              </button>

              <span className="text-secondary">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="btn btn-outline-success"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyReservations;