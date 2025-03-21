// import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useSelectedItem } from "@/context/selected-item-context";

export function DatePicker({
  date,
  onDateChange,
}: {
  date?: Date;
  onDateChange?: (date: Date) => void;
}) {
  // Use context values as fallbacks if props aren't provided
  const { selectedDate, setSelectedDate } = useSelectedItem();

  // Use prop values if available, otherwise use context values
  const currentDate = date || selectedDate;
  const handleDateChange = onDateChange || setSelectedDate;

  // Handle day selection
  const handleSelect = (day: Date | undefined) => {
    if (day) {
      console.log("DatePicker: day selected:", day.toISOString());
      handleDateChange(day);
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleSelect}
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
          key={`calendar-${currentDate?.getTime() || "default"}`}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
