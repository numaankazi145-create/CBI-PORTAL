// import { useFormContext } from "react-hook-form";
// import { Label } from "@/components/Inputs/Label";
// import { Textarea } from "@/components/ui/textarea";

// export function CustomTextArea({ Question, name, required, ...props }) {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext();

//   const hasError = !!errors[name];

//   return (
//     <>
//       <Label className="text-[#181D27] text-xl font-semibold leading-7.5">
//         {Question}
//       </Label>

//       <Textarea
//         {...register(name, {
//           required: required })}
//         {...props}
//         className={`border rounded-md p-2 outline-none",
//           ${
//             hasError
//               ? "border-red-500 focus:border-red-500"
//               : "border-gray-300 focus:border-blue-500"
//           }
//         `}
//       />
//     </>
//   );
// }

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

export function CustomTextArea({ Question, required, name, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];
  return (
    <div className={`space-y-4`}>
      <Label className="text-[#181D27] text-xl font-semibold leading-7.5">
        {Question}
      </Label>
      <Textarea
        {...register(name, {
          required: required && !props.disabled,
        })}
        {...props}
        className={`border rounded-md p-2 outline-none",
          ${
            hasError ? "border-red-500 focus:border-red-500" : "border-gray-300"
          }
        `}
      />
    </div>
  );
}
