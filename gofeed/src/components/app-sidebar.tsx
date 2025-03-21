import * as React from "react";
import { Settings } from "lucide-react";
import { ClockTop } from "@/components/ClockTop";
import { DatePicker } from "@/components/date-picker";
import { useSelectedItem } from "@/context/selected-item-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  feeds: [
    {
      name: "My Feeds",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedItem, setSelectedItem, selectedDate, setSelectedDate } =
    useSelectedItem();

  // Track multiple selected dates
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

  // Helper function to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Initialize with the current context date
  React.useEffect(() => {
    if (
      selectedDate &&
      (!selectedDates.length ||
        !selectedDates.some((d) => isSameDay(d, selectedDate)))
    ) {
      setSelectedDates([selectedDate]);
    }
  }, [selectedDate]);

  // Function to handle item selection
  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  // Function to handle settings selection
  const handleSettingsClick = () => {
    setSelectedItem("Settings");
  };

  // Function to handle date changes (single date selection)
  const handleDateChange = (date: Date) => {
    // Update the context date state
    setSelectedDate(date);

    // Also ensure this date is in the selectedDates array
    if (!selectedDates.some((d) => isSameDay(d, date))) {
      // Replace the selectedDates array with just this date
      // This ensures we don't have unexpected behavior when switching
      // between single and multi select
      setSelectedDates([date]);
    }
  };

  // Function to handle multiple date selections
  const handleMultipleDatesChange = (dates: Date[]) => {
    // Update the multiple dates state
    setSelectedDates(dates);

    // If any dates are selected, update the context with the most appropriate date
    if (dates.length > 0) {
      // Options for which date to use as the "main" selected date:

      // Option 1: Use the most recent date
      const mostRecentDate = new Date(
        Math.max(...dates.map((date) => date.getTime()))
      );

      // Option 2: Use the earliest date
      // const earliestDate = new Date(
      //   Math.min(...dates.map(date => date.getTime()))
      // );

      // Option 3: Use today if it's selected, otherwise most recent
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // const todaySelected = dates.find(d => isSameDay(d, today));
      // const dateToUse = todaySelected || mostRecentDate;

      // Update the context with our chosen date
      setSelectedDate(mostRecentDate);
    }

    console.log(
      "Multiple dates selected:",
      dates.map((d) => d.toISOString())
    );
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b flex items-center justify-center">
        <ClockTop />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker
          date={selectedDate}
          onDateChange={handleDateChange}
          onMultipleDatesChange={handleMultipleDatesChange}
        />
        <SidebarSeparator className="mx-0" />
        <div className="px-2 py-2">
          {data.feeds.map((feed) => (
            <div key={feed.name} className="mb-4">
              <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
                {feed.name}
              </h3>
              <div className="space-y-1">
                {feed.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleItemClick(item)}
                    className={`w-full rounded-md px-4 py-2 text-left text-sm ${
                      selectedItem === item
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarSeparator className="mx-0 bg-center" />
            <SidebarMenuButton
              onClick={handleSettingsClick}
              className={
                selectedItem === "Settings"
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
