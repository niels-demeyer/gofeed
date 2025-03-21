import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useSelectedItem } from "@/context/selected-item-context";
import { DayClickEventHandler } from "react-day-picker";

export function DatePicker({
  date,
  onDateChange,
  onMultipleDatesChange,
}: {
  date?: Date;
  onDateChange?: (date: Date) => void;
  onMultipleDatesChange?: (dates: Date[]) => void;
}) {
  // Use context values as fallbacks if props aren't provided
  const { selectedDate, setSelectedDate } = useSelectedItem();

  // Use prop values if available, otherwise use context values
  const currentDate = date || selectedDate;
  const handleDateChange = onDateChange || setSelectedDate;

  // Track multiple selected dates
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

  // Initialize selected dates with the current date when component mounts
  React.useEffect(() => {
    if (currentDate && !selectedDates.some((d) => isSameDay(d, currentDate))) {
      setSelectedDates([currentDate]);
    }
  }, [currentDate]); // Only depend on currentDate, not selectedDates

  // Helper function to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Handle day selection with ctrl/meta key support
  const handleDayClick: DayClickEventHandler = (day, _, e) => {
    // Using _ for unused modifiers parameter
    if (!day) return;

    console.log("DatePicker: day selected:", day.toISOString());

    // Check if Ctrl or Meta key is pressed (for multi-select)
    const isMultiSelect = e?.ctrlKey || e?.metaKey;

    if (isMultiSelect) {
      // For multi-select, toggle the selected date
      const dateAlreadySelected = selectedDates.some((d) => isSameDay(d, day));

      let newDates: Date[];
      if (dateAlreadySelected) {
        // If already selected, remove it
        newDates = selectedDates.filter((d) => !isSameDay(d, day));
      } else {
        // If not selected, add it
        newDates = [...selectedDates, day];
      }

      // Update our local state first
      setSelectedDates(newDates);

      // Then notify about multiple dates if handler provided
      // Use setTimeout to move this out of the render phase
      if (onMultipleDatesChange) {
        setTimeout(() => {
          onMultipleDatesChange(newDates);
        }, 0);
      }
    } else {
      // For single select, just use the regular flow and update the current date
      setSelectedDates([day]);

      // Use setTimeout to move this out of the render phase
      setTimeout(() => {
        handleDateChange(day);
      }, 0);
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onDayClick={handleDayClick}
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
          key={`calendar-${currentDate?.getTime() || "default"}`}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
