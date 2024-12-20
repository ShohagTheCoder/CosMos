function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export async function logout() {
    try {
        deleteCookie("access_token");
        deleteCookie("user-id");
        window.location.href = "/login";
    } catch (error) {
        // Handle error
        console.error("Logout failed", error);
    }
}
