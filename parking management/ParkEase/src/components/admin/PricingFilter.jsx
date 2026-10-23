
import Card from "../common/Card";
import FormSelect from "../common/FormSelection";
import Button from "../common/Button";

function PricingFilter({
    locations = [],
    selectedLocationId = "",
    onLocationChange,
    onSearch,
    onReset
}) {
    const locationOptions = locations.map(location => ({
        value: location.id,
        label: location.locationName
    }));

    return (
        <Card title="Find Pricing">
            <div className="row g-3 align-items-end">
                <div className="col-md-6">
                    <FormSelect
                        label="Parking Location"
                        name="locationId"
                        value={selectedLocationId}
                        onChange={event =>
                            onLocationChange(event.target.value)
                        }
                        options={[
                            { value: "", label: "Select parking location" },
                            ...locationOptions
                        ]}
                        required
                    />
                </div>

                <div className="col-md-3">
                    <Button
                        type="button"
                        onClick={onSearch}
                        disabled={!selectedLocationId}
                    >
                         Search
                    </Button>
                </div>

                <div className="col-md-3">
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default PricingFilter;
