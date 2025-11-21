"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/features/artists/components/admin/artist-columns";
import { getArtists } from "@/features/artists/api/client";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

export default function AdminArtistsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["artists", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getArtists({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load artists.</div>;
  }

  const artists = data?.data || [];
  const pageCount = data?.meta.totalPages || 0;

  console.log(data);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Artists</h2>
          <p className="text-muted-foreground">
            Manage your artists list here.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/artists/create">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={artists}
        searchKey="name"
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
