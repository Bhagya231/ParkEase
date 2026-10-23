
function FloorSelector({
  floors = [],
  floorId,
  setFloorId,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Choose a Floor</h5>
            <p className="text-secondary small mb-0">
              Select a floor to view its parking slots.
            </p>
          </div>

          <span className="badge rounded-pill bg-light text-success border px-3 py-2">
            {floors.length} {floors.length === 1 ? "Floor" : "Floors"}
          </span>
        </div>

        {floors.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-layers fs-2 text-secondary" />
            <p className="text-secondary mt-2 mb-0">
              No floors are available at this location.
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {floors.map((floor) => {
              const isSelected = floorId === floor.id;

              return (
                <div className="col-6 col-md-4 col-lg-3" key={floor.id}>
                  <button
                    type="button"
                    onClick={() => setFloorId(floor.id)}
                    aria-pressed={isSelected}
                    className={`w-100 h-100 text-start rounded-3 p-3 ${
                      isSelected
                        ? "border border-2 border-success bg-success-subtle"
                        : "border bg-white"
                    }`}
                    style={{ transition: "all 0.2s ease" }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span
                        className={`rounded-3 d-inline-flex align-items-center justify-content-center ${
                          isSelected
                            ? "bg-success text-white"
                            : "bg-light text-success"
                        }`}
                        style={{ width: 42, height: 42 }}
                      >
                        <i className="bi bi-layers fs-5" />
                      </span>

                      {isSelected && (
                        <i className="bi bi-check-circle-fill text-success fs-5" />
                      )}
                    </div>

                    <div className="fw-semibold text-dark">
                      {floor.floorName || `Floor ${floor.floorNumber}`}
                    </div>

                    {floor.floorNumber != null && (
                      <small className="text-secondary">
                        Floor {floor.floorNumber}
                      </small>
                    )}

                    <div
                      className={`small mt-2 ${
                        isSelected
                          ? "text-success fw-semibold"
                          : "text-secondary"
                      }`}
                    >
                      {isSelected ? "Selected" : "View slots"}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FloorSelector;
