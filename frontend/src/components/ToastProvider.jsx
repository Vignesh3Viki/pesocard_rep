import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
