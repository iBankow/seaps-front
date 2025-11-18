import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground hover:bg-muted",
        primary:
          "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-secondary/20 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
        success:
          "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
        info:
          "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  removable?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, children, onRemove, removable = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant }), className)}
        {...props}
      >
        <span className="select-none">{children}</span>
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-current/20 focus:outline-none focus:ring-1 focus:ring-current transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };