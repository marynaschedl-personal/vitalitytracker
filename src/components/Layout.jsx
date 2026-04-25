import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BottomNav from "./ui/BottomNav";
import ActionFAB from "./ActionFAB";

export default function Layout() {
  const { pathname } = useLocation();

  // Hide ActionFAB on specific routes
  const hideActionFab =
    ["/racion", "/measurements", "/settings"].includes(pathname) ||
    pathname.startsWith("/measurements/");

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
      {!hideActionFab && <ActionFAB />}
    </div>
  );
}
