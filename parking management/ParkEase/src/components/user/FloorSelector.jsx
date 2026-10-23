
import Card from "../common/Card";

function FloorSelector({
  floors = [],
  floorId,
  setFloorId,
}) {
  console.log("Floors received by FloorSelector:", floors);

  return (
    <Card title="Choose a Parking Floor" className="mb-4">
      {!Array.isArray(floors) || floors.length === 0 ? (
        <p className="text-secondary mb-0">
          No parking floors are available for this location.
        </p>
      ) : (
        <div className="row g-3">
          {floors.map((floor) => {
            const isSelected = floorId === floor.id;

            return (
              <div
                key={floor.id}
                className="col-12 col-sm-6 col-md-4"
              >
                <button
                  type="button"
                  className={`btn w-100 text-start rounded-3 p-3 ${
                    isSelected
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setFloorId(floor.id)}
                  aria-pressed={isSelected}
                >
                  <i className="bi bi-layers fs-4 d-block mb-2" />

                  <span className="fw-semibold d-block">
                    {floor.floorName}
                  </span>

                  <small>
                    Floor Number: {floor.floorNumber}
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

export default FloorSelector;
