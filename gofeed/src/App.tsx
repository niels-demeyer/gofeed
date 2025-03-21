import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SelectedItemProvider,
  useSelectedItem,
} from "@/context/selected-item-context";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useParams,
  Outlet,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { Settings } from "@/components/Settings";

// Helper function to format dates for URL
function formatDateForUrl(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// Helper function to parse dates from URL
function parseDatesFromUrl(dateStr: string): Date[] {
  return dateStr
    .split(",")
    .filter(Boolean)
    .map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date;
    });
}

function AppHeader() {
  const { selectedItem, selectedDate } = useSelectedItem();
  const formattedDate =
    selectedDate && selectedItem !== "settings"
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          selectedDate
        )
      : "";

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{selectedItem}</BreadcrumbPage>
          </BreadcrumbItem>
          {selectedDate && selectedItem !== "settings" && (
            <BreadcrumbItem>
              <BreadcrumbPage>{formattedDate}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

function ItemContent() {
  const { itemId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const { setSelectedItem, selectedItem, setSelectedDate } = useSelectedItem();
  const hasUpdatedSelectedItem = useRef(false);
  const hasUpdatedDates = useRef(false);

  useEffect(() => {
    // Only update selected item on initial mount or when itemId changes
    if (itemId && itemId !== selectedItem && !hasUpdatedSelectedItem.current) {
      setSelectedItem(itemId);
      hasUpdatedSelectedItem.current = true;

      // If we're switching to settings, clear the selected date
      if (itemId === "settings") {
        setSelectedDate(null);
      }
    }

    // Handle date parameters - only if not on settings page
    if (dateParam && !hasUpdatedDates.current && itemId !== "settings") {
      try {
        const dates = parseDatesFromUrl(dateParam);
        if (dates.length > 0) {
          // Set the first date as the primary selected date
          setSelectedDate(dates[0]);
          hasUpdatedDates.current = true;
        }
      } catch (e) {
        console.error("Error parsing dates from URL:", e);
      }
    }
  }, [itemId, dateParam, setSelectedItem, setSelectedDate, selectedItem]);

  // Special case for settings
  if (itemId === "settings") {
    return <Settings />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}

function Root() {
  const { selectedItem, selectedDate } = useSelectedItem();
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);
  const [searchParams] = useSearchParams();

  // Handle navigation based on selected item and date changes
  useEffect(() => {
    if (isNavigatingRef.current) return;

    // Special case for settings - don't include date parameter
    if (selectedItem === "settings") {
      if (location.pathname !== "/settings") {
        isNavigatingRef.current = true;
        navigate("/settings", { replace: true });

        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }
      return;
    }

    const currentDateParam = searchParams.get("date");
    let newDateParam = currentDateParam;

    // If we have a selected date and it's different from the current URL
    if (selectedDate) {
      const formattedDate = formatDateForUrl(selectedDate);
      if (currentDateParam !== formattedDate) {
        newDateParam = formattedDate;
      }
    }

    // Build the new URL with item and date parameters
    const newPath = selectedItem ? `/${selectedItem}` : "/home";
    const newUrl = newDateParam ? `${newPath}?date=${newDateParam}` : newPath;

    if (
      `${location.pathname}${location.search}` !== newUrl &&
      !isNavigatingRef.current
    ) {
      // Set flag to prevent re-navigation
      isNavigatingRef.current = true;
      navigate(newUrl, { replace: true });

      // Reset flag after navigation
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    }
  }, [
    selectedItem,
    selectedDate,
    navigate,
    location.pathname,
    location.search,
    searchParams,
  ]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

function RedirectToHome() {
  const { selectedItem, selectedDate } = useSelectedItem();

  // Special case for settings
  if (selectedItem === "settings") {
    return <Navigate to="/settings" replace />;
  }

  const basePath = selectedItem ? `/${selectedItem}` : "/home";

  // Add date query parameter if available
  const dateQuery = selectedDate
    ? `?date=${formatDateForUrl(selectedDate)}`
    : "";

  return <Navigate to={`${basePath}${dateQuery}`} replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <RedirectToHome /> },
      { path: ":itemId", element: <ItemContent /> },
      { path: "home", element: <ItemContent /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SelectedItemProvider>
        <RouterProvider router={router} />
      </SelectedItemProvider>
    </ThemeProvider>
  );
}
