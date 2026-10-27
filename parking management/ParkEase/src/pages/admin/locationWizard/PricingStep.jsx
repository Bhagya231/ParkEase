
import { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";

const vehicleTypes = ["CAR", "BIKE", "EV"];

const initialPrices = vehicleTypes.map(vehicleType => ({
    vehicleType,
    hourPrice: "",
    overstayPrice: ""
}));

function PricingStep({savedPrices = [],onSave,onBack,saving = false,onNext}) 
{
    const [prices, setPrices] = useState(initialPrices);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setPrices(
            vehicleTypes.map(vehicleType => {
                const existing = savedPrices.find(
                    price => price.vehicleType === vehicleType);

                return {
                    vehicleType,
                    hourPrice: existing?.hourPrice?.toString() ?? "",
                    overstayPrice: existing?.overstayPrice?.toString() ?? ""
                };
            })
        );

         setErrors({});
        setFormError("");
    }, [savedPrices]);

    function handleChange(index, event) {
        const { name, value } = event.target;

        setPrices(previous =>
            previous.map((price, currentIndex) => currentIndex === index  ? { ...price, [name]: value } : price));

        setErrors(previous => ({
            ...previous,
            [`${index}-${name}`]: ""
        }));
        setFormError("");
    }

    function validate() {
        const nextErrors = {};

        prices.forEach((price, index) => {
            ["hourPrice", "overstayPrice"].forEach(field => {
                const value = price[field].trim();
                const number = Number(value);

                if (value === "" || !Number.isFinite(number) || number < 1) {
                    nextErrors[`${index}-${field}`] = "Enter a price of at least 1.";
                } else if (!/^\d{1,8}(\.\d{1,2})?$/.test(value))
                    {
                        nextErrors[`${index}-${field}`] = "Use up to 8 integer digits and 2 decimal places.";
                }
            });
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (saving  || !validate()) return;

        setFormError("");

        const pricingData = prices.map(price => ({
            vehicleType: price.vehicleType,
            hourPrice: Number(price.hourPrice),
            overstayPrice: Number(price.overstayPrice)
        }));

         try {
            const result = await onSave(pricingData);

            if (result) {
                onNext(result);
            } else {
                setFormError("Pricing could not be saved. Please try again.");
            }
        } catch (error) {
            setFormError(
                error.message || "Failed to save pricing. Please try again.");
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
                                            min="1"
                                            step="0.01"
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
                                            min="1"
                                            step="0.01"
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

                 {formError && (
                    <div className="alert alert-danger mt-3">
                        {formError}
                    </div>
                )}


                <div className="d-flex justify-content-between mt-4">
                    <Button  type="button" variant="secondary"  onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" loading={saving} >
                         Save Pricing & Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default PricingStep;
