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
import { useResponsiveColumnVisibility } from "@/hooks/use-responsive-column-visibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { TrackListContextType } from "@/lib/constants";

const COLUMN_VISIBILITY_CONFIG = {
  index: "sm",
  album: "md",
  dateAdded: "xl",
  duration: "sm",
} as const;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  contextId: string;
  contextType: TrackListContextType;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  contextId,
  contextType,
}: DataTableProps<TData, TValue>) {
  const columnVisibility = useResponsiveColumnVisibility(
    COLUMN_VISIBILITY_CONFIG
  );

  const isMobile = useIsMobile();
  const start = usePlaybackStore((s) => s.start);

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden">
      <Table>
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
        <TableBody className="before:content-[''] before:block before:sm:h-3 before:text-transparent">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  if (isMobile) {
                    const track = row.original as TrackItem;
                    start({
                      contextId,
                      contextType,
                      startTrackId: track.id,
                    });
                  }
                }}
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
                No songs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
