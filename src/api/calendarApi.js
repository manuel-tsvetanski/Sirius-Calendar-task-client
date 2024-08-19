export async function fetchCalendarData() {
    const BASE_URL = 'http://127.0.0.1:8000';
    const response = await fetch(`${BASE_URL}/api/calendar`, {
        method: 'GET',
        credentials: 'include', // Important for sending cookies
    });
    if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
    }
    return response.json();
}