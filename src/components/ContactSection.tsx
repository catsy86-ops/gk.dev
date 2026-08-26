import { motion, AnimatePresence, useInView } from "motion/react";
import { Send, Mail, MapPin, Phone, Loader2, AlertCircle, CheckCircle2, Calculator, FileCode } from "lucide-react";
import { useState, forwardRef, useCallback, useRef, lazy, Suspense } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CanvasContactBackground } from "@/components/ui/canvas-contact-background";
import { soundEngine } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { hapticSuccess, hapticWarning, hapticLight } from "@/lib/haptics";
import { validateForm, sanitizeInput, type ContactFormData, type ContactFormErrors } from "@/lib/validation";
import { useI18n } from "@/lib/i18n";
import { saveContactMessageToSupabase } from "@/lib/supabase";

const ProjectEstimatorModal = lazy(() =>
  import("@/components/ProjectEstimatorModal").then((m) => ({ default: m.ProjectEstimatorModal }))
);
const B2bProposalModal = lazy(() =>
  import("@/components/B2bProposalModal").then((m) => ({ default: m.B2bProposalModal }))
);

const ContactSection = forwardRef<HTMLElement>((_props, ref) => {
  const { t } = useI18n();
  const [focused, setFocused] = useState("");
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isB2bModalOpen, setIsB2bModalOpen] = useState(false);
  const lastSubmitTimeRef = useRef<number>(0);
  const magneticBtn = useMagnetic(0.35);

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot check (OWASP A04)
    if (honeypot.trim() !== "") {
      // Silently pretend success to fool malicious automated bots
      setIsSuccess(true);
      setForm({ name: "", email: "", message: "" });
      return;
    }

    // Client-side rate limiting / cooldown (5 seconds between submissions, bypassed in test mode)
    const now = Date.now();
    if (import.meta.env.MODE !== "test" && now - lastSubmitTimeRef.current < 5000) {
      toast({
        title: "Chwileczkę...",
        description: "Proszę odczekać kilka sekund przed ponownym wysłaniem wiadomości.",
      });
      return;
    }

    const validation = validateForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      hapticWarning();
      soundEngine.playPop(400, 0.05);
      return;
    }

    soundEngine.playClick();
    hapticLight();
    setIsSubmitting(true);
    lastSubmitTimeRef.current = now;

    // Sanitize payload before sending
    const sanitizedPayload: ContactFormData = {
      name: sanitizeInput(form.name),
      email: form.email.trim(),
      message: sanitizeInput(form.message),
    };

    try {
      const res = await fetch("https://formspree.io/f/xpwpkqdl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(sanitizedPayload),
      });
      if (!res.ok) throw new Error("Form submission failed");

      // Asynchronous record persistence in Supabase
      saveContactMessageToSupabase({
        name: sanitizedPayload.name,
        email: sanitizedPayload.email,
        message: sanitizedPayload.message,
      }).catch(() => {});

      setIsSuccess(true);
      soundEngine.playSuccess();
      hapticSuccess();
      triggerConfetti();
      toast({ title: t.contact.successTitle, description: t.contact.successDesc });
      setForm({ name: "", email: "", message: "" });
    } catch {
      hapticWarning();
      toast({
        title: "Błąd wysyłania / Error",
        description: "Spróbuj ponownie lub napisz na kontakt@gkdev.pl",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, honeypot, t.contact]);

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
            badge={t.contact.badge}
            title={t.contact.title}
            highlight={t.contact.highlight}
            className="mb-12"
          />

          {/* Contact info & SLA banner */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* SLA badge */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 font-mono text-xs text-emerald-500 font-medium shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.contact.sla}</span>
            </div>

            {/* Contact info — glass pills with copy */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("kontakt@gkdev.pl");
                  toast({ title: t.contact.emailCopiedTitle, description: t.contact.emailCopiedDesc });
                }}
                className="flex items-center gap-2.5 rounded-full border border-border/70 bg-card/70 backdrop-blur-md px-5 py-2 text-sm text-foreground font-['Geist'] shadow-sm hover:border-primary/40 hover:text-primary transition-all active:scale-95 cursor-pointer"
                title="Kliknij, aby skopiować email"
              >
                <Mail className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden="true" />
                <span>kontakt@gkdev.pl</span>
              </button>

              <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 backdrop-blur-md px-5 py-2 text-sm text-muted-foreground font-['Geist'] shadow-sm">
                <MapPin className="h-4 w-4 text-primary/70" strokeWidth={1.8} aria-hidden="true" />
                <span>Szczecin, PL</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 backdrop-blur-md px-5 py-2 text-sm text-muted-foreground font-['Geist'] shadow-sm">
                <Phone className="h-4 w-4 text-primary/70" strokeWidth={1.8} aria-hidden="true" />
                <span>+48 501 234 567</span>
              </div>
            </div>

            {/* Interactive B2B & Estimation Tools */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(800, 0.03);
                  setIsEstimatorOpen(true);
                }}
                className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>{t.contact.calcCta}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(800, 0.03);
                  setIsB2bModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 hover:bg-card px-4 py-2 text-xs font-bold text-foreground transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <FileCode className="h-3.5 w-3.5 text-primary" />
                <span>{t.contact.rfpCta}</span>
              </button>
            </div>
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
                  <h3 className="text-xl font-semibold font-['Geist'] text-foreground">{t.contact.successTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t.contact.successDesc}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuccess(false)}
                >
                  {t.contact.sendAnother}
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
                  {/* Anti-spam honeypot field (OWASP A04: traps automated bots) */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="sr-only absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Topic Selector Chips */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground/80 font-['Geist'] flex items-center gap-1.5">
                        <span>{t.contact.topicLabel}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEstimatorOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-1 font-mono text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>{t.contact.calcTitle}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.contact.topics.map((topic) => {
                        const isSelected = form.message.includes(`[${topic}]`);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => {
                              const cleanMessage = form.message.replace(/^\[.*?\]\s*/, "");
                              updateField("message", `[${topic}] ${cleanMessage}`);
                            }}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                                : "border-border/70 bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { key: "name", label: t.contact.nameLabel, type: "text", autocomplete: "given-name" },
                { key: "email", label: t.contact.emailLabel, type: "email", autocomplete: "email" },
              ] as const).map((field) => (
                <motion.div key={field.key} className="relative">
                  <motion.div
                    animate={{ scale: focused === field.key ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id={field.key}
                      name={field.key}
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
                  name="message"
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
                {t.contact.messageLabel}
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
              className="pt-2"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                whileHover={isSubmitting ? {} : { scale: 1.03 }}
                whileTap={isSubmitting ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600 px-9 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_4px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_10px_35px_rgba(59,130,246,0.65)] border border-white/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Shimmer light beam on hover */}
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none -skew-x-12"
                  animate={{ translateX: ["-150%", "250%"] }}
                  transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 2.5, ease: "easeInOut" }}
                />

                {isSubmitting ? (
                  <Loader2 className="relative z-10 h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Send className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" strokeWidth={2} aria-hidden="true" />
                )}
                <span className="relative z-10">{isSubmitting ? t.contact.sending : t.contact.send}</span>
              </motion.button>
            </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Project Estimator Modal */}
      {isEstimatorOpen && (
        <Suspense fallback={null}>
          <ProjectEstimatorModal
            isOpen={isEstimatorOpen}
            onClose={() => setIsEstimatorOpen(false)}
            onApplyEstimate={(summary) => {
              updateField("message", summary);
              toast({
                title: t.contact.calcApplied,
                description: t.contact.sla,
              });
            }}
          />
        </Suspense>
      )}

      {/* B2B Proposal & Brief Generator Modal */}
      {isB2bModalOpen && (
        <Suspense fallback={null}>
          <B2bProposalModal
            isOpen={isB2bModalOpen}
            onClose={() => setIsB2bModalOpen(false)}
            onApplyToContact={(message) => {
              updateField("message", message);
              toast({
                title: t.contact.briefApplied,
                description: t.contact.sla,
              });
            }}
          />
        </Suspense>
      )}
    </SectionWrapper>
  );
});
ContactSection.displayName = "ContactSection";

export default ContactSection;
