// This function is used to decode the token and return the User ID (separate from the rest of the payload) to the caller

export default function decoder(token) {

    const payload = token?.toString().split('.')[1];

    if (!payload) {
        console.error("Token payload is undefined or null.");
        return null;
    }

    // Replace base64url encoding with base64 encoding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Ensure the string's length is a multiple of 4
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    try {
        const decodedPayload = atob(paddedBase64);
        return JSON.parse(decodedPayload); // Return the decoded payload
    } catch (e) {
        console.error("Failed to decode payload:", e);
        return null;
    }
}