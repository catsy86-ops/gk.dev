import { motion } from "motion/react";
import { Code2, Database, Cloud, Smartphone, Layout, GitBranch } from "lucide-react";
import { useState, memo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const skills = [
  {
    icon: Code2,
    title: "Frontend",
    description: "React, Next.js, TypeScript, Tailwind CSS — tworzę szybkie i responsywne interfejsy.",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Database,
    title: "Backend",
    description: "Node.js, Python, PostgreSQL, REST & GraphQL API — solidne fundamenty każdej aplikacji.",
    gradient: "from-emerald-500/10 to-green-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "AWS, Docker, CI/CD, Vercel — automatyzacja wdrożeń i skalowalna infrastruktura.",
    gradient: "from-purple-500/10 to-violet-500/10",
  },
  {
    icon: Smartphone,
    title: "Aplikacje mobilne",
    description: "React Native i Flutter — natywne doświadczenia na iOS i Androidzie.",
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    description: "Figma, prototypowanie, systemy projektowe — projekty zorientowane na użytkownika.",
    gradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    icon: GitBranch,
    title: "Architektura",
    description: "Mikroserwisy, monorepo, clean code — skalowalne rozwiązania dla zespołów.",
    gradient: "from-indigo-500/10 to-sky-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
      delay: 0.3,
    },
  },
};

const SkillCard = memo(({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative rounded-2xl border border-border bg-card overflow-hidden"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      style={{ perspective: 800 }}
    >
      {/* Animated gradient bg on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${skill.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, transparent 50%)",
        }}
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "200%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Glowing border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
        animate={{
          boxShadow: isHovered
            ? "inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 30px -5px rgba(100,100,100,0.15)"
            : "inset 0 0 0 1px rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-7">
        {/* Animated icon */}
        <motion.div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground"
          variants={iconVariants}
          whileHover={{
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.5 },
          }}
        >
          <skill.icon className="h-5 w-5" strokeWidth={1.8} />
        </motion.div>

        <motion.h3
          className="font-['Geist'] font-medium text-foreground text-lg mb-2 tracking-[-0.01em]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.4, duration: 0.5 }}
        >
          {skill.title}
        </motion.h3>

        <motion.p
          className="font-['Geist'] text-sm text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.5, duration: 0.5 }}
        >
          {skill.description}
        </motion.p>

        {/* Animated underline */}
        <motion.div
          className="mt-4 h-[2px] bg-foreground/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-foreground/30 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});
SkillCard.displayName = "SkillCard";

const SkillsSection = () => {
  return (
    <SectionWrapper id="umiejetnosci" label="Umiejętności">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          badge="Czym się zajmuję"
          title="Moje"
          highlight="umiejętności"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {skills.map((skill, i) => (
            <SkillCard key={skill.title} skill={skill} index={i} />
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default SkillsSection;
