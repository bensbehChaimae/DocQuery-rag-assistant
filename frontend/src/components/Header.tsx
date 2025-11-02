import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <div className="mx-auto max-w-6xl rounded-full border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-all px-4 py-2 rounded-full ${
                isActive('/') 
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/workspace" 
              className={`text-sm font-medium transition-all px-4 py-2 rounded-full ${
                isActive('/workspace') 
                  ? 'text-primary bg-primary/10 border border-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              Workspace
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};