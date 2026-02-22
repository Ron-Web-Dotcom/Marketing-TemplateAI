/**
 * @fileoverview Lightweight client-side router context.
 *
 * Provides a {@link NavigationProvider} that tracks the current URL pathname
 * and a `navigate` function that uses the History API.  This avoids pulling
 * in a full routing library while supporting SPA-style navigation.
 *
 * @module contexts/NavigationContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/** Shape of the navigation context exposed to consumers. */
interface NavigationContextType {
  /** Current URL pathname (e.g. `/dashboard`). */
  currentRoute: string;
  /** Push a new entry onto the browser history and update the route. */
  navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Provides client-side routing to the component tree.
 *
 * Listens to the browser `popstate` event so the back / forward buttons
 * work correctly.  Call `navigate(path)` from any child to change routes.
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  /* Sync state when the user clicks the browser back / forward buttons. */
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Navigate to a new route using `history.pushState`.
   *
   * @param path - The pathname to navigate to (e.g. `/auth`).
   */
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook that returns the current navigation context.
 *
 * @throws {Error} If called outside of a {@link NavigationProvider}.
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
