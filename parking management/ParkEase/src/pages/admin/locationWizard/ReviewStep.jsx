
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

function ReviewStep({ location, prices = [], floor = [],slots = [],  onBack,onFinish})
    {
    return (
        <Card title="Review Parking Location"  description="Review the saved details."
            className="border-0">
            <h6 className="mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                Location Information</h6>
            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
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

            <h6 className="mb-3">
                <i className="bi bi-currency-rupee me-2"></i>
                Parking Pricing
            </h6>
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

           <h6 className="mb-3">
                <i className="bi bi-building me-2"></i>
                Floor Information
            </h6>

            {floor ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <h6 className="card-title">
                            {floor.floorName}
                        </h6>
                        <p className="text-muted mb-0">
                            Floor Number: {floor.floorNumber}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">
                    No saved floor information found.
                </div>
            )}


            <h6 className="mb-3">
                <i className="bi bi-p-square me-2"></i>
                Parking Slots
            </h6>

            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="mb-1">{slots.length}</h3>
                    <p className="text-muted mb-0">
                        {slots.length === 1
                            ? "Parking slot saved"
                            : "Parking slots saved"}
                    </p>
                </div>
            </div>


            <div className="d-flex justify-content-between mt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onBack}
                >
                    Back
                </Button>

                <Button
                    type="button"
                    onClick={onFinish}
                >
                    Finish Setup
                </Button>
            </div>

        </Card>
    );
}

export default ReviewStep;
