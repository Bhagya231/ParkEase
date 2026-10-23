
import api from "./api";

export async function adminDashboardLoader() {
    try {
        const response = await api.get("/admin/dashboard");

        return response.data?.data ?? response.data;
    } catch (error) {
        console.error("Failed to load admin dashboard statistics:", error);

        throw new Response(  error.response?.data?.message ||  "Unable to load dashboard statistics.",
            {
                status: error.response?.status || 500
            }
        );
    }
}
