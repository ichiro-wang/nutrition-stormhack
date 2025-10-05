import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: ReactNode;
}

const ButtonGroup = ({ orientation = "horizontal", className, children }: Props) => {
  return (
    <div className={cn(`gap-3 flex ${orientation === "vertical" && "flex-col"}`, className)}>
      {children}
    </div>
  );
};

export default ButtonGroup;
