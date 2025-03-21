import * as React from "react";

type SelectedItemContextType = {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
};

const SelectedItemContext = React.createContext<
  SelectedItemContextType | undefined
>(undefined);

export function SelectedItemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItem, setSelectedItem] = React.useState<string>("Personal");

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  );
}

export function useSelectedItem() {
  const context = React.useContext(SelectedItemContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedItem must be used within a SelectedItemProvider"
    );
  }
  return context;
}
