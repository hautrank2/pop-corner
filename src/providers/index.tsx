"use client";

export * from "./AppProvider";
export * from "./ProtocolProvider";

import { AppProvider } from "./AppProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { ProtocolProvider } from "./ProtocolProvider";

export const AllProviders = ({ children }: { children: React.ReactNode }) => {
  //#region Tanstack  React Query Config
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
      },
    },
  });
  //#endregion

  return (
    <AppProvider>
      <ProtocolProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ProtocolProvider>
    </AppProvider>
  );
};
