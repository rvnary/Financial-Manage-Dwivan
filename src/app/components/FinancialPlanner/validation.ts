import type { FormData } from "./types";
import { validationMessages } from "./constants";

export const handleInvalid =
  (field: keyof FormData) => (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.setCustomValidity(validationMessages[field] || "Wajib diisi");
  };

export const clearCustomValidity = (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.setCustomValidity("");
};
