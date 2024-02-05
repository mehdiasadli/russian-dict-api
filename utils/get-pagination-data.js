/**
 *
 * @param {{ page?: number, limit?: number, total: number }} [data]
 */
function getPaginationData(data = {}) {
  const page = data.page ?? 1;
  const limit = data.limit ?? 50;
  const total = data.total;

  const total_pages = total / limit;
  const is_last_page = page >= total_pages;

  return {
    page,
    limit,
    total,
    total_pages,
    is_last_page,
    skip: limit * (page - 1),
  };
}

module.exports = getPaginationData;
