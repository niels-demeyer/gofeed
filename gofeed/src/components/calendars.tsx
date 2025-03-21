import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useSelectedItem } from "@/context/selected-item-context";
import { DatePicker } from "@/components/date-picker"; // Import the DatePicker component

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function Calendars({
  calendars,
  date,
  onDateChange,
}: {
  calendars: {
    name: string;
    items: string[];
  }[];
  date?: Date;
  onDateChange?: (date: Date) => void;
}) {
  // Use context values as fallbacks if props aren't provided
  const { selectedDate, setSelectedDate } = useSelectedItem();

  // LOCAL state for the calendar - this is crucial for proper updating
  const [localSelectedDate, setLocalSelectedDate] = React.useState<Date>(
    date || selectedDate || new Date()
  );

  // Handle external date changes (from props or context)
  React.useEffect(() => {
    if (date && date.getTime() !== localSelectedDate.getTime()) {
      setLocalSelectedDate(date);
    } else if (
      selectedDate &&
      selectedDate.getTime() !== localSelectedDate.getTime()
    ) {
      setLocalSelectedDate(selectedDate);
    }
  }, [date, selectedDate, localSelectedDate]);

  // Track the selected index for visual feedback
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );

  // Function to update both local state and external state
  const updateDate = React.useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;

      // Update local state first
      setLocalSelectedDate(newDate);

      // Then propagate changes outward
      if (onDateChange) {
        onDateChange(newDate);
      } else {
        setSelectedDate(newDate);
      }

      console.log("Calendars: Date updated to:", newDate.toISOString());
    },
    [onDateChange, setSelectedDate]
  );

  // Handle date change with a callback to ensure it's properly processed
  const handleItemClick = React.useCallback(
    (calendar: string, item: string, index: number) => {
      const itemId = `${calendar}-${item}`;
      setSelectedItemId(itemId);

      // Create a new date object based on today
      const newDate = new Date();

      // Modify the date based on the item selection
      // This example adds days to today, modify as needed
      newDate.setDate(newDate.getDate() + index);

      console.log(
        "Calendars: Item clicked, changing date to:",
        newDate.toISOString()
      );

      // Update the date through our central function
      updateDate(newDate);
    },
    [updateDate]
  );

  // Helper to determine if an item should be active
  const isItemActive = (calendarName: string, item: string) => {
    return selectedItemId === `${calendarName}-${item}`;
  };

  return (
    <>
      {/* Use the DatePicker component */}
      <DatePicker date={localSelectedDate} onDateChange={updateDate} />

      {calendars.map((calendar, calendarIndex) => (
        <React.Fragment key={calendar.name}>
          <SidebarGroup key={calendar.name} className="py-0">
            <Collapsible
              defaultOpen={calendarIndex === 0}
              className="group/collapsible"
            >
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
              >
                <CollapsibleTrigger>
                  {calendar.name}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {calendar.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          onClick={() =>
                            handleItemClick(calendar.name, item, itemIndex)
                          }
                        >
                          <div
                            data-active={isItemActive(calendar.name, item)}
                            className="group/calendar-item border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border"
                          >
                            <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                          </div>
                          {item}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
