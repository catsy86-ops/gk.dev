import { motion } from "motion/react";
import { Send, Mail, MapPin, Phone, Loader2, AlertCircle } from "lucide-react";
import { useState, forwardRef, useCallback } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { toast } from "@/hooks/use-toast";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Imię jest wymagane";
  if (!data.email.trim()) errors.email = "Email jest wymagany";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Nieprawidłowy format email";
  if (!data.message.trim()) errors.message = "Wiadomość jest wymagana";
  return errors;
}

const ContactSection = forwardRef<HTMLElement>((_props, ref) => {
  const [focused, setFocused] = useState("");
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const magneticBtn = useMagnetic(0.35);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/xpwpkqdl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Form submission failed");
      toast({ title: "Wiadomość wysłana!", description: "Dziękuję za kontakt. Odpiszę najszybciej jak to możliwe." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({
        title: "Błąd wysyłania",
        description: "Coś poszło nie tak. Spróbuj ponownie później lub napisz bezpośrednio na gk@gkdev.pl",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  return (
    <SectionWrapper ref={ref} id="kontakt" label="Kontakt">
      <div className="mx-auto max-w-[700px]">
        <SectionHeader
          badge="Kontakt"
          title="Napisz do"
          highlight="mnie"
          className="mb-12"
        />

        {/* Contact info */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: Mail, text: "kontakt@gkdev.pl" },
            { icon: MapPin, text: "Warszawa, PL" },
            { icon: Phone, text: "+48 501 234 567" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground font-['Geist']"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              {text}
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formularz kontaktowy"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "name", label: "Imię", type: "text", autocomplete: "given-name" },
              { key: "email", label: "Email", type: "email", autocomplete: "email" },
            ] as const).map((field) => (
              <motion.div key={field.key} className="relative">
                <label
                  htmlFor={field.key}
                  className="block text-xs font-medium text-muted-foreground mb-1.5 font-['Geist']"
                >
                  {field.label}
                  <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
                </label>
                <motion.input
                  id={field.key}
                  type={field.type}
                  autoComplete={field.autocomplete}
                  placeholder={field.label}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                  className={`w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] focus-visible:ring-2 focus-visible:ring-primary ${
                    errors[field.key] ? "border-destructive" : "border-border focus:border-foreground/20"
                  }`}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused("")}
                  animate={{ scale: focused === field.key ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                {errors[field.key] && (
                  <p id={`${field.key}-error`} role="alert" className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    {errors[field.key]}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div className="relative">
            <label
              htmlFor="message"
              className="block text-xs font-medium text-muted-foreground mb-1.5 font-['Geist']"
            >
              Wiadomość
              <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
            </label>
            <motion.textarea
              id="message"
              placeholder="Wiadomość"
              rows={5}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none resize-none transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] ${
                errors.message ? "border-destructive" : "border-border focus:border-foreground/20"
              }`}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused("")}
              animate={{ scale: focused === "message" ? 1.005 : 1 }}
              transition={{ duration: 0.2 }}
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.message}
              </p>
            )}
          </motion.div>

          <motion.button
            ref={magneticBtn.ref as React.Ref<HTMLButtonElement>}
            onMouseMove={magneticBtn.onMouseMove}
            onMouseLeave={magneticBtn.onMouseLeave}
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground font-['Geist'] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            whileHover={isSubmitting ? {} : { scale: 1.03, opacity: 0.95 }}
            whileTap={isSubmitting ? {} : { scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            )}
            {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
          </motion.button>
        </motion.form>
      </div>
    </SectionWrapper>
  );
});
ContactSection.displayName = "ContactSection";

export default ContactSection;
