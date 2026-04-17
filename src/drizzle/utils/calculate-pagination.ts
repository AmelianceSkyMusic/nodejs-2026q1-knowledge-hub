export function calculatePagination(total: number, page: number, limit: number) {
	const pages = Math.ceil(total / limit) || 1;
	const currentPage = Math.min(Math.max(1, page), pages);
	const offset = (currentPage - 1) * limit;

	return {
		pages,
		currentPage,
		offset,
	};
}
