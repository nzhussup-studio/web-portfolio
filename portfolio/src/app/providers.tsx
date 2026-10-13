import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { BackgroundDataPreloader } from "./BackgroundDataPreloader";

const DATA_STALE_TIME = 5 * 60 * 1_000;

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: DATA_STALE_TIME,
          },
        },
      }),
  );

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <BackgroundDataPreloader />
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
}
