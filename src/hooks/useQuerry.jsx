import { axios } from "@/config/axios";
import { useQueries, useQuery as RQuseQuery } from "@tanstack/react-query";


function fetchData(url, params = {}) {
  return axios.get(url, {
    params,
  });
}

export function useQuery(options, queryClient) {
  // Handle multiple queries
  if (Array.isArray(options)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQueries({
      queries: options.map((item) => ({
        ...item,
        queryKey: item.queryKey,
        queryFn: () =>
          fetchData(
            item.queryKey[0],
            typeof item.queryKey[1] === "object" ? item.queryKey[1] || {} : {}
          ),
      })),
    });
  }

  // Handle single query
  return RQuseQuery(
    {
      ...options,
      queryFn: () =>
        fetchData(
          options.queryKey[0],
          typeof options.queryKey[1] === "object"
            ? options.queryKey[1] || {}
            : {}
        ),
    },
    queryClient
  );
}
