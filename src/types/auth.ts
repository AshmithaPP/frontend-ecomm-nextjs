export interface User {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface RefreshResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
    };
}
