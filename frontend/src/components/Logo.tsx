import { FileText, MessageSquare } from "lucide-react";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export const Logo = ({ showText = true, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon wrapper */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="bg-primary rounded-lg flex items-center justify-center p-2 shadow-md">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Text */}
      {showText && (
        <span className="text-xl font-bold tracking-tight text-primary">
          DocQuery
        </span>
      )}
    </div>
  );
};
