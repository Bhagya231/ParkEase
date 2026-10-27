
import { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import FormInput from "../../../components/common/FormInput";
import FormSelect from "../../../components/common/FormSelection";
import Button from "../../../components/common/Button";

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
    savedFloor = null,
    savedSlots = [],
    onSave,
    onBack,
    onNext,
    saving = false

}) {
    const [sectionName, setSectionName] = useState("A");
    const [startingNumber, setStartingNumber] = useState("1");
    const [slotCount, setSlotCount] = useState("10");
    const [vehicleType, setVehicleType] = useState("CAR");
    const [slotType, setSlotType] = useState("STANDARD");
    const [error, setError] = useState("");

    // The parent currently passes all floors.
    // Select the floor that needs slots, if one exists.
    const floor = Array.isArray(savedFloor)
        ? savedFloor.find(item =>
            !savedSlots.some(slot =>
                slot.floorId === item.id ||
                slot.floorId === item.floorId
            )
        ) || savedFloor[0] || null
        : savedFloor;

    const floorId = floor?.id ?? floor?.floorId;

    useEffect(() => {
        setError("");
    }, [floorId]);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!floorId) {
            setError("Please save a floor before generating slots.");
            return;
        }

        if (
            !sectionName.trim() ||
            sectionName.trim().length > 10
        ) {
            setError(
                "Section name is required and cannot exceed 10 characters."
            );
            return;
        }

        if (
            startingNumber.trim() === "" ||
            !Number.isInteger(Number(startingNumber)) ||
            Number(startingNumber) < 1
        ) {
            setError("Starting number must be a positive integer.");
            return;
        }

        if (
            slotCount.trim() === "" ||
            !Number.isInteger(Number(slotCount)) ||
            Number(slotCount) < 1
        ) {
            setError("Number of slots must be a positive integer.");
            return;
        }

        setError("");

        try {
            const result = await onSave({
                floorId,
                request: {
                    sectionName: sectionName.trim(),
                    startingNumber: Number(startingNumber),
                    slotCount: Number(slotCount),
                    vehicleType,
                    slotType
                }
            });

            if (result) {
                await onNext(result);
            } else {
                setError(
                    "Slots could not be generated. Please try again."
                );
            }
        } catch (error) {
            setError(
                error.message ||
                "Failed to generate slots. Please try again."
            );
        }
    }

    return (
        <Card
            title="Parking Slots"
            className="border-0"
            description="Generate multiple parking slots for your saved floor."
        >
            <form onSubmit={handleSubmit} noValidate>
                {floor ? (
                    <div className="alert alert-light border mb-4">
                        <div className="fw-semibold">
                            <i className="bi bi-building me-2"></i>
                            {floor.floorName}
                        </div>

                        <div className="text-muted small">
                            Floor Number: {floor.floorNumber}
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-warning">
                        Save a floor before generating parking slots.
                    </div>
                )}

                <div className="row g-3">
                    <div className="col-md-6">
                        <FormInput
                            label="Section Name"
                            name="sectionName"
                            value={sectionName}
                            onChange={event => {
                                setSectionName(event.target.value);
                                setError("");
                            }}
                            placeholder="e.g. A"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <FormSelect
                            label="Vehicle Type"
                            name="vehicleType"
                            value={vehicleType}
                            onChange={value => setVehicleType(value)}
                            options={vehicleOptions}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Starting Number"
                            name="startingNumber"
                            type="number"
                            min="1"
                            value={startingNumber}
                            onChange={event => {
                                setStartingNumber(event.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Number of Slots"
                            name="slotCount"
                            type="number"
                            min="1"
                            value={slotCount}
                            onChange={event => {
                                setSlotCount(event.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormSelect
                            label="Slot Type"
                            name="slotType"
                            value={slotType}
                            onChange={value => setSlotType(value)}
                            options={slotOptions}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onBack}
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        loading={saving}
                        disabled={!floorId || saving}
                    >
                        Generate Slots & Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default SlotsStep;
