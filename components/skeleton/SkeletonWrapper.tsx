import React from "react";

interface SkeletonWrapperProps {
  skeletonItem: React.ReactNode | ((index: number) => React.ReactNode);
  quantity?: number;
  className?:string;
}

const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  skeletonItem,
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  quantity = 3,
}) => {
  // If skeletonItem is a function, call it for each index
  const renderSkeleton = () => {
    if (typeof skeletonItem === "function") {
      return Array.from({ length: quantity }).map((_, index) => (
        <React.Fragment key={index}>{skeletonItem(index)}</React.Fragment>
      ));
    }
    // If skeletonItem is a React node, repeat it
    return Array.from({ length: quantity }).map((_, index) => (
      <React.Fragment key={index}>{skeletonItem}</React.Fragment>
    ));
  };

  return <div className={className}>{renderSkeleton()}</div>;
};

export default SkeletonWrapper;