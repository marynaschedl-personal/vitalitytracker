import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { apiClient } from "@/api/apiClient";
import DashboardCard from "@/components/ui/DashboardCard";
import moment from "moment";

// Get all reports for current user
const getSubmittedReportsForUser = async () => {
  try {
    const allReports = await apiClient.entities.DailyReport.list();
    return allReports.filter((r) => r.submitted === true).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error loading submitted reports:", error);
    return [];
  }
};

const THEMES = [
  {
    id: "light",
    name: "Light",
    bg: "bg-white",
    description: "Clean and bright",
    cssVars: {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--card": "0 0% 96%",
      "--primary": "221 83% 53%",
    },
  },
  {
    id: "dark",
    name: "Dark",
    bg: "bg-slate-900",
    description: "Easy on the eyes",
    cssVars: {
      "--background": "224 71% 4%",
      "--foreground": "213 31% 91%",
      "--card": "224 64% 9%",
      "--primary": "217 91% 60%",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    bg: "bg-blue-50",
    description: "Calm and serene",
    cssVars: {
      "--background": "210 40% 96%",
      "--foreground": "210 40% 10%",
      "--card": "210 40% 90%",
      "--primary": "210 80% 50%",
    },
  },
  {
    id: "forest",
    name: "Forest",
    bg: "bg-green-50",
    description: "Natural and refreshing",
    cssVars: {
      "--background": "120 30% 95%",
      "--foreground": "120 30% 10%",
      "--card": "120 30% 88%",
      "--primary": "120 70% 45%",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    bg: "bg-orange-50",
    description: "Warm and energetic",
    cssVars: {
      "--background": "30 100% 96%",
      "--foreground": "30 80% 10%",
      "--card": "30 100% 88%",
      "--primary": "30 100% 55%",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    bg: "bg-indigo-950",
    description: "Deep and focused",
    cssVars: {
      "--background": "275 100% 8%",
      "--foreground": "275 50% 90%",
      "--card": "275 100% 15%",
      "--primary": "275 90% 60%",
    },
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [submittedReports, setSubmittedReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
    loadSubmittedReports();
  }, []);

  const loadSubmittedReports = async () => {
    try {
      const reports = await getSubmittedReportsForUser();
      setSubmittedReports(reports);
    } catch (error) {
      console.error("Error loading submitted reports:", error);
    } finally {
      setLoadingReports(false);
    }
  };

  const applyTheme = (themeId) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) {
      Object.entries(theme.cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem("theme", themeId);
    applyTheme(themeId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <DashboardCard className="mb-4">
        <h2 className="font-semibold mb-2">Theme</h2>
        <p className="text-xs text-muted-foreground mb-4">Choose your preferred app theme</p>
      </DashboardCard>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              currentTheme === theme.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-full h-20 rounded-lg mb-2 ${theme.bg}`} />
            <p className="font-medium text-sm">{theme.name}</p>
            <p className="text-xs text-muted-foreground">{theme.description}</p>
          </button>
        ))}
      </div>

      <DashboardCard className="mb-4">
        <h2 className="font-semibold mb-2">Saved Reports</h2>
        <p className="text-xs text-muted-foreground mb-4">Days you've submitted</p>
        {loadingReports ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : submittedReports.length > 0 ? (
          <div className="space-y-2">
            {submittedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{moment(report.date).format("ddd, MMM DD, YYYY")}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.steps || 0} steps • {report.calories_consumed || 0} kcal
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No saved reports yet</p>
        )}
      </DashboardCard>

      <button
        onClick={handleLogout}
        className="w-full py-3 bg-destructive/10 text-destructive rounded-2xl font-medium active:scale-[0.98] transition-transform"
      >
        Logout
      </button>
    </div>
  );
}
