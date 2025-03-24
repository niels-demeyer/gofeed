import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SettingsProps {
  className?: string;
}

interface ThemeSettings {
  theme: "light" | "dark" | "system";
}

const fetchSettings = async (): Promise<ThemeSettings> => {
  const response = await fetch("http://localhost:8080/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
};

const updateSettings = async (theme: ThemeSettings["theme"]): Promise<ThemeSettings> => {
  const response = await fetch("http://localhost:8080/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });
  if (!response.ok) {
    throw new Error("Failed to update settings");
  }
  return response.json();
};

export function Settings({ className }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  
  // Fetch theme from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    onSuccess: (data: ThemeSettings) => {
      // Sync local theme state with backend
      setTheme(data.theme);
    }
  });
  
  // Update theme mutation
  const { mutate } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Invalidate and refetch settings query
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
  
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    mutate(newTheme);
  };
  
  const handleSystemThemeChange = (checked: boolean) => {
    if (checked) {
      setTheme("system");
      mutate("system");
    }
  };

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {(error as Error).message}</div>;

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
              onCheckedChange={handleThemeChange}
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
            onCheckedChange={handleSystemThemeChange}
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
      </div>
    </div>
  );
}