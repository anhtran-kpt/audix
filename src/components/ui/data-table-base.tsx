"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BreakpointConfig,
  useResponsiveColumnVisibility,
} from "@/features/shared/hooks/use-responsive-column-visibility";

interface DataTableBaseProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (item: TData) => void;
  columnVisibilityConfig?: BreakpointConfig;
  emptyMessage?: string;
  showHeader?: boolean;
}

export function DataTableBase<TData, TValue>({
  columns,
  data,
  onRowClick,
  columnVisibilityConfig,
  emptyMessage = "No items found.",
  showHeader = true,
}: DataTableBaseProps<TData, TValue>) {
  const columnVisibility = useResponsiveColumnVisibility(
    columnVisibilityConfig ?? {}
  );
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden">
      <Table>
        {showHeader && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:sm:bg-inherit">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.columnDef.meta?.headerClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody
          className={cn(
            showHeader &&
              "before:content-[''] before:block before:sm:h-3 before:text-transparent"
          )}
        >
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "first:rounded-l-sm last:rounded-r-sm",
                      cell.column.columnDef.meta?.cellClassName
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-12 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
