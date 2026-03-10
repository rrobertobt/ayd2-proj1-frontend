import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FetchError } from "ofetch";
import { toast } from "vue-sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fetchErrorHandler(error: unknown) {
  if (error instanceof FetchError) {
    toast.error(
      error.data?.message || "Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo."
    )
  } else if (error instanceof Error) {
    toast.error(error.message || "Ocurrió un error inesperado. Por favor, intenta de nuevo.")
  } else {
    toast.error("Ocurrió un error desconocido. Por favor, intenta de nuevo.")
  }
}
