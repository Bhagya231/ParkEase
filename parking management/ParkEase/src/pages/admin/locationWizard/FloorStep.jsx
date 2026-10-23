
import { useEffect, useState } from "react";
import Card from "../../common/Card";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";

function FloorsStep({
    savedFloors = [],
    onSave,
    onBack,
    saving = false
}) {
    const [floors, setFloors] = useState([]);
    const [floorName, setFloorName] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setFloors(savedFloors);
    }, [savedFloors]);

    function addFloor() {
        const name = floorName.trim();
        const number = Number(floorNumber);

        if (!name) {
            setError("Floor name is required.");
            return;
        }

        if (!Number.isInteger(number)) {
            setError("Enter a valid floor number.");
            return;
        }

        if (floors.some(floor => Number(floor.floorNumber) === number)) {
            setError("This floor number has already been added.");
            return;
        }

        setFloors(previous => [
            ...previous,
            { floorName: name, floorNumber: number }
        ]);

        setFloorName("");
        setFloorNumber("");
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (floors.length === 0) {
            setError("Add at least one floor before continuing.");
            return;
        }

        const result = await onSave(floors);

        if (!result) return;
    }

    return (
        <Card
            title="Parking Floors"
            description="Add the floors available at this location."
            className="border-0"
        >
            <form onSubmit={handleSubmit}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <FormInput
                            label="Floor Name"
                            name="floorName"
                            value={floorName}
                            onChange={event => setFloorName(event.target.value)}
                            placeholder="e.g. Ground Floor"
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Floor Number"
                            name="floorNumber"
                            type="number"
                            value={floorNumber}
                            onChange={event => setFloorNumber(event.target.value)}
                            placeholder="e.g. 0"
                            required
                        />
                    </div>

                    <div className="col-md-3">
                        <Button type="button" onClick={addFloor} fullWidth>
                            Add Floor
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                )}

                <div className="table-responsive mt-4">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Floor Name</th>
                                <th>Floor Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {floors.map((floor, index) => (
                                <tr key={floor.id ?? `${floor.floorNumber}-${index}`}>
                                    <td>{floor.floorName}</td>
                                    <td>{floor.floorNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" loading={saving}>
                        Save Floors & Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default FloorsStep;
