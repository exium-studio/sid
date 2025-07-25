import { useEffect, useRef, useState } from "react";
import useRenderTrigger from "../context/useRenderTrigger";
import useRequest from "./useRequest";
import { arrayType } from "@/utils/arrayType";

interface Props<T> {
  initialData?: T;
  url?: string;
  method?: string;
  payload?: any;
  dependencies?: any[];
  conditions?: boolean;
  noRt?: boolean;
  initialPage?: number;
  initialLimit?: number;
  intialOffset?: number;
  dataResource?: boolean;
  // withLimit?: boolean;
  // withPagination?: boolean;
}

const useDataState = <T = any>(props: Props<T>) => {
  // Props
  const {
    initialData,
    payload,
    url,
    method,
    dependencies = [],
    conditions = true,
    noRt = false,
    initialPage = 1,
    initialLimit = 10,
    intialOffset = 0,
    dataResource = true,
  } = props;

  // States
  const [data, setData] = useState<T | undefined>(initialData);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(intialOffset);
  const [pagination, setPagination] = useState<any>(undefined);
  const { rt } = useRenderTrigger();
  const { req, response, loading, error, status } = useRequest({
    id: url || "data-state",
    showLoadingToast: false,
    showErrorToast: false,
    showSuccessToast: false,
  });
  const payloadData = {
    ...payload,
    limit,
    page,
  };

  const baseConfig = {
    url: `${url}${`?page=${page}`}`,
    method,
    data: payloadData,
    params: payloadData,
  };

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestUrlRef = useRef<string | null>(null);

  // Utils
  function makeRequest() {
    if (!url) return;

    latestUrlRef.current = url;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const config = {
      ...baseConfig,
      signal: abortController.signal,
    };

    const currentUrl = url;

    // setData(undefined);

    // Delay microtask untuk memastikan ini benar url terbaru
    Promise.resolve().then(() => {
      if (latestUrlRef.current !== currentUrl) {
        return; // Skip if outdated
      }

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            setData(
              dataResource
                ? arrayType(r?.data?.data) === "array"
                  ? r?.data?.data
                  : r?.data?.data?.data
                : r?.data?.data
            );
            setPagination(r?.data?.data?.pagination);
            setInitialLoading(false);
          },
          onError: () => {
            setInitialLoading(false);
          },
        },
      });
    });
  }
  function loadMore() {
    setLoadingLoadMore(true);

    const config = {
      ...baseConfig,
    };
    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newData = data
            ? [...(data as any[]), ...r?.data?.data]
            : r?.data?.data;
          setData(newData);
          setPagination(r?.data?.pagination);
          setLoadingLoadMore(false);
        },
      },
    });
  }

  // Handle request via useEffect
  useEffect(() => {
    if (!conditions || !url) return;

    const timeout = setTimeout(() => {
      makeRequest();
    }, 50);

    return () => {
      clearTimeout(timeout);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    conditions,
    url,
    page,
    limit,
    ...(noRt ? [] : [rt]),
    ...(dependencies || []),
  ]);

  // Handle set initial limit
  useEffect(() => {
    setLimit(initialLimit);
  }, [initialLimit]);

  return {
    makeRequest,
    data,
    setData,
    initialLoading,
    setInitialLoading,
    loading,
    error,
    loadMore,
    loadingLoadMore,
    setLoadingLoadMore,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    offset,
    setOffset,
    response,
    status,
  };
};

export default useDataState;
