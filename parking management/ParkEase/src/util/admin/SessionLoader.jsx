
import { redirect } from "react-router-dom";
import api from "../api";

export async function activeSessionsLoader({ request }) {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 10);

    try {
        const response = await api.get("/admin/sessions", {
            params: {
                page,
                size,
                status: "ACTIVE"
            }
        });

        const sessionPage = response.data;

        return {
            sessions: sessionPage.content || [],
            totalPages: sessionPage.totalPages || 0,
            totalElements: sessionPage.totalElements || 0,
            currentPage: sessionPage.number || 0,
            pageSize: sessionPage.size || size
        };
    } catch (error) {
        console.error("Failed to load active sessions:", error);

        throw new Response("Failed to load active sessions.", {
            status: error.response?.status || 500
        });
    }
}





export async function activeSessionsAction({ request }) {
    const formData = await request.formData();
    const sessionId = formData.get("sessionId");

    if (!sessionId) {
        return { success: false, message: "Session ID is missing."};
    }

    try {
        await api.post(`/admin/sessions/${sessionId}/exit`);

        return redirect("/admin/sessions");
    } catch (error) {
        console.error("Failed to exit vehicle:", error);

        return {
            success: false,
            message: error.response?.data?.message || "Failed to record vehicle exit. Please try again."
        };
    }
}

