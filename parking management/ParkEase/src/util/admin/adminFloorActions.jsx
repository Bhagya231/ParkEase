
import api from "../api";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again."
    );
}

export async function adminFloorAction({ request }) {
    try {
        const contentType = request.headers.get("Content-Type") || "";

        const data = contentType.includes("application/json")
            ? await request.json()
            : Object.fromEntries(await request.formData());

        const intent = data.intent;

        // Create floor
        if (intent === "create") {
            const locationId = data.locationId;

            if (!locationId) {
                return {
                    error: "Please select a parking location."
                };
            }

            const floorData = {
                floorName: data.floorName?.trim(),
                floorNumber: Number(data.floorNumber)
            };

            await api.post(
                `/admin/${locationId}/floors`,
                floorData
            );

            return {
                success: "Floor created successfully."
            };
        }

        // Update floor
        if (intent === "update") {
            if (!data.floorId) {
                return { error: "Floor ID is required." };
            }

            const floorData = {
                floorName: data.floorName?.trim(),
                floorNumber: Number(data.floorNumber)
            };

            await api.put(
                `/admin/floors/${data.floorId}`,
                floorData
            );

            return {
                success: "Floor updated successfully."
            };
        }

        // Activate or deactivate floor
        if (intent === "status") {
            if (!data.floorId) {
                return { error: "Floor ID is required." };
            }

            if (!["ACTIVE", "INACTIVE"].includes(data.status)) {
                return { error: "Invalid floor status." };
            }

            await api.patch(
                `/admin/floors/${data.floorId}/status`,
                { status: data.status }
            );

            return {
                success: `Floor ${
                    data.status === "ACTIVE"
                        ? "activated"
                        : "deactivated"
                } successfully.`
            };
        }

        return { error: "Invalid floor action." };
    } catch (error) {
        return { error: getErrorMessage(error) };
    }
}
