export const getPaginationMeta = ({
  limit,
  offset,
  total,
}: {
  limit: number;
  offset: number;
  total: number;
}) => {
  return {
    limit,
    offset,
    total,
    hasMore: offset + limit < total,
  };
};
