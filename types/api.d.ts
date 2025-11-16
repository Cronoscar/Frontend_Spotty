export type ApiResponse<T> = {
    error?: boolean;
    ok?: boolean;
    data?: T;
};