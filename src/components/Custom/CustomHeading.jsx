import React from "react";
import { RxExit } from "react-icons/rx";

export function CustomHeading({ heading, description, button }) {
  return (
    <div>
      <header className="flex justify-between items-center p-8">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl leading-9.5 ">
            {heading}
          </h1>
          <p className="font-normal text-base text-[#535862] leading-6 ">
            {description}
          </p>
        </div>
        {button && (
          <button
            //   onClick={LogoutHandle}
            className="font-semibold text-sm text-[#414651] bg-white border-2 border-[#D5D7DA] py-2.5 px-4 rounded-lg flex gap-2 items-center justify-center hover:bg-[#fafafade] transition cursor-pointer"
          >
            <RxExit />
            {button}
          </button>
        )}
      </header>
      <hr className="border border-[#8E9FC11F] w-full " />
    </div>
  );
}
