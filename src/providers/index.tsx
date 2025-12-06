"use client";

export * from "./AppProvider";
export * from "./ProtocolProvider";

import { AppProvider } from "./AppProvider";
import { ProtocolProvider } from "./ProtocolProvider";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "dayjs/locale/en";
import "dayjs/locale/vi";

export const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

  return (
    <SessionProvider>
      <AppProvider>
        <ProtocolProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ProtocolProvider>
      </AppProvider>
    </SessionProvider>
  );
};
