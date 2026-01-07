import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen aurora-bg noise flex flex-col items-center justify-center px-4">
      <div className="text-center glass-strong rounded-3xl p-8 max-w-md">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline font-medium">
          Return to Home
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
