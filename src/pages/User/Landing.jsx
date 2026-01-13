import { useQuery } from "@/hooks/useQuerry";
import { CustomHeading } from "@/pages/components/CustomHeading";
import React, { useState } from "react";
import { CompetencyCard } from "../components/CompetencyCard";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Guidelines } from "../components/GuidelinePop";
const user = JSON.parse(localStorage.getItem("user") || "{}");

export function Landing() {
  const [guide, setGuide] = useState(false);
  const {
    data: Competency,
    // isPending,
    // isError,
  } = useQuery({
    queryKey: [
      `/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`,
    ],
    select: (Competency) => Competency?.data?.data,
    enabled: !!user?.participant_id,
  });
  console.log(Competency, "CompetencyCards>>>>>>>>>>>>>>>");

  return (
    <>
      {/* --header-- */}
      <CustomHeading
        heading="Welcome to the Competency Based Interview Portal"
        description="Assess your professional skills across key competencies"
        button="Sign Out"
      />
      <section className="p-8 flex flex-col gap-8">
        {/* --hero-- */}
        <div className="flex flex-col items-center space-y-2 mt-2 ">
          <img src="icons/Container.png" />
          <h1 className="text-[#2F6DD1] text-4xl font-bold">
            Competency-Based Interview Portal
          </h1>
          <p className="text-base font-normal leading-6 text-[#181D27]">
            Assess your professional skills across six key competencies with
            AI-powered questions and personalized feedback
          </p>
        </div>
        {/* --competancy-- */}
        <div className="grid grid-cols-3 gap-4">
          {user &&
            Array.isArray(Competency) &&
            Competency.map((item, index) => (
              <CompetencyCard
                key={item.id}
                number={index + 1}
                label={item.competency}
                paragraph={item.description}
              />
            ))}
        </div>
        <button
          onClick={() => setGuide(true)}
          className="text-base font-semibold  bg-[#3B7FE6] text-white py-2 px-4 rounded-md flex justify-center items-center gap-1 m-auto hover:bg-[#75a5ee] transition-all"
        >
          Start Assessment <IoArrowForwardOutline />
        </button>
        <Guidelines open={guide} onOpenChange={setGuide} />
      </section>
    </>
  );
}

// import { useQuery } from "@/hooks/useQuerry";
// import { CustomHeading } from "@/pages/components/CustomHeading";
// import React from "react";
// import { CompetencyCard } from "../components/CompetencyCard";

// export function Landing() {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const {
//     data: Competency,
//     isPending,
//     isError,
//   } = useQuery({
//     queryKey: [
//       `/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`,
//     ],
//     select: (response) => response?.data?.data,
//     enabled: !!user?.participant_id,
//   });

//   console.log(Competency, "CompetencyCards>>>>>>>>>>>>>>>");

//   return (
//     <div>
//       <CustomHeading
//         heading="Welcome to the Competency Based Interview Portal"
//         description="Assess your professional skills across key competencies"
//         button="Sign Out"
//       />

//       <div className="flex flex-col items-center p-8 space-y-4">
//         <img src="icons/Container.png" alt="Container" />
//         <h1 className="text-[#2F6DD1] text-4xl font-bold">
//           Competency-Based Interview Portal
//         </h1>
//         <p className="text-base font-normal leading-6 text-[#181D27]">
//           Assess your professional skills across six key competencies with
//           AI-powered questions and personalized feedback
//         </p>
//       </div>

//       {/* Loading State */}
//       {isPending && (
//         <p className="text-center text-gray-500">Loading competencies...</p>
//       )}

//       {/* Error State */}
//       {isError && (
//         <p className="text-center text-red-500">Failed to load competencies</p>
//       )}

//       <div className="grid grid-cols-3 gap-4">
//         {user &&
//           Array.isArray(Competency) &&
//           Competency.map((item, index) => (
//             <CompetencyCard
//               key={item.id}
//               number={index + 1}
//               label={item.competency}
//               paragraph={item.description}
//             />
//           ))}
//       </div>
//     </div>
//   );
// }
