"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/features/artists/components/admin/artist-columns";
import { getArtists } from "@/features/artists/api/client";
import { useServerTable } from "@/hooks/use-server-table";

export default function AdminArtistsPage() {
  const {
    data,
    pageCount,
    pagination,
    onPaginationChange,
    isLoading,
    rowSelection,
    onRowSelectionChange,
    selectedIds,
    resetSelection,
  } = useServerTable({
    queryKey: ["artists"],
    fetcher: getArtists,
  });

  const handleDeleteSelected = () => {
    console.log("Deleting IDs:", selectedIds);

    // Sau khi xóa xong nhớ gọi: resetSelection();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Artists</h2>
          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete {selectedIds.length} selected
            </Button>
          )}
          <p className="text-muted-foreground">
            Manage your artists list here.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/artists/create">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
      />
    </div>
  );
}
