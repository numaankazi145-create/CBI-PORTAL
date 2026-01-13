import { CustomHeading } from "@/pages/components/CustomHeading";
import React from "react";

export function Landing() {
  return (
    <div>
      <CustomHeading
        heading="Welcome to the Competency Based Interview Portal"
        description="Assess your professional skills across key competencies"
        button="Sign Out"
      />
      <div className="flex flex-col items-center p-8 space-y-4">
        <img src="icons/Container.png" />
        <h1 className="text-[#2F6DD1] text-4xl font-bold">
          Competency-Based Interview Portal
        </h1>
        <p className="text-base font-normal leading-6 text-[#181D27]">
          Assess your professional skills across six key competencies with
          AI-powered questions and personalized feedback
        </p>
      </div>
    </div>
  );
}
