export interface statusError extends Error {
    status?: number
};

export type UserRole = "admin" | "instructor" | "student";

export type TokenUser = {
    id: number,
    tenant_id: number,
    first_name: string,
    last_name: string,
    email: string,
    role: UserRole
};
