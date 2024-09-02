import { decodeJwt } from "./decodeJwt";

export function verify_access_token(access_token: string) {
    const decoded = decodeJwt(access_token);
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    if (exp > now) {
        return true;
    }

    return false;
}
