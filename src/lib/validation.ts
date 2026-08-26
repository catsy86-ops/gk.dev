export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Strips HTML tags and dangerous characters to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .trim();
}

/**
 * Standard email format validator (RFC 5322 standard regex).
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 150) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that an href does not use malicious pseudo-protocols like javascript: or vbscript: (OWASP A03 / DOM XSS).
 */
export function isSafeHref(href?: string | null): boolean {
  if (!href) return false;
  const trimmed = href.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("data:")
  ) {
    return false;
  }
  return true;
}

/**
 * Validates the contact form fields and returns an error map.
 */
export function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const trimmedName = data.name ? data.name.trim() : "";
  const trimmedEmail = data.email ? data.email.trim() : "";
  const trimmedMessage = data.message ? data.message.trim() : "";

  if (!trimmedName) {
    errors.name = "Imię jest wymagane";
  } else if (trimmedName.length < 2) {
    errors.name = "Imię musi mieć minimum 2 znaki";
  } else if (trimmedName.length > 80) {
    errors.name = "Imię nie może przekraczać 80 znaków";
  }

  if (!trimmedEmail) {
    errors.email = "Email jest wymagany";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Nieprawidłowy format email";
  }

  if (!trimmedMessage) {
    errors.message = "Wiadomość jest wymagana";
  } else if (trimmedMessage.length < 5) {
    errors.message = "Wiadomość musi mieć minimum 5 znaków";
  } else if (trimmedMessage.length > 4000) {
    errors.message = "Wiadomość nie może przekraczać 4000 znaków";
  }

  return errors;
}

