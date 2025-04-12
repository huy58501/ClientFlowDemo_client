import { API_ROUTES } from "@/config/api";

export async function GET(request: Request) {
    const cookie = request.headers.get('cookie');

    const response = await fetch(API_ROUTES.GET_USERS, {
        method: 'GET',
        headers: {
            Cookie: cookie ?? '', // ✅ forward it
        },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
