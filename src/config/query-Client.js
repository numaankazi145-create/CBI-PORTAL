import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError(error) {
        console.log(error);

        if (error?.response?.data?.msg) {
          //   toast.error(error.response.data.msg);
        } else {
          //   toast.error("Something went wrong");
        }
      },
    },
  },
});
