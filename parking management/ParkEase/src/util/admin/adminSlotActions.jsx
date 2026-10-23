
import api from "../api";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again."
    );
}

export async function adminSlotAction({ request }) {
    try {
        const contentType = request.headers.get("Content-Type") || "";

        const data = contentType.includes("application/json")
            ? await request.json()
            : Object.fromEntries(await request.formData());

        const intent = data.intent;

        // Create multiple slots for a floor
        if (intent === "create") {
            if (!data.floorId) {
                return { error: "Please select a floor." };
            }

            const slotData = {
                sectionName: data.sectionName?.trim(),
                startingNumber: Number(data.startingNumber),
                slotCount: Number(data.slotCount),
                vehicleType: data.vehicleType,
                slotType: data.slotType
            };

            await api.post(
                `/admin/floors/${data.floorId}/slots`,
                slotData
            );

            return {
                success: "Parking slots created successfully.",
                floorId: data.floorId
            };
        }

        // Update one slot
        if (intent === "update") {
            if (!data.slotId) {
                return { error: "Slot ID is required." };
            }

            const slotData = {
                slotNumber: data.slotNumber?.trim(),
                vehicleType: data.vehicleType,
                sectionName: data.sectionName?.trim(),
                slotType: data.slotType
            };

            await api.put(
                `/admin/slots/${data.slotId}`,
                slotData
            );

            return {
                success: "Parking slot updated successfully."
            };
        }

        // Change one slot's status
        if (intent === "status") {
            if (!data.slotId) {
                return { error: "Slot ID is required." };
            }

            const validStatuses = [
                "AVAILABLE",
                "UNAVAILABLE"
            ];

            if (!validStatuses.includes(data.status)) {
                return {  error: "Only AVAILABLE and UNAVAILABLE can be set manually." };
            }

            await api.patch(
                `/admin/slots/${data.slotId}/status`,
                { slotStatus: data.status }
            );

            return {
                success: "Parking slot status updated successfully."
            };
        }

        return { error: "Invalid slot action." };

    } catch (error) {
        return {
            error: getErrorMessage(error)
        };
    }
}
