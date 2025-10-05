import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

const FullPage = ({ className, children }: Props) => {
  return (
    <div className={cn("flex h-screen w-full items-center justify-center px-30", className)}>
      {children}
    </div>
  );
};

export default FullPage;
