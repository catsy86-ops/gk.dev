import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

function Skeleton({ className, circle, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        circle && "rounded-full",
        !circle && "rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
