/* global BigInt */
export class ApiError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}

const MESSAGES = {
    404: "Checkpoint no longer exists on the server.",
    401: "Wrong delete password.",
    409: "That tag is already taken - pick another.",
};

export const toBig = (v) => {
    try { return (v === null || v === undefined || v === "") ? 0n : BigInt(v); }
    catch { return 0n; }
};

const HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

export async function api(baseurl, path = "", options = {}) {
    let res;
    try {
        res = await fetch(baseurl + path, { ...options, headers: { ...HEADERS, ...(options.headers || {}) } });
    } catch (e) {
        throw new ApiError(0, "Offline or server unreachable.");
    }
    const text = await res.text();
    let body = null;
    if (text) { try { body = JSON.parse(text); } catch { /* non-JSON */ } }
    if (!res.ok)
        throw new ApiError(res.status, (body && body.message) || MESSAGES[res.status] || res.statusText);
    return body;
}
