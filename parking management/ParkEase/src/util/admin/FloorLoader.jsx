
import api from "../api";
import { getLocations } from "./adminLocationLoader";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load floor management data."
    );
}

export async function FloorLoader({ request }) {
    try {
        const url = new URL(request.url);

        const page = Math.max(
            0,
            Number(url.searchParams.get("page") || 0)
        );

        const [floorResponse, locationResponse] = await Promise.all([
            api.get("/admin/floors", {
                params: {
                    page,
                    size: 10
                }
            }),

            getLocations({
                page: 0,
                size: 100,
                filter: "ALL"
            })
        ]);

        return {
            floors: floorResponse.data.content || [],
            currentPage: floorResponse.data.number ?? page,
            totalPages: floorResponse.data.totalPages ?? 0,
            totalElements: floorResponse.data.totalElements ?? 0,
            locations: locationResponse.content || []
        };
    } catch (error) {
        throw new Response(getErrorMessage(error), {
            status: error.response?.status || 500
        });
    }
}
