import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import './portal.css';
import './catalog.css';

class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Portal render failed', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <main className="app-fatal-error" role="alert">
        <span className="eyebrow">Workspace unavailable</span>
        <h1>The portal could not render this page.</h1>
        <p>{this.state.error.message || 'An unexpected interface error occurred.'}</p>
        <button className="pill pill-mint" onClick={() => window.location.reload()}>Reload portal</button>
      </main>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AppErrorBoundary>,
);
