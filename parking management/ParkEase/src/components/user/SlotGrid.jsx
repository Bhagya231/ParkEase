
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

const slotStyles = {
  AVAILABLE: {
    label: "Available",
    color: "success",
    icon: "bi-p-square",
  },
  RESERVED: {
    label: "Reserved",
    color: "warning",
    icon: "bi-clock-history",
  },
  OCCUPIED: {
    label: "Occupied",
    color: "danger",
    icon: "bi-car-front-fill",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    color: "secondary",
    icon: "bi-slash-circle",
  },
};

function SlotGrid({
  slots = [],
  selectedSlotId,
  setSelectedSlotId,
  loading = false,
}) {
  const availableCount = slots.filter(
    (slot) =>
      String(slot.slotStatus ?? slot.status ?? "").toUpperCase() ===
      "AVAILABLE"
  ).length;

  return (
    <Card title="Choose a Parking Slot" className="mb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <p className="text-secondary small mb-0">
          Select an available slot for your reservation.
        </p>

        {!loading && (
          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
            {availableCount} available
          </span>
        )}
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        {Object.entries(slotStyles).map(([status, style]) => (
          <div
            key={status}
            className="d-flex align-items-center gap-2"
          >
            <span
              className={`rounded-circle bg-${style.color}`}
              style={{ width: 10, height: 10, display: "inline-block" }}
            />

            <small className="text-secondary">
              {style.label}
            </small>
          </div>
        ))}

        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle bg-success border border-2 border-dark"
            style={{ width: 10, height: 10, display: "inline-block" }}
          />
          <small className="text-secondary">Selected</small>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading slots...</span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Finding slots for your selected time...
          </p>
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          title="No parking slots to display"
          message="Select your vehicle, reservation date, start time and end time to find slots for this floor."
        />
      ) : (
        <div className="row g-3">
          {slots.map((slot) => {
            const slotStatus = String(
              slot.slotStatus ?? slot.status ?? "UNAVAILABLE"
            ).toUpperCase();

            const status =
              slotStyles[slotStatus] || slotStyles.UNAVAILABLE;

            const isAvailable = slotStatus === "AVAILABLE";
            const isSelected = selectedSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className="col-6 col-sm-4 col-md-3 col-lg-4 col-xxl-3"
              >
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedSlotId(slot.id)}
                  aria-pressed={isSelected}
                  className={`btn w-100 rounded-3 p-3 ${
                    isSelected
                      ? "btn-success"
                      : `btn-outline-${status.color}`
                  }`}
                  style={{
                    minHeight: 112,
                    opacity: !isAvailable ? 0.8 : 1,
                    transition: "all 0.15s ease",
                  }}
                  title={`${slot.slotNumber} - ${
                    isSelected ? "Selected" : status.label
                  }`}
                >
                  <i
                    className={`bi ${status.icon} fs-3 d-block mb-2`}
                  />

                  <span className="fw-bold d-block">
                    {slot.slotNumber}
                  </span>

                  <small className="d-block mt-1">
                    {isSelected ? "Selected" : status.label}
                  </small>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default SlotGrid;
