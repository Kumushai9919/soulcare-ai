import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type LayoutContextType = {
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [showFooter, setShowFooter] = useState(true);

  return (
    <LayoutContext.Provider value={{ showFooter, setShowFooter }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within LayoutProvider');
  return context;
};
