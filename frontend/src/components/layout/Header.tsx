import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ai", label: "AI" },
  { to: "/profile", label: "Profile" },
];

export function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Signed out", description: "You have been logged out." });
    } catch {
      toast({ variant: "destructive", title: "Logout failed" });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="font-semibold md:hidden">
            Hackathon
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.full_name}
          </span>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => void handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t px-4 py-3 md:hidden">
          {mobileLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block rounded-md px-3 py-2 text-sm font-medium",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
