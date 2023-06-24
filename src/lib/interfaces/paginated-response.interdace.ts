export interface PaginatedResponse<T> {
  data: T;
  meta: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      totalPages: number;
  }
}