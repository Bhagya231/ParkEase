
import { useState } from "react";
import Card from "../../../common/Card";
import FormInput from "....//../common/FormInput";
import FormSelect from "../../../common/FormSelect";
import Button from "../../../common/Button";

const vehicleOptions = [
    { value: "CAR", label: "Car" },
    { value: "BIKE", label: "Bike" },
    { value: "EV", label: "Electric Vehicle" }
];

const slotOptions = [
    { value: "STANDARD", label: "Standard" },
    { value: "EV_CHARGING", label: "EV Charging" },
    { value: "ACCESSIBLE", label: "Accessible" }
];

function SlotsStep({
    floors = [],
    savedSlots = [],
    onSave,
    onBack,
    saving = false
}) {
    const [floorId, setFloorId] = useState("");
    const [sectionName, setSectionName] = useState("A");
    const [startingNumber, setStartingNumber] = useState("1");
    const [slotCount, setSlotCount] = useState("10");
    const [vehicleType, setVehicleType] = useState("CAR");
    const [slotType, setSlotType] = useState("STANDARD");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!floorId) {
            setError("Select a floor.");
            return;
        }

        if (!sectionName.trim() || sectionName.trim().length > 10) {
            setError("Section name is required and cannot exceed 10 characters.");
            return;
        }

        if (
            !Number.isInteger(Number(startingNumber)) ||
            Number(startingNumber) < 1 ||
            !Number.isInteger(Number(slotCount)) ||
            Number(slotCount) < 1
        ) {
            setError("Starting number and slot count must be positive integers.");
            return;
        }

        setError("");

        await onSave({
            floorId,
            request: {
                sectionName: sectionName.trim(),
                startingNumber: Number(startingNumber),
                slotCount: Number(slotCount),
                vehicleType,
                slotType
            }
        });
    }

    const floorOptions = floors.map(floor => ({
        value: String(floor.id),
        label: `${floor.floorName} (${floor.floorNumber})`
    }));

    return (
        <Card
            title="Parking Slots"
            description="Generate slots for each saved floor."
            className="border-0"
        >
            <form onSubmit={handleSubmit} noValidate>
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <div className="row g-3">
                    <div className="col-md-6">
                        <FormSelect
                            label="Select Floor"
                            name="floorId"
                            value={floorId}
                            onChange={setFloorId}
                            options={floorOptions}
                            placeholder="Choose a floor"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <FormInput
                            label="Section Name"
                            name="sectionName"
                            value={sectionName}
                            onChange={event => setSectionName(event.target.value)}
                            placeholder="e.g. A"
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Starting Number"
                            name="startingNumber"
                            type="number"
                            value={startingNumber}
                            onChange={event => setStartingNumber(event.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Number of Slots"
                            name="slotCount"
                            type="number"
                            value={slotCount}
                            onChange={event => setSlotCount(event.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormSelect
                            label="Vehicle Type"
                            name="vehicleType"
                            value={vehicleType}
                            onChange={setVehicleType}
                            options={vehicleOptions}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <FormSelect
                            label="Slot Type"
                            name="slotType"
                            value={slotType}
                            onChange={setSlotType}
                            options={slotOptions}
                            required
                        />
                    </div>
                </div>

                <p className="text-muted small mt-3">
                    Slots will be generated when you save this configuration.
                </p>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" loading={saving}>
                        Generate Slots
                    </Button>
                </div>
            </form>

            {savedSlots.length > 0 && (
                <div className="mt-4">
                    <h6>Previously Created Slots</h6>
                    <p className="text-muted mb-0">
                        {savedSlots.length} saved slots are available for review.
                    </p>
                </div>
            )}
        </Card>
    );
}

export default SlotsStep;
