// import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

interface SettingsProps {
  className?: string;
}

export function Settings({ className }: SettingsProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Light</span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              aria-label="Toggle dark mode"
            />
            <span className="text-sm">Dark</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">System Theme</h3>
            <p className="text-sm text-muted-foreground">
              Follow your system's theme preference
            </p>
          </div>
          <Switch
            checked={theme === "system"}
            onCheckedChange={(checked) => checked && setTheme("system")}
            aria-label="Use system theme"
          />
        </div>

        {/* You can add more settings options here */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Enable notification alerts
            </p>
          </div>
          <Switch aria-label="Toggle notifications" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Compact Mode</h3>
            <p className="text-sm text-muted-foreground">
              Show more content with less spacing
            </p>
          </div>
          <Switch aria-label="Toggle compact mode" />
        </div>
      </div>
    </div>
  );
}
