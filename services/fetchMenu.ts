const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.BASE_URL || "http://localhost:3000";
export const fetchMenu = async () => (await fetch(`${BASE_URL}/api/snusket/today`)).json();
