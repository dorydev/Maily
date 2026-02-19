import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from "../components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo?: ErrorInfo, reset?: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  resetErrorBoundary?: () => void;
}

function ErrorFallback({ error, errorInfo, resetErrorBoundary }: ErrorFallbackProps) {
  const isDev = typeof import.meta !== "undefined" && (import.meta as any).env?.DEV;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border bg-accent px-4 py-3 text-accent-foreground shadow-sm"
    >
      <span className="mt-0.5 select-none" aria-hidden>
        ⚠️
      </span>
      <div className="min-w-0">
        <div className="font-semibold">An error occurred</div>
        <div className="text-sm text-red-800/90">{error.message || "Unexpected error."}</div>

        {isDev && errorInfo?.componentStack && (
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md borde bg-accent/60 p-2 text-xs text-accent-foreground">
            {errorInfo.componentStack}
          </pre>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              resetErrorBoundary?.();
            }}
          >
            Try again
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              window.location.assign("/");
            }}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError && error) {
      if (this.props.fallback) {
        return this.props.fallback(error, errorInfo, this.resetErrorBoundary);
      }

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
