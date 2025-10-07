import {
  queryOptions,
  DefaultError,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  QueryKey,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { getApi } from "@/lib/http/api";

export interface PaginatedResponse<TItem> {
  items: TItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface ResourceFactoryConfig {
  basePath: string;
}

type CreateQuery<TData> = {
  id: string | undefined;
  subKey: string;
  subPath: string;
  params?: Record<string, any>;
  extraOptions?: Partial<
    Omit<
      UndefinedInitialDataOptions<TData, DefaultError, TData, QueryKey>,
      "queryKey" | "queryFn"
    >
  >;
};

export function makeResourceQueryFactory(config: ResourceFactoryConfig) {
  const { basePath } = config;

  const key = (id?: string, subKey?: string, extra?: any) =>
    [basePath, id, subKey, extra].filter(Boolean);

  const endpoint = (id?: string, subPath?: string) =>
    `/${basePath}${id ? `/${id}` : ""}${subPath ? `/${subPath}` : ""}` as const;

  function createQuery<TData = unknown>({
    id,
    subKey,
    subPath,
    params,
    extraOptions,
  }: CreateQuery<TData>) {
    return queryOptions({
      queryKey: key(id, subKey, params),
      queryFn: async () => {
        const result = await getApi<TData>(endpoint(id, subPath), { params });
        return result;
      },
      placeholderData: keepPreviousData,
      ...extraOptions,
    });
  }

  return { key, endpoint, createQuery };
}
