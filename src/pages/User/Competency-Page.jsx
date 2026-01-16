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
import { ButtonFooter } from "../components/Button-Footer";

const user = JSON.parse(localStorage.getItem("user") || "{}");

export function CompetencyPage() {
  const [probCount, setProbCount] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [openPop, setOpenPop] = useState(false);
  const [isTrueFlag, setIsTrueFlag] = useState(false);

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
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => axios.post("/cbi", payload),

    onSuccess: async (res) => {
      const response = res?.data?.data;
      console.log(response, "CBI API-->Response");
      setApiResponse(response);
      if (response?.is_prop_ques_available == true) {
        setIsTrueFlag(response?.is_prop_ques_available);
        setProbCount((a) => a + 1);
        const refetched = await refetch();
        console.log(refetched?.data?.prop_ques_resp, "refetched>>>>>>>>>");
      }
    },
  });
  console.log(apiResponse, "<<api-res>>");

  function onSubmit(data) {
    console.log(data, "<<formdata>>");
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

  function PausedHandle() {
    refetch();
    setOpenPop(false);
    setApiResponse(null);
    setProbCount(0);
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
                  isTrueFlag == true &&
                  quessionnaireData?.prop_ques_resp?.map((item, index) => (
                    <div className="py-6">
                      <CustomTextArea
                        key={index || item.id}
                        Question={quessionnaireData?.questions?.question}
                        name={`answer_${index}`}
                        placeholder="Write something here..."
                        required={true}
                        disabled={
                          item?.response ||
                          apiResponse?.is_prop_ques_available == false
                        }
                        defaultValue={item?.response ?? null}
                      />
                    </div>
                  ))}
              </form>
            </FormProvider>
          </div>
        </div>
        {apiResponse?.is_prop_ques_available === false && (
          <div className="p-2 text-[#4d5a72] border text-[14px]  bg-white border-[#D5D7DA] rounded-xl! z-10000 sticky! my-4">
            Your response is submited. Please select continue for proceeding to
            next section
          </div>
        )}
        {/* --button-- */}
        {/* <div className="flex justify-end py-8">
          {apiResponse?.is_prop_ques_available === false ? (
            <div className="flex gap-4">
              <button
                onClick={() => setOpenPop(true)}
                className="text-base font-semibold leading-5 outline-1 outline-[#c3cbd8] bg-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#c3cbd8] transition-all"
              >
                <LuPause />
                Pause Your Interview
              </button>

              <button
                onClick={PausedHandle}
                className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all"
              >
                Continue <IoArrowForwardOutline />
              </button>
            </div>
          ) : (
            <button
              disabled={isPending}
              onClick={Form.handleSubmit(onSubmit)}
              className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1 hover:bg-[#75a5ee] transition-all  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit <IoArrowForwardOutline />
            </button>
          )}
        </div> */}
        {/* ----pop----- */}
        <AlertPopUp
          open={openPop}
          setOpen={setOpenPop}
          Icon="PausedIcon"
          heading="Interview Paused"
          Paragraph="Your Interview has been paused. You can resume it at any time."
          cancel="Sign Out"
          action="Resume Now"
          // LogoutHandle={LogoutHandle}
          PausedHandle={PausedHandle}
        />
      </section>
      <ButtonFooter
        apiResponse={apiResponse}
        setOpenPop={setOpenPop}
        PausedHandle={PausedHandle}
        isPending={isPending}
        handleSubmit={Form.handleSubmit(onSubmit)}
      />
    </>
  );
}

