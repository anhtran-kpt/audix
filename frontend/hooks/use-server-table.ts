import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  PageOptions,
  PaginatedResponse,
} from "@/features/common/types/pagination";

interface UseServerTableProps<TData> {
  queryKey: string[];
  fetcher: (params: PageOptions) => Promise<PaginatedResponse<TData>>;
  defaultPageSize?: number;
}

export function useServerTable<TData>({
  queryKey,
  fetcher,
  defaultPageSize = 10,
}: UseServerTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const params: PageOptions = {
    page: pagination.pageIndex + 1,
    take: pagination.pageSize,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
  };

  const query = useQuery({
    queryKey: [...queryKey, pagination, sorting],
    queryFn: () => fetcher(params),
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.data || [],
    pageCount: query.data?.meta.pageCount || 0,
    total: query.data?.meta.itemCount || 0,

    pagination,
    sorting,

    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,

    rowSelection,
    onRowSelectionChange: setRowSelection,

    selectedIds: Object.keys(rowSelection),

    resetSelection: () => setRowSelection({}),
  };
}
