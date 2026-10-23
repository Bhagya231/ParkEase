
import { useEffect, useState } from "react";
import Card from "../../common/Card";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";

const vehicleTypes = ["CAR", "BIKE", "EV"];

const initialPrices = vehicleTypes.map(vehicleType => ({
    vehicleType,
    hourPrice: "",
    overstayPrice: ""
}));

function PricingStep({savedPrices = [],onSave,onBack,saving = false}) 
{
    const [prices, setPrices] = useState(initialPrices);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setPrices(
            vehicleTypes.map(vehicleType => {
                const existing = savedPrices.find(
                    price => price.vehicleType === vehicleType
                );

                return {
                    vehicleType,
                    hourPrice: existing?.hourPrice?.toString() ?? "",
                    overstayPrice: existing?.overstayPrice?.toString() ?? ""
                };
            })
        );
    }, [savedPrices]);

    function handleChange(index, event) {
        const { name, value } = event.target;

        setPrices(previous =>
            previous.map((price, currentIndex) =>
                currentIndex === index
                    ? { ...price, [name]: value }
                    : price
            )
        );

        setErrors(previous => ({
            ...previous,
            [`${index}-${name}`]: ""
        }));
    }

    function validate() {
        const nextErrors = {};

        prices.forEach((price, index) => {
            ["hourPrice", "overstayPrice"].forEach(field => {
                const value = price[field];
                const number = Number(value);

                if (value === "" || !Number.isFinite(number) || number < 1) {
                    nextErrors[`${index}-${field}`] =
                        "Enter a price of at least 1.";
                } else if (!/^\d{1,8}(\.\d{1,2})?$/.test(value)) {
                    nextErrors[`${index}-${field}`] =
                        "Use up to 8 integer digits and 2 decimal places.";
                }
            });
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validate()) return;

        const result = await onSave(
            prices.map(price => ({
                ...price,
                hourPrice: Number(price.hourPrice),
                overstayPrice: Number(price.overstayPrice)
            }))
        );

        if (result) {
            // The wizard can move forward after confirmed saving.
        }
    }

    return (
        <Card
            title="Parking Pricing"
            description="Set hourly and overstay prices for each vehicle type."
            className="border-0"
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                    {prices.map((price, index) => (
                        <div className="col-12" key={price.vehicleType}>
                            <Card title={`${price.vehicleType} Pricing`}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Hourly Price (₹)"
                                            name="hourPrice"
                                            type="number"
                                            value={price.hourPrice}
                                            onChange={event =>
                                                handleChange(index, event)
                                            }
                                            error={errors[`${index}-hourPrice`]}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <FormInput
                                            label="Overstay Price (₹)"
                                            name="overstayPrice"
                                            type="number"
                                            value={price.overstayPrice}
                                            onChange={event =>
                                                handleChange(index, event)
                                            }
                                            error={errors[`${index}-overstayPrice`]}
                                            required
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" loading={saving}>
                        Save Pricing
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default PricingStep;
