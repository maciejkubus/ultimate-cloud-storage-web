export interface ApiError {
	statusCode: number;
	message?: string;
	messages?: string[];
	error?: string;
}
export interface ApiResponse<T> {
	status: number;
	body: T & ApiError;
}
