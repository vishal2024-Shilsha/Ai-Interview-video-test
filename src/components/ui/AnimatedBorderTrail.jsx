import React from "react";
import { cn } from "../../libs/utils";

const sizes = {
  sm: 2,
  md: 4,
  lg: 6,
};

export default function AnimatedBorderTrail({
  children,
  className,
  duration = "3s",
  trailColor = "purple",
  trailSize = "md",
  contentClassName,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "relative h-fit w-fit rounded-2xl overflow-hidden",
        className
      )}
    >
      {/* Border trail */}
      <div
        className="absolute top-0 left-0 h-full w-full"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="absolute w-2 h-2 bg-purple-500 rounded-full animate-trail"
          style={{
            width: `${sizes[trailSize]}px`,
            height: `${sizes[trailSize]}px`,
            backgroundColor: trailColor,
            animationDuration: duration,
          }}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative rounded-2xl bg-white overflow-hidden",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
