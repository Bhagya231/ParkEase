
import api from "../api";

export async function historyLoader({request})
{
     const url = new URL(request.url);

    const page = url.searchParams.get("page") ?? "0";
    const size = url.searchParams.get("size") ?? "10";

     try {
        const response = await api.get("/admin/sessions", {
            params: {
                status: "COMPLETED",
                page,
                size
            }
        });

         return {
            sessions: response.data.content ?? [],
            page: response.data.number ?? 0,
            totalPages: response.data.totalPages ?? 0,
            totalElements: response.data.totalElements ?? 0,
            size: response.data.size ?? Number(size)
        };
     } catch (error) {
        console.error("Failed to load parking history", error);

        throw new Response(
            "Failed to load parking history.",
            { status: error.response?.status ?? 500 }
        );
    }







}