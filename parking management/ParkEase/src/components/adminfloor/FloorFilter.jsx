
import { useState } from "react";

function FloorFilter({
    locations = [],
    onApply,
    onReset,
    initialLocationId = "",
    initialStatus = "ALL"
}) {
    const [locationId, setLocationId] = useState(initialLocationId);
    const [status, setStatus] = useState(initialStatus);

    const handleSubmit = (event) => {
        event.preventDefault();

        onApply({
            locationId,
            status
        });
    };

    const handleReset = () => {
        setLocationId("");
        setStatus("ALL");
        onReset();
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-end">

                        <div className="col-md-5">
                            <label
                                htmlFor="locationId"
                                className="form-label"
                            >
                                Parking Location
                            </label>

                            <select
                                id="locationId"
                                className="form-select"
                                value={locationId}
                                onChange={(event) =>
                                    setLocationId(event.target.value)
                                }
                            >
                                <option value="">
                                    All Locations
                                </option>

                                {locations.map((location) => (
                                    <option
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label
                                htmlFor="floorStatus"
                                className="form-label"
                            >
                                Floor Status
                            </label>

                            <select
                                id="floorStatus"
                                className="form-select"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-3 d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-success flex-grow-1"
                            >
                                Apply Filter
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default FloorFilter;
