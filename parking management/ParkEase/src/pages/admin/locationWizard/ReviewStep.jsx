
import Card from "../../../common/Card";
import Button from "../../../common/Button";

function ReviewStep({
    location,
    prices = [],
    floors = [],
    slots = [],
    onBack,
    onActivate,
    activating = false,
    canActivate = false
}) {
    return (
        <Card
            title="Review Parking Location"
            description="Review the saved configuration before activation."
            className="border-0"
        >
            <h6 className="mb-3">Location Information</h6>
            <div className="table-responsive mb-4">
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th>Location</th>
                            <td>{location?.locationName || "—"}</td>
                        </tr>
                        <tr>
                            <th>Area</th>
                            <td>{location?.area || "—"}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{location?.address || "—"}</td>
                        </tr>
                        <tr>
                            <th>Operating Hours</th>
                            <td>
                                {location?.openTime || "—"} – {location?.closeTime || "—"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h6>Pricing</h6>
            <div className="table-responsive mb-4">
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Vehicle</th>
                            <th>Hourly Price</th>
                            <th>Overstay Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map(price => (
                            <tr key={price.id ?? price.vehicleType}>
                                <td>{price.vehicleType}</td>
                                <td>₹{price.hourPrice}</td>
                                <td>₹{price.overstayPrice}</td>
                            </tr>
                        ))}
                        {prices.length === 0 && (
                            <tr>
                                <td colSpan="3">No saved pricing found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h6>Floors & Slots</h6>
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <Card title="Floors">
                        <h3>{floors.length}</h3>
                        <p className="text-muted mb-0">Saved floors</p>
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card title="Slots">
                        <h3>{slots.length}</h3>
                        <p className="text-muted mb-0">Saved slots</p>
                    </Card>
                </div>
            </div>

            {!canActivate && (
                <div className="alert alert-warning">
                    Complete and save the required pricing, floors and slots
                    before activating this location.
                </div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    onClick={onActivate}
                    loading={activating}
                    disabled={!canActivate || activating}
                >
                    Activate Location
                </Button>
            </div>
        </Card>
    );
}

export default ReviewStep;
