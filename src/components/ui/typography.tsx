import * as React from "react";
import { cn } from "../../lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "body1" | "body2";
}

const Typography: React.FC<TypographyProps> = ({ variant = "body1", className, ...props }) => {
  const Component =
    variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : "p";

  return <Component className={cn(className)} {...props} />;
};

export { Typography };
