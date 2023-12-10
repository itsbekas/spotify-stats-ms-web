const BASE_URL = "http://localhost";

const apiURL = (endpoint: string, params = {}) => {
    const paramsString = new URLSearchParams(params).toString();
    if (endpoint[0] === "/") endpoint = endpoint.slice(1);
    const endpointUrl = `${BASE_URL}/${endpoint}`;
    return paramsString ? `${endpointUrl}?${paramsString}` : endpointUrl;
}

export async function get(endpoint: string, params = {}) {
    const res = await fetch(apiURL(endpoint, params));
    return res;
}

export async function post(endpoint: string, data = {}) {
    const res = await fetch(apiURL(endpoint), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res;
}
