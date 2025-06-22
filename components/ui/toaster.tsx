// components/ui/toaster.tsx
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps, // Import ToastProps type
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        (
          { id, title, description, action, variant, ...props } // Added variant here
        ) => (
          <Toast key={id} variant={variant} {...props}>
            {" "}
            {/* Pass variant to Toast component */}
            <div className="grid gap-1">
              {" "}
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
