'use client';

// ============================================
// APP PROVIDERS
// ============================================

import React from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Create Query Client

// Create MUI Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a0a2e',
      light: '#2d1b4e',
      dark: '#0d051a',
    },
    secondary: {
      main: '#d4af37',
      light: '#f4d160',
      dark: '#a88c2c',
    },
    background: {
      default: '#faf8f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1, refetchOnWindowFocus: false } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a0a2e',
              color: '#fff',
              border: '1px solid #d4af37',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#1a0a2e',
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </MUIThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
