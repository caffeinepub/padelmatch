import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  onClose?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary for Sheet content that catches render errors and shows
 * an inline error state without taking down the entire app.
 */
export default class InlineSheetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sheet content error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleClose = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onClose?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Error al cargar filtros</h3>
            <p className="text-sm text-muted-foreground">
              Ocurrió un problema al mostrar los filtros.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.handleClose}>
              Cerrar
            </Button>
            <Button onClick={this.handleRetry}>
              Reintentar
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
