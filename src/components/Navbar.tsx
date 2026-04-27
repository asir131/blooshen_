import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SmartSearchBar from "@/components/SmartSearchBar";
import autowurxLogo from "@/assets/autowurx-logo.png";
import { Menu, X, Car, Wrench, Store, Key, Users, CalendarDays, Search, LayoutDashboard, HelpCircle, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Cars for Sale", to: "/cars-for-sale", icon: Car },
  { label: "Parts & Accessories", to: "/parts-accessories", icon: Wrench },
  { label: "Service Providers", to: "/service-providers", icon: Store },
  { label: "Rentals", to: "/rentals", icon: Key },
  { label: "Reviews & Ratings", to: "/reviews", icon: Users },
  { label: "Events & Meetups", to: "/events", icon: CalendarDays },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-14 md:h-16 items-center justify-between gap-3">
          {/* Logo */}
          <a href="/" className="shrink-0">
            <img src={autowurxLogo} alt="Autowurx" className="h-6 md:h-7" />
          </a>

          {/* Desktop search */}
          <SmartSearchBar className="hidden md:flex" />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/how-it-works">How It Works</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link to="/broker-network">Brokers</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link to="/orders">Special Order</Link></Button>
            <Button size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMenuOpen(false); }}
              className="flex items-center justify-center h-11 w-11 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setMobileSearchOpen(false); }}
              className="flex items-center justify-center h-11 w-11 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3">
            <SmartSearchBar autoFocus />
          </div>
        )}
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-card border-l border-border overflow-y-auto pt-16">
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-foreground hover:bg-secondary transition-colors min-h-[44px]"
                >
                  <link.icon className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-3" />
              <Link
                to="/how-it-works"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-foreground hover:bg-secondary transition-colors min-h-[44px]"
              >
                <HelpCircle className="h-4 w-4 text-primary" />
                How It Works
              </Link>
              <Link
                to="/broker-network"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-foreground hover:bg-secondary transition-colors min-h-[44px]"
              >
                <Briefcase className="h-4 w-4 text-primary" />
                Brokers
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-foreground hover:bg-secondary transition-colors min-h-[44px]"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-cta hover:bg-secondary transition-colors min-h-[44px]"
              >
                Special Order
              </Link>
              <Link
                to="/dashboard/new-listing"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-cta hover:bg-secondary transition-colors min-h-[44px]"
              >
                Post a Listing
              </Link>
              <div className="border-t border-border my-3" />
              <Button className="w-full" size="lg" asChild>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
