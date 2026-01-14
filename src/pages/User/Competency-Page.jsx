import React, { useState } from "react";
import { CustomHeading } from "../components/CustomHeading";
// import { TextArea } from "@/components/Inputs/TextArea";
// import { Label } from "@/components/Inputs/Label";
import { useLocation } from "react-router-dom";
import { useQuery } from "@/hooks/useQuerry";
import { FormProvider, useForm } from "react-hook-form";
import { CustomTextArea } from "../components/CustomTextARea";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/config/axios";

const user = JSON.parse(localStorage.getItem("user") || "{}");

export function CompetencyPage() {
  const [probCount, setProbCount] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);

  const Form = useForm();
  const location = useLocation();
  const QuestionerId = location.state;

  // =============Competency Question=============
  const { data: quessionnaireData, refetch } = useQuery({
    queryKey: [
      `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
    ],
    select: (data) => data?.data?.data,
    enabled: !!user?.participant_id && !!QuestionerId,
  });
  console.log(
    quessionnaireData,
    "quessionnaireData For Question>>>>>>>>>>>>>>>"
  );
  // =========mutate=========================
  const { mutate } = useMutation({
    mutationFn: (payload) => axios.post("/cbi", payload),

    onSuccess: async (res) => {
      const response = res?.data?.data;
      console.log(response, "CBI API-->Response");
      setApiResponse(response);
      if (response?.is_prop_ques_available == true) {
        setProbCount((a) => a + 1);
      }
      const refetched = await refetch();
      console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
    },
  });
  console.log(apiResponse, "<<api res>>");

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

  return (
    <>
      <CustomHeading
        heading={`Section 1 of 6`}
        description="Assess your professional skills across key competencies"
      />
      <section className="p-6 ">
        <div className="p-6 bg-white rounded-xl">
          <div className="flex flex-col gap-4 pl-5">
            <h1 className="text-[18px] font-semibold leading-7 text-[#181D27]">
              Core Question
            </h1>
            <p className="font-normal text-base text-[#181D27]">
              This is the main question for this competency. Take your time to
              provide a comprehensive answer.
            </p>

            <FormProvider {...Form}>
              <form>
                <CustomTextArea
                  Question={quessionnaireData?.questions?.question}
                  name="answer"
                  placeholder="Write something here..."
                  required={true}
                  disabled={quessionnaireData?.response}
                  defaultValue={quessionnaireData?.response ?? null}
                />
                {quessionnaireData?.prop_ques_resp.length > 0 &&
                  quessionnaireData?.prop_ques_resp?.map((item, index) => (
                    <CustomTextArea
                      Question={quessionnaireData?.questions?.question}
                      name={`answer_${index}`}
                      placeholder="Write something here..."
                      required={true}
                      disabled={item?.response}
                      defaultValue={item?.response ?? null}
                    />
                  ))}
              </form>
            </FormProvider>
          </div>
        </div>
        <div className="flex justify-end py-8">
          <button
            onClick={Form.handleSubmit(onSubmit)}
            className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all"
          >
            Submit <IoArrowForwardOutline />
          </button>
        </div>
      </section>
    </>
  );
}
