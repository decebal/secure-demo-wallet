"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@v1/ui/button";
import type { ButtonProps } from "@v1/ui/button";
import { Spinner } from "@/components/spinner";

export function SubmitButton({
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} {...props}>
      {pending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
