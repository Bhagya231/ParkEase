function getAuthData() {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    return {
        token,
        role,
        name,
        isLoggedIn: !!token
    };
}



export function rootLoader() {

    return getAuthData();

}