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
} from "react-router-dom";
import { useEffect, useRef } from "react";

function AppHeader() {
  const { selectedItem } = useSelectedItem();

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{selectedItem}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

function ItemContent() {
  const { itemId } = useParams();
  const { setSelectedItem, selectedItem } = useSelectedItem();
  const hasUpdatedSelectedItem = useRef(false);

  useEffect(() => {
    // Only update selected item on initial mount or when itemId changes
    if (itemId && itemId !== selectedItem && !hasUpdatedSelectedItem.current) {
      setSelectedItem(itemId);
      hasUpdatedSelectedItem.current = true;
    }
  }, [itemId, setSelectedItem, selectedItem]);

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
  const { selectedItem } = useSelectedItem();
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  // Handle navigation based on selected item changes
  useEffect(() => {
    if (
      selectedItem &&
      location.pathname !== `/${selectedItem}` && // Updated path check
      !isNavigatingRef.current
    ) {
      // Set flag to prevent re-navigation
      isNavigatingRef.current = true;
      navigate(`/${selectedItem}`, { replace: true }); // Updated navigation path

      // Reset flag after navigation
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    }
  }, [selectedItem, navigate, location.pathname]);

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
  const { selectedItem } = useSelectedItem();
  return (
    <Navigate to={selectedItem ? `/${selectedItem}` : "/home"} replace /> // Updated redirect path
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <RedirectToHome /> },
      { path: ":itemId", element: <ItemContent /> }, // Updated route path
      { path: "home", element: <ItemContent /> },
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
