import axios from "axios";
import Cookies from "js-cookie";

export async function login(email: any, password: any) {
    const { data } = await axios.post("/api/auth/login", { email, password });
    Cookies.set("access_token", data.token, { expires: 1 });
}

export function logout() {
    Cookies.remove("access_token");
    window.location.href = "/login";
}

export function getToken() {
    return Cookies.get("access_token");
}
