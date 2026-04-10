import { OAuth2Client } from "google-auth-library";
import { ENV } from "../config/env.js";
import { Errors } from "../errors/errors.js";


const clientID = ENV.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientID);


export async function verifyGoogleToken(token) {
    if (!token) {
        throw Errors.MISSING_GOOGLE_TOKEN();
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID,
    });

    if (!ticket) {
        throw Errors.INVALID_GOOGLE_TOKEN();
    }

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
        throw Errors.INVALID_GOOGLE_TOKEN();
    }

    return {
        email: payload.email,
        googleId: payload.sub,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        avatar: payload.picture || null,
    };
}