"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SmootherContextValue = {
  ready: boolean;
  markReady: () => void;
};

const SmootherContext = createContext<SmootherContextValue>({
  ready: false,
  markReady: () => {},
});

export function SmootherProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <SmootherContext.Provider value={{ ready, markReady }}>
      {children}
    </SmootherContext.Provider>
  );
}

export function useSmootherReady(): boolean {
  return useContext(SmootherContext).ready;
}

export function useMarkSmootherReady(): () => void {
  return useContext(SmootherContext).markReady;
}
