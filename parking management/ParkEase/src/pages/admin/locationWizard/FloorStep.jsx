
import { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";

function FloorsStep({
    savedFloor = [],
    onSave,
    onBack,
    saving = false,
    onNext
}) {
    const [floorName, setFloorName] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [error, setError] = useState("");

    // Clear the form when the saved floors change.
    useEffect(() => {
        setFloorName("");
        setFloorNumber("");
        setError("");
    }, [savedFloor]);

    function handleChange(event, setter) {
        setter(event.target.value);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const name = floorName.trim();
        const number = Number(floorNumber);

        if (!name) {
            setError("Floor name is required.");
            return;
        }

        if (
            floorNumber.trim() === "" ||
            !Number.isInteger(number)
        ) {
            setError("Enter a valid floor number.");
            return;
        }

        const floorData = {
            floorName: name,
            floorNumber: number
        };

        try {
            const saved = await onSave(floorData);

            if (saved) {
                // The parent reloads the saved floors.
                await onNext(saved);
            } else {
                setError("Floor could not be saved. Please try again.");
            }
        } catch (error) {
            setError(error.message || "Failed to save the floor.");
        }
    }

    return (
        <Card
            title="Parking Floors"
            description="Add a floor for your parking location."
            className="border-0"
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <FormInput
                            label="Floor Name"
                            name="floorName"
                            value={floorName}
                            onChange={event =>
                                handleChange(event, setFloorName)
                            }
                            placeholder="e.g. Ground Floor"
                            error={error && !floorName.trim() ? error : ""}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Floor Number"
                            name="floorNumber"
                            type="number"
                            value={floorNumber}
                            onChange={event =>
                                handleChange(event, setFloorNumber)
                            }
                            placeholder="e.g. 0"
                            error={
                                error && floorNumber.trim() === ""
                                    ? error
                                    : ""
                            }
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

                    <Button type="submit" loading={saving}>
                        Save Floor & Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default FloorsStep;
