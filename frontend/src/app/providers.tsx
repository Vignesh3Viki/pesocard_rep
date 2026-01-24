import { BrowserRouter } from "react-router-dom";
import ToastProvider from "@/components/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Add global providers here (e.g., ThemeProvider, AuthProvider)
  return (
    <BrowserRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </BrowserRouter>
  );
}
