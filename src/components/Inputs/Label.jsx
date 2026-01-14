import React from "react";

export function Label({ Question }) {
  return (
    <>
      <div className="text-[#181D27] text-xl font-semibold leading-7.5">
        {Question}
      </div>
    </>
  );
}
