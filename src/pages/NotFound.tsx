import { motion } from "motion/react";
import { ArrowLeft, Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden px-6">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-primary/8 blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center max-w-md">
        {/* Ghost icon */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Ghost className="h-20 w-20 text-primary/60" strokeWidth={1.2} />
          </motion.div>
        </motion.div>

        {/* 404 number */}
        <motion.h1
          className="text-[8rem] leading-none font-bold tracking-tighter text-foreground/10 select-none"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-xl font-semibold text-foreground mt-2 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Strona nie istnieje
        </motion.p>
        <motion.p
          className="text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Wygląda na to, że ta strona zniknęła w cyfrowej próżni.
        </motion.p>

        {/* Back button */}
        <motion.button
          onClick={() => navigate("/")}
          className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)] transition-shadow hover:shadow-[0_6px_20px_0_hsl(var(--primary)/0.45)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Wróć na stronę główną
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
