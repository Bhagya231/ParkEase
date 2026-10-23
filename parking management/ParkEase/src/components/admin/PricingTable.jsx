
import Card from "../common/Card";
import Button from "../common/Button";

function PricingTable({ pricing = [], onEdit
}) {
    return (
        <Card title="Parking Pricing">
            { pricing.length === 0 ? (
                <div className="text-center text-muted py-4">
                    No pricing records found for this location.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Vehicle Type</th>
                                <th>Hourly Price</th>
                                <th>Overstay Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                       

                        <tbody>
                            
                            {pricing.map(price => (
                                <tr key={price.id}>
                                    <td>{price.vehicleType}</td>
                                    <td>
                                        ₹{Number(price.hourPrice).toFixed(2)}
                                    </td>
                                    <td>
                                        ₹{Number(price.overstayPrice).toFixed(2)}
                                    </td>
                                    <td>
                                        <Button
                                            type="button"
                                            onClick={() => onEdit(price)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}

export default PricingTable;
