import React from "react";

type Props = /*ChildrenWithProps &*/ {
  notUnderlineColor?: boolean;
  children: React.ReactNode;
};

export function H1({ notUnderlineColor, children }: Props) {
  return (
    <div className="block mb-3">
      <div className="relative inline-block">
        <span className="text-3xl font-extrabold">{children}</span>
        {!notUnderlineColor && (
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-600 rounded-full"></span>
        )}
      </div>
    </div>
  );
}
