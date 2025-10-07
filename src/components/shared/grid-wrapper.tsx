import { ReactNode } from "react";

interface GridWrapperProps {
  children: ReactNode;
}

export const GridWrapper = ({ children }: GridWrapperProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {children}
    </div>
  );
};
