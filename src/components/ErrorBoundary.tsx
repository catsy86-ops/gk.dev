import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Section name for better error messages */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches render errors in child components (SRP).
 * Prevents a single broken section from crashing the whole page.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd send this to Sentry / LogRocket etc.
    console.error(`[ErrorBoundary${this.props.section ? ` – ${this.props.section}` : ""}]`, error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          role="alert"
          aria-live="assertive"
          className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="h-8 w-8 text-destructive/60" strokeWidth={1.5} />
          <div>
            <p className="font-['Geist'] font-medium text-foreground">
              {this.props.section
                ? `Sekcja "${this.props.section}" nie mogła się załadować`
                : "Coś poszło nie tak"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Spróbuj odświeżyć stronę lub kliknij poniżej.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Spróbuj ponownie
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
