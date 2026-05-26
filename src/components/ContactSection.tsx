import { motion, AnimatePresence, useInView } from "motion/react";
import { Send, Mail, MapPin, Phone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, forwardRef, useCallback, useRef } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CanvasContactBackground } from "@/components/ui/canvas-contact-background";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const magneticBtn = useMagnetic(0.35);

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

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
      setIsSuccess(true);
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
      <div className="relative overflow-hidden" ref={sectionRef}>
        {/* Canvas Background */}
        {inView && (
          <div className="absolute inset-0 z-0 opacity-30" aria-hidden="true">
            <CanvasContactBackground />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)]" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[700px]">
          <SectionHeader
            badge="Kontakt"
            title="Napisz do"
            highlight="mnie"
            className="mb-12"
          />

          {/* Contact info — glass pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
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
                className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 backdrop-blur-md px-5 py-2.5 text-sm text-muted-foreground font-['Geist'] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-primary/30 hover:text-foreground hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="h-4 w-4 text-primary/70" strokeWidth={1.6} aria-hidden="true" />
                {text}
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                className="flex flex-col items-center justify-center gap-6 py-16 text-center"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="rounded-full bg-primary/10 p-6">
                    <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold font-['Geist'] text-foreground">Wiadomość wysłana!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Dziękuję za kontakt. Odpiszę najszybciej jak to możliwe.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuccess(false)}
                >
                  Wyślij kolejną wiadomość
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form-wrapper"
                className="relative rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-6 md:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {/* Decorative gradient glow */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px] pointer-events-none" />

                <motion.form
                  className="relative z-10 space-y-5"
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
                  <motion.div
                    animate={{ scale: focused === field.key ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id={field.key}
                      type={field.type}
                      autoComplete={field.autocomplete}
                      placeholder=" "
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors[field.key]}
                      aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                      state={errors[field.key] ? "error" : "default"}
                      onFocus={() => setFocused(field.key)}
                      onBlur={() => setFocused("")}
                      className="pt-5 pb-2 bg-[hsl(var(--hero-input))]"
                    />
                  </motion.div>
                  <label
                    htmlFor={field.key}
                    className={`absolute left-4 transition-all duration-200 font-['Geist'] pointer-events-none ${
                      focused === field.key || form[field.key]
                        ? "top-1.5 text-[10px] text-primary font-medium"
                        : "top-3.5 text-sm text-muted-foreground"
                    }`}
                  >
                    {field.label}
                    <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
                  </label>
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
              <motion.div
                animate={{ scale: focused === "message" ? 1.005 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  id="message"
                  placeholder=" "
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  state={errors.message ? "error" : "default"}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused("")}
                  className="pt-6 pb-2 bg-[hsl(var(--hero-input))]"
                />
              </motion.div>
              <label
                htmlFor="message"
                className={`absolute left-4 transition-all duration-200 font-['Geist'] pointer-events-none ${
                  focused === "message" || form.message
                    ? "top-1.5 text-[10px] text-primary font-medium"
                    : "top-4 text-sm text-muted-foreground"
                }`}
              >
                Wiadomość
                <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
              </label>
              {errors.message && (
                <p id="message-error" role="alert" className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.message}
                </p>
              )}
            </motion.div>

            <div
              ref={magneticBtn.ref as React.Ref<HTMLDivElement>}
              onMouseMove={magneticBtn.onMouseMove}
              onMouseLeave={magneticBtn.onMouseLeave}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.45)] transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                )}
                {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
              </Button>
            </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
});
ContactSection.displayName = "ContactSection";

export default ContactSection;
