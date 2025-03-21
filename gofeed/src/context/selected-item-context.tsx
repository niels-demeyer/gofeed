import { createContext, useState, useContext, ReactNode } from "react";

type SelectedItemContextType = {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
};

const SelectedItemContext = createContext<SelectedItemContextType | undefined>(
  undefined
);

export function SelectedItemProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<string>("Personal");

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  );
}

export function useSelectedItem() {
  const context = useContext(SelectedItemContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedItem must be used within a SelectedItemProvider"
    );
  }
  return context;
}
