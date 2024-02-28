export interface SuccessResponse<T> {
    status: number;
    data: T;
}

export interface ErrorResponse {
    status: number;
    message: string;
}
