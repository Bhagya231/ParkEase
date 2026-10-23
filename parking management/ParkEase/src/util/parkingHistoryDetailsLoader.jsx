import api from "./api";

export async function parkingHistoryDetailsLoader({ params }) {
    try {
        const response = await api.get(`/user/sessions/${params.sessionId}`);

        return response.data?.data ?? response.data;
    } catch (error) {
        console.error( "Failed to load parking session details:", error);

        throw new Response(error.response?.data?.message || "Unable to load parking session details.",
            {status: error.response?.status || 500}
        );
    }
}