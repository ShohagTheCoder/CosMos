import { decodeJwt } from "./decodeJwt";

export function verify_access_token(access_token: string) {
    const decoded = decodeJwt(access_token);
    if (decoded.verify == "Shohag Ahmed") {
        return true;
    }

    return false;
}
