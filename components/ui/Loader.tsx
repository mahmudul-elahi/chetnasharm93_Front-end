import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-[60px] h-[60px] rounded-full border-2 border-transparent border-t-[#8900FF] animate-spin" />
    </div>
  );
};

export default Loader;
