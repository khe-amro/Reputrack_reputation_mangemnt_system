import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Menu, X, User, LogOut, Building2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    if (role === "business_owner") return "/business";
    return "/my-reviews";
  };

  const getDashboardLabel = () => {
    if (role === "admin") return "Admin Dashboard";
    if (role === "business_owner") return "Business Dashboard";
    return "My Reviews";
  };

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">RepuTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/companies"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse Companies
          </Link>
          <Link
            to="/auth/register?type=business"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            For Business
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role?.replace("_", " ") || "User"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {getDashboardLabel()}
                  </Link>
                </DropdownMenuItem>
                {role === "business_owner" && (
                  <DropdownMenuItem asChild>
                    <Link to="/business/reviews" className="cursor-pointer">
                      <Building2 className="mr-2 h-4 w-4" />
                      Manage Reviews
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/companies"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Companies
            </Link>
            <Link
              to="/auth/register?type=business"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role?.replace("_", " ") || "User"}
                    </p>
                  </div>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {getDashboardLabel()}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
