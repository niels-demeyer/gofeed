import * as React from "react";
import { Plus, Settings } from "lucide-react";
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
  const { selectedItem, setSelectedItem } = useSelectedItem();

  // Function to handle item selection
  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  // Function to handle settings selection
  const handleSettingsClick = () => {
    setSelectedItem("Settings");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b flex items-center justify-center">
        <ClockTop />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
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
