import React from 'react';
import { Button } from '@/components/ui/button';

export const StartupFailure = () => (
  <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="max-w-md space-y-4 text-center" role="alert">
      <h1 className="text-2xl font-semibold">This page couldn’t load</h1>
      <p className="text-muted-foreground">Please reload the page to try again.</p>
      <Button onClick={() => window.location.reload()}>Reload page</Button>
    </div>
  </main>
);

export class StartupErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Runtime] Page rendering failed', error, info.componentStack);
  }

  render() { return this.state.failed ? <StartupFailure /> : this.props.children; }
}