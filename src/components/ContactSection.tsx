import { motion } from "motion/react";
import { Send, Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, forwardRef, useCallback } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { toast } from "@/hooks/use-toast";

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
      // Simulate API call — replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({ title: "Wiadomość wysłana!", description: "Dziękuję za kontakt. Odpiszę najszybciej jak to możliwe." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({
        title: "Błąd wysyłania",
        description: "Coś poszło nie tak. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  return (
    <section ref={ref} className="relative z-10 bg-background py-28 px-6 overflow-hidden" id="kontakt">
      {/* Top line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.1), transparent)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <div className="mx-auto max-w-[700px]">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground font-['Geist'] mb-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Kontakt
          </motion.span>

          <motion.h2
            className="font-['Geist'] font-medium tracking-[-0.03em] text-foreground text-4xl md:text-5xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Napisz do{" "}
            <motion.span
              className="font-['Instrument_Serif'] italic text-5xl md:text-6xl inline-block"
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              mnie
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: Mail, text: "GK@example.com" },
            { icon: MapPin, text: "Warszawa, PL" },
            { icon: Phone, text: "+48 123 456 789" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground font-['Geist']"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05, color: "hsl(var(--foreground))" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} />
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
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "name", label: "Imię", type: "text" },
              { key: "email", label: "Email", type: "email" },
            ] as const).map((field) => (
              <motion.div key={field.key} className="relative">
                <motion.input
                  type={field.type}
                  placeholder={field.label}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className={`w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] ${
                    errors[field.key] ? "border-destructive" : "border-border focus:border-foreground/20"
                  }`}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused("")}
                  animate={{ scale: focused === field.key ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                {errors[field.key] && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[field.key]}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div className="relative">
            <motion.textarea
              placeholder="Wiadomość"
              rows={5}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              className={`w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-['Geist'] text-foreground placeholder:text-muted-foreground/60 outline-none resize-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] ${
                errors.message ? "border-destructive" : "border-border focus:border-foreground/20"
              }`}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused("")}
              animate={{ scale: focused === "message" ? 1.005 : 1 }}
              transition={{ duration: 0.2 }}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
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
            className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground font-['Geist'] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={isSubmitting ? {} : { scale: 1.03, opacity: 0.95 }}
            whileTap={isSubmitting ? {} : { scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
            ) : (
              <Send className="h-4 w-4" strokeWidth={1.8} />
            )}
            {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
});
ContactSection.displayName = "ContactSection";

export default ContactSection;
