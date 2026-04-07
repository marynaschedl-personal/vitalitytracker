import { Outlet } from "react-router-dom";
import BottomNav from "./ui/BottomNav";
import FeedbackButton from "./FeedbackButton";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <FeedbackButton />
    </div>
  );
}
