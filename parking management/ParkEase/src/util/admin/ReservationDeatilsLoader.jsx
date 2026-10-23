
import { redirect } from "react-router-dom";
import api from "../api";

export async function vehicleEntryAction({ request }) {
    const formData = await request.formData();
    const reservationId = formData.get("reservationId");

    try {
         await api.post("/admin/sessions/entry", { reservationId });

        return redirect("/admin/sessions");
    } catch (error) {
        
        console.error("Failed to record vehicle entry:", error);

        return {
            success: false,
            message:  error.response?.data?.message || "Failed to record vehicle entry. Please try again."
        };
    }
}





export async function reservationDetailsLoader({ params }) 
{
    const reservationId = params.reservationId;

    try {
        const response = await api.get( `/admin/reservation/${reservationId}`);

        return {
            reservation: response.data
        };
    } catch (error) {
        console.error("Failed to load reservation details:", error);

        throw new Response("Failed to load reservation details.", {
            status: error.response?.status || 500
        });
    }
}
