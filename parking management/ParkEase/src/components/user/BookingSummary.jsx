
import Card from "../common/Card";

function BookingSummary({
  locationName,
  vehicle,
  floor,
  slot,
  reservationDate,
  startTime,
  endTime,
  hourlyPrice,
  onContinue,
}) {
  const duration =
    startTime && endTime
      ? (
          (new Date(`2000-01-01T${endTime}`) -
            new Date(`2000-01-01T${startTime}`)) /
          (1000 * 60 * 60)
        )
      : 0;

  const estimatedPrice =
    duration > 0 && hourlyPrice != null
      ? duration * Number(hourlyPrice)
      : null;

  const canContinue =
    vehicle &&
    floor &&
    slot &&
    reservationDate &&
    duration > 0 &&
    estimatedPrice !== null;

  return (
    <Card title="Booking Summary" className="mb-4">
      <div className="d-flex align-items-start gap-3 mb-3">
        <i className="bi bi-geo-alt text-success fs-4" />
        <div>
          <small className="text-secondary d-block">Parking Location</small>
          <span className="fw-semibold">
            {locationName || "Not selected"}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-start gap-3 mb-3">
        <i className="bi bi-car-front text-success fs-4" />
        <div>
          <small className="text-secondary d-block">Vehicle</small>
          <span className="fw-semibold">
            {vehicle?.vehicleNumber || "Not selected"}
            {vehicle?.vehicleType && ` (${vehicle.vehicleType})`}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-start gap-3 mb-3">
        <i className="bi bi-p-square text-success fs-4" />
        <div>
          <small className="text-secondary d-block">Parking Slot</small>
          <span className="fw-semibold">
            {floor?.floorName && slot?.slotNumber
              ? `${floor.floorName} - ${slot.slotNumber}`
              : "Not selected"}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-start gap-3 mb-3">
        <i className="bi bi-calendar-event text-success fs-4" />
        <div>
          <small className="text-secondary d-block">Date & Time</small>
          <span className="fw-semibold">
            {reservationDate || "Not selected"}
          </span>
          <span className="d-block text-secondary small">
            {startTime && endTime
              ? `${startTime} – ${endTime}`
              : "Select a time"}
          </span>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Duration</span>
        <span className="fw-semibold">
          {duration > 0 ? `${duration} hour(s)` : "—"}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary">Estimated Price</span>
        <span className="fs-5 fw-bold text-success">
          {estimatedPrice !== null
            ? `₹${estimatedPrice.toFixed(2)}`
            : "—"}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-success w-100"
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue to Reservation
        <i className="bi bi-arrow-right ms-2" />
      </button>

      <small className="text-secondary d-block mt-2">
        Final charges will be confirmed on the reservation page.
      </small>
    </Card>
  );
}

export default BookingSummary;
