import { Component, type ReactNode } from 'react';

/** Keeps one broken game from taking down the whole app. */
export class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Screen crashed:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default ErrorBoundary;
