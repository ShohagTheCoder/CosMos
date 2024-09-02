import axios from "axios";

export async function handleLogout() {
    try {
        await axios.get("/api/auth/logout");
        window.location.reload();
    } catch (error) {
        // Handle error
        console.error("Logout failed", error);
    }
}
