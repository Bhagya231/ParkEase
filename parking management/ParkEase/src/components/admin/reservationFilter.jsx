import Card from "../common/Card"
import Button from "../common/Button"
import FormSelect from "../common/FormSelection"


const statusOptions = [
    { value: "RESERVED", label: "Reserved" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "EXPIRED", label: "Expired" },
    { value: "COMPLETED", label: "Completed" }
];


function ReservationFilters({filters, locations = [], onFilterChange, onSearch,onReset})
{
    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: `${location.locationName} - ${location.area}`
    }));

    return (

         <Card title="Filter Reservations">
            <div className="row align-items-end">
                <div className="col-lg-4">
                    <FormSelect
                        label="Reservation Status"
                        name="status"
                        value={filters.status}
                        onChange={(event) =>
                            onFilterChange("status", event.target.value)
                        }
                        options={statusOptions}
                        placeholder="All statuses"
                    />
                </div>

                 <div className="col-lg-4">
                    <FormSelect
                        label="Parking Location"
                        name="locationId"
                        value={filters.locationId}
                        onChange={(event) =>
                            onFilterChange("locationId", event.target.value)
                        }
                        options={locationOptions}
                        placeholder="All locations"
                    />
                </div>

                 <div className="col-lg-4 mb-3 ">
                    <div className="d-flex gap-2"> 
                    <Button
                        type="button"
                        onClick={onSearch}
                    >
                        Search
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                    </div>
                </div>
            </div>
        </Card>



    );

}


export default ReservationFilters;

