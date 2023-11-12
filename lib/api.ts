export async function fetchAPI(endpoint: string, params = {}) {
    const baseUrl = "http://localhost:5000";
    const paramsString = new URLSearchParams(params).toString();
    const res = await fetch(`${baseUrl}/${endpoint}?${paramsString}`);
    return res;
}