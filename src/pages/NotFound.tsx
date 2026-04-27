import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "AutoWurx — 404";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, hsl(var(--primary) / 0.03) 0 14px, transparent 14px 28px)",
      }}
    >
      <div className="relative z-10 max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded bg-primary">
          <span className="font-heading text-lg font-bold uppercase tracking-wider text-primary-foreground">
            AW
          </span>
        </div>
        <h1
          className="font-heading uppercase leading-none tracking-wider text-primary"
          style={{ fontSize: "clamp(96px, 16vw, 160px)" }}
        >
          404
        </h1>
        <p className="mt-4 font-heading text-2xl uppercase tracking-widest text-foreground">
          This page took a wrong turn
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The route <span className="font-mono text-primary">{location.pathname}</span> isn't part
          of the AutoWurx platform.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/">Back to Marketplace</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/dashboard">Admin Panel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
