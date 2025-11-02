import { FileText, MessageSquare } from "lucide-react";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export const Logo = ({ showText = true, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
        <div className="relative bg-primary rounded-lg p-2">
          <FileText className="h-5 w-5 text-primary-foreground" />
          <MessageSquare className="h-3 w-3 text-primary-foreground absolute -bottom-1 -right-1 bg-primary rounded" />
        </div>
      </div>
      {showText && (
        <span className="text-xl !text-muted-foreground font-bold tracking-tight">DocQuery</span>
      )}
    </div>
  );
};
