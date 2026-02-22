/**
 * @fileoverview Application entry point.
 *
 * Bootstraps the React application by mounting the root {@link App} component
 * inside React.StrictMode and a global {@link ErrorBoundary}.
 *
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

/** Mount the root React tree into the DOM node with id "root". */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
