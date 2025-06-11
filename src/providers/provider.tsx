'use client';
import { FC, ReactNode } from 'react';
import AuthProvider from './auth-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query';

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 5 minutes
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Prevent refetch when tab is focused
      refetchOnReconnect: true, // Refetch on network reconnect
      refetchIntervalInBackground: false, // Only refetch when visible
    },
    mutations: {
      retry: 1, 
    }
  }
}
const Provider: FC<{ children: ReactNode }> = ({ children }) => {
 const queryClient = new QueryClient(config)
  return (
    <QueryClientProvider client={queryClient} >

    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        {children}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
        </QueryClientProvider>
  );
};

export default Provider;