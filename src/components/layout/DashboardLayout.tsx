import { Link, useLocation, useNavigate } from "react-router-dom";
import { Star, LayoutDashboard, MessageSquare, Settings, Building2, Users, LogOut, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "customer" | "business" | "admin";
}

const navigationItems = {
  customer: [
    { name: "My Reviews", href: "/my-reviews", icon: MessageSquare },
  ],
  business: [
    { name: "Dashboard", href: "/business", icon: LayoutDashboard },
    { name: "Reviews", href: "/business/reviews", icon: MessageSquare },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  ],
};

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, loading, signOut } = useAuth();
  const items = navigationItems[userType];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/20" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
              </div>
              <span>RepuTrack</span>
            </Link>
          </div>

          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                  {role === "admin" && <Shield className="h-3 w-3" />}
                  {role?.replace("_", " ") || "User"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
                  </div>
                  <span>RepuTrack</span>
                </Link>
              </div>

              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role?.replace("_", " ") || "User"}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    handleSignOut();
                    setSidebarOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
            </div>
            <span>RepuTrack</span>
          </Link>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
