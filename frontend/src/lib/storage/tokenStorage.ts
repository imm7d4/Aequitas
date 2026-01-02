export const tokenStorage = {
    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string): void {
        localStorage.setItem('token', token);
    },

    removeToken(): void {
        localStorage.removeItem('token');
    },

    getUser(): string | null {
        return localStorage.getItem('user');
    },

    setUser(user: string): void {
        localStorage.setItem('user', user);
    },

    removeUser(): void {
        localStorage.removeItem('user');
    },

    clear(): void {
        this.removeToken();
        this.removeUser();
    },
};
