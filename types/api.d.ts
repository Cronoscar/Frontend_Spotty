// types/api.ts
export type ApiResponse<T> = {
    error?: boolean;
    ok?: boolean;
    data?: T;
    message?: string; // Agregar esto para mensajes de error
};