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

export function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!data.name.trim()) errors.name = "Imię jest wymagane";
  if (!data.email.trim()) errors.email = "Email jest wymagany";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Nieprawidłowy format email";
  if (!data.message.trim()) errors.message = "Wiadomość jest wymagana";
  return errors;
}
