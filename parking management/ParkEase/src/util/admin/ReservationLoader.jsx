import api from "../api";

export async function adminReservationLoader({ request }) {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 10);

    const status = url.searchParams.get("status");
    const locationId = url.searchParams.get("locationId");

    try {
        // Fetch reservations with pagination and optional filters.
        const response = await api.get( "/admin/allreservations",
            {
                params: {
                    page,
                    size,
                    ...(status && { status }),
                    ...(locationId && { locationId })
                }
            }
        );

        // Fetch locations for the filter dropdown.
        const locationResponse = await api.get("/admin/locations", {
            params: {
                page: 0,
                size: 100
            }
        });



        const reservationPage = response.data;
        const locationData = locationResponse.data;

        return {
            reservations: reservationPage.content || [],
            totalPages: reservationPage.totalPages || 0,
            totalElements: reservationPage.totalElements || 0,
            currentPage: reservationPage.number || 0,
            pageSize: reservationPage.size || size,
            locations: locationData.content || locationData || []
        };
    } catch (error) {
        console.error("Failed to load reservations:", error);

        throw new Response("Failed to load reservations.", {
            status: error.response?.status || 500
        });
    }
}