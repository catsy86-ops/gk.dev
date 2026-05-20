import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionWrapper from "@/components/ui/SectionWrapper";

const faqs = [
  {
    question: "Jak wygląda proces współpracy?",
    answer:
      "Zaczynamy od rozmowy o Twoich potrzebach i celach. Następnie przygotowuję wycenę i harmonogram. Po akceptacji pracuję w sprintach, regularnie prezentując postępy i zbierając feedback.",
  },
  {
    question: "Ile kosztuje stworzenie aplikacji?",
    answer:
      "Cena zależy od skali projektu. Prosta strona to koszt od 3 000 zł, a rozbudowana aplikacja webowa od 15 000 zł. Każdy projekt wyceniam indywidualnie po poznaniu wymagań.",
  },
  {
    question: "Jak długo trwa realizacja projektu?",
    answer:
      "Prosta strona internetowa to 1–2 tygodnie. Aplikacja webowa średniej złożoności zajmuje 4–8 tygodni. Duże projekty enterprise mogą trwać 3–6 miesięcy.",
  },
  {
    question: "Czy oferujesz wsparcie po wdrożeniu?",
    answer:
      "Tak! Oferuję pakiety utrzymaniowe obejmujące aktualizacje, monitoring, poprawki błędów i rozwój nowych funkcji. Każdy klient otrzymuje też 30 dni bezpłatnego wsparcia po wdrożeniu.",
  },
  {
    question: "Jakie technologie wykorzystujesz?",
    answer:
      "Specjalizuję się w React, Next.js, TypeScript i Node.js. Na backendzie używam PostgreSQL, Redis i AWS. Do mobile — React Native i Flutter. Dobieram stack do potrzeb projektu.",
  },
  {
    question: "Czy mogę zobaczyć postępy w trakcie pracy?",
    answer:
      "Oczywiście. Każdy projekt ma dedykowane środowisko stagingowe, gdzie na bieżąco widzisz zmiany. Organizuję też cotygodniowe demo, żebyś zawsze był na bieżąco.",
  },
] as const;

const FaqSection = () => {
  return (
    <SectionWrapper id="faq" label="Często zadawane pytania" divider={false}>
      <div className="mx-auto max-w-[720px]">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block font-['Geist'] text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
            FAQ
          </span>
          <h2 className="font-['Geist'] text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Często zadawane{" "}
            <span className="font-['Instrument_Serif'] italic">pytania</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="rounded-xl border border-border bg-card/60 backdrop-blur-sm px-6 data-[state=open]:border-primary/20 transition-colors duration-300"
                >
                  <AccordionTrigger className="font-['Geist'] text-sm md:text-base font-medium text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-['Geist'] text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
