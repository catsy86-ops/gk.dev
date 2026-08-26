import { useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { AnimatePresence, motion } from "motion/react";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { I18nProvider } from "@/components/I18nProvider";
import { ClerkAuthProvider } from "@/components/auth/ClerkAuthProvider";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import Index from "./pages/Index.tsx";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.5,
  ease: [0.25, 0.4, 0.25, 1],
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Index />
            </motion.div>
          }
        />
        <Route
          path="/sign-in"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Index initialAuthModal="sign-in" />
            </motion.div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Index initialAuthModal="sign-up" />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <NotFound />
              </motion.div>
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <ClerkAuthProvider>
          <TooltipProvider>
            <Toaster />
            <AnimatePresence>
              {loading && <LoadingScreen onComplete={handleComplete} />}
            </AnimatePresence>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ErrorBoundary section="Aplikacja">
                <AnimatedRoutes />
              </ErrorBoundary>
            </BrowserRouter>
            <PwaInstallPrompt />
            <GrainOverlay />
          </TooltipProvider>
        </ClerkAuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
