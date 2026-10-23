

import api from "../api";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process pricing request."
    );
}

export async function adminPricingAction({ request }) {
    try {
        const data = await request.json();

        if (data.intent === "create") {
            if (!data.locationId) {
                return {
                    error: "Please select a parking location."
                };
            }

            const pricingData = {
                vehicleType: data.vehicleType,
                hourPrice: Number(data.hourPrice),
                overstayPrice: Number(data.overstayPrice)
            };

            await api.post(
                `/admin/locations/${data.locationId}/pricing`,
                pricingData
            );

            return {
                success: "Parking pricing created successfully.",
                locationId: data.locationId
            };
        }

        if (data.intent === "update") {
            if (!data.pricingId) {
                return {
                    error: "Pricing ID is required."
                };
            }

            const pricingData = {
                vehicleType: data.vehicleType,
                hourPrice: Number(data.hourPrice),
                overstayPrice: Number(data.overstayPrice)
            };

            await api.put(
                `/admin/pricing/${data.pricingId}`,
                pricingData
            );

            return {
                success: "Parking pricing updated successfully."
            };
        }

        return {
            error: "Invalid pricing action."
        };
    } catch (error) {
        return {
            error: getErrorMessage(error)
        };
    }
}


