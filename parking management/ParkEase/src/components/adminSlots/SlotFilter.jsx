
import FormSelect from "../common/FormSelection";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import Card from "../common/Card";



function SlotFilter({
    locations = [],
    floors = [],
    selectedLocationId = "",
    selectedFloorId = "",
    filters = {},
    onLocationChange,
    onFloorChange,
    onFilterChange,
    onApply,
    onReset})
{
    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: location.locationName
    }));

     const floorOptions = floors.map((floor) => ({
        value: floor.id,
        label: `${floor.floorName} (Floor ${floor.floorNumber})`
    }));
    const vehicleOptions = [
        { value: "", label: "All vehicle types" },
        { value: "CAR", label: "Car" },
        { value: "BIKE", label: "Bike" },
        { value: "EV", label: "Electric Vehicle" }];

    const slotTypeOptions = [
        { value: "", label: "All slot types" },
        { value: "STANDARD", label: "Standard" },
        { value: "EV_CHARGING", label: "EV Charging" },
        { value: "ACCESSIBLE", label: "Accessible" }
    ];

     const statusOptions = [
        { value: "", label: "All statuses" },
        { value: "AVAILABLE", label: "Available" },
        { value: "RESERVED", label: "Reserved" },
        { value: "OCCUPIED", label: "Occupied" },
        { value: "UNAVAILABLE", label: "Unavailable" }
    ];

    return (
        <Card title="Find Parking Slots">
            <div className="row g-3">
                <div className="col-md-6">
                     <FormSelect
                        label="Parking Location"
                        name="locationId"
                        value={selectedLocationId}
                        onChange={(event) => onLocationChange(event.target.value)}
                        options={[ { value: "", label: "Select location" },
                            ...locationOptions]}
                        required
                    />

                </div>
                <div className="col-md-6">
                    <FormSelect
                        label="Floor"
                        name="floorId"
                        value={selectedFloorId}
                        onChange={(event) =>
                            onFloorChange(event.target.value)
                        }
                        options={[{ value: "", label: "Select floor" },...floorOptions]}
    
                        disabled={!selectedLocationId}
                        required
                    />
                </div>

                 <div className="col-md-4">
                    <FormSelect
                        label="Vehicle Type"
                        name="vehicleType"
                        value={filters.vehicleType || ""}
                        onChange={(event) => onFilterChange("vehicleType", event.target.value)}
        
                        options={vehicleOptions}
                    />
                </div>

                 <div className="col-md-4">
                    <FormSelect
                        label="Slot Type"
                        name="slotType"
                        value={filters.slotType || ""}
                        onChange={(event) =>
                            onFilterChange("slotType", event.target.value)
                        }
                        options={slotTypeOptions}
                    />
                </div>

                 <div className="col-md-4">
                    <FormSelect
                        label="Slot Status"
                        name="slotStatus"
                        value={filters.slotStatus || ""}
                        onChange={(event) =>
                            onFilterChange("slotStatus", event.target.value)
                        }
                        options={statusOptions}
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        label="Section Name"
                        name="sectionName"
                        value={filters.sectionName || ""}
                        onChange={(event) =>
                            onFilterChange("sectionName", event.target.value)
                        }
                        placeholder="e.g. A"
                    />
                </div>

                <div className="col-12 d-flex gap-2">
                    <Button type="button" onClick={onApply} disabled={!selectedLocationId || !selectedFloorId} >
                         Search Slots
                    </Button>

                    <Button  type="button" variant="outline-secondary" onClick={onReset} >
                        Reset
                    </Button>
                       
                </div>



            </div>
         </Card>
    )
}


export default SlotFilter;



