import * as React from "react";

type SelectedItemContextType = {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
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
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  return (
    <SelectedItemContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        selectedDate,
        setSelectedDate,
      }}
    >
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
