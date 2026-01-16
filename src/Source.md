import React from "react";
import { useForm } from "react-hook-form";

export default function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    reset();
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
    
        <label
          htmlFor="feedback"
          style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}
        >
          Your Feedback
        </label>

        <textarea
          id="feedback"
          placeholder="Write your feedback here..."
          {...register("feedback", { required: "Feedback is required"})}
        />

      
        {errors.feedback && (
          <p style={{ color: "red", marginTop: "4px", fontSize: "14px" }}>
            {errors.feedback.message}
          </p>
        )}

        <button type="submit"> Submit</button>
      </form>
  );
}



const converstion_of_prop_question = (quessionnaireData?.prop_ques_resp ?? []).map((item, index) => [
        {
          role: "assistant",
          id: item?.id || "",
        },
        {
          role: "user",
          Question: item?.question_text || "",
          Answer: data[`answer_${index}`] || "",
        },
      ])
      .flat();









  function onSubmit(data) {
    console.log(data, "<<formdata>>");
    Form.reset();
    const converstion_of_prop_question = (
      quessionnaireData?.prop_ques_resp ?? []
    )
      .map((item, index) => [
        {
          role: "assistant",
          id: item?.id || "",
        },
        {
          role: "user",
          text: data[`answer_${index}`] || "",
        },
      ])
      .flat();

    const payload = {
      conversation: [
        {
          role: "assistant",
          id: quessionnaireData?.id,
          text: quessionnaireData?.questions?.question,
        },
        {
          role: "user",
          text: data?.answer,
        },
        ...converstion_of_prop_question,
      ],
      competency_name: quessionnaireData?.competency?.competency,
      remaining_time: 96,
      probe_count: probCount,
      expected_behaviors:
        quessionnaireData?.competency?.expected_behaviours?.map(
          (i) => i?.expected_behaviour
        ),
      questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
      participant_id: user?.participant_id,
    };
    mutate(payload);
  }




import React, { useState } from "react";
import { CustomHeading } from "../components/CustomHeading";
import { useLocation } from "react-router-dom";
import { useQuery } from "@/hooks/useQuerry";
import { FormProvider, useForm } from "react-hook-form";
import { CustomTextArea } from "../components/CustomTextARea";
import { IoArrowForwardOutline } from "react-icons/io5";
import { LuPause } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/config/axios";
import { AlertPopUp } from "../components/Alert-pop";

const user = JSON.parse(localStorage.getItem("user") || "{}");

export function CompetencyPage() {
  const [probCount, setProbCount] = useState(0);

  // 🔑 NEW: controls Pause / Continue UI ONLY
  const [isFinalProbeSubmitted, setIsFinalProbeSubmitted] = useState(false);

  const [openPop, setOpenPop] = useState(false);

  const Form = useForm();
  const location = useLocation();
  const QuestionerId = location.state;

  // ================= QUERY =================
  const { data: quessionnaireData, refetch } = useQuery({
    queryKey: [
      `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
    ],
    select: (data) => data?.data?.data,
    enabled: !!user?.participant_id && !!QuestionerId,
  });

  // ================= MUTATION =================
  const { mutate } = useMutation({
    mutationFn: (payload) => axios.post("/cbi", payload),

    onSuccess: async (res) => {
      const response = res?.data?.data;

      // 🟢 Probing continues → get next probe
      if (response?.is_prop_ques_available === true) {
        setProbCount((prev) => prev + 1);
        await refetch();
        return;
      }

      // 🔴 FINAL PROBE SUBMITTED
      if (response?.is_prop_ques_available === false) {
        setIsFinalProbeSubmitted(true);

        // 🔑 VERY IMPORTANT
        // this refetch pulls the LAST probe response
        await refetch();
      }
    },
  });

  // ================= SUBMIT =================
  function onSubmit(data) {
    const converstion_of_prop_question =
      quessionnaireData?.prop_ques_resp
        ?.map((item, index) => [
          {
            role: "assistant",
            id: item?.id || "",
          },
          {
            role: "user",
            text: data[`answer_${index}`] || "",
          },
        ])
        .flat() || [];

    const payload = {
      conversation: [
        {
          role: "assistant",
          id: quessionnaireData?.id,
          text: quessionnaireData?.questions?.question,
        },
        {
          role: "user",
          text: data?.answer,
        },
        ...converstion_of_prop_question,
      ],
      competency_name: quessionnaireData?.competency?.competency,
      remaining_time: 96,
      probe_count: probCount,
      expected_behaviors:
        quessionnaireData?.competency?.expected_behaviours?.map(
          (i) => i?.expected_behaviour
        ),
      questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
      participant_id: user?.participant_id,
    };

    mutate(payload);
    Form.reset();
  }

  // ================= CONTINUE =================
  function handleContinue() {
    // 🔥 RESET FLOW STATE FOR NEXT SECTION
    setIsFinalProbeSubmitted(false);
    setProbCount(0);
    setOpenPop(false);

    refetch();
  }

  return (
    <>
      <CustomHeading
        heading={`Section ${quessionnaireData?.sequence} of 6`}
        description="Assess your professional skills across key competencies"
      />

      <section className="p-6 ">
        <div className="p-6 bg-white rounded-xl">
          <div className="flex flex-col gap-4 pl-5">
            <h1 className="text-[18px] font-semibold leading-7 text-[#181D27]">
              Core Question
            </h1>

            <FormProvider {...Form}>
              <form>
                <CustomTextArea
                  Question={quessionnaireData?.questions?.question}
                  name="answer"
                  placeholder="Write something here..."
                  required
                  disabled={!!quessionnaireData?.response}
                  defaultValue={quessionnaireData?.response ?? ""}
                />

                {quessionnaireData?.prop_ques_resp?.map((item, index) => (
                  <CustomTextArea
                    key={item?.id}
                    Question={item?.question_text}
                    name={`answer_${index}`}
                    placeholder="Write something here..."
                    required
                    disabled={!!item?.response}
                    defaultValue={item?.response ?? ""}
                  />
                ))}
              </form>
            </FormProvider>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-end py-8">
          {isFinalProbeSubmitted ? (
            <div className="flex gap-4">
              <button
                onClick={() => setOpenPop(true)}
                className="text-base font-semibold leading-5 outline-1 outline-[#c3cbd8] bg-white py-3 px-5 rounded-md flex justify-center items-center gap-1"
              >
                <LuPause /> Pause Your Interview
              </button>

              <button
                onClick={handleContinue}
                className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1"
              >
                Continue <IoArrowForwardOutline />
              </button>
            </div>
          ) : (
            <button
              onClick={Form.handleSubmit(onSubmit)}
              className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1"
            >
              Submit <IoArrowForwardOutline />
            </button>
          )}
        </div>

        {/* ================= PAUSE POPUP ================= */}
        <AlertPopUp
          open={openPop}
          setOpen={setOpenPop}
          Icon="PausedIcon"
          heading="Interview Paused"
          Paragraph="Your Interview has been paused. You can resume it at any time."
          cancel="Sign Out"
          action="Resume Now"
          PausedHandle={handleContinue}
        />
      </section>
    </>
  );
}