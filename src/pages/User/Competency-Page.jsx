import React, { useEffect, useState } from "react";
import { CustomHeading } from "../components/CustomHeading";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@/hooks/useQuerry";
import { FormProvider, useForm } from "react-hook-form";
import { CustomTextArea } from "../components/CustomTextARea";
import { GoDotFill } from "react-icons/go";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/config/axios";
import { AlertPopUp } from "../components/Alert-pop";
import { LuPause } from "react-icons/lu";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Submittedsucessfully } from "../components/Submitted-sucessfully";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const user = JSON.parse(localStorage.getItem("user") || "{}");

export function CompetencyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const QuestionerId = location.state;

  const [probCount, setProbCount] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [openPop, setOpenPop] = useState(false);
  const [isTrueFlag, setIsTrueFlag] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loader, setLoader] = useState(false);
  const Form = useForm();

  const { data: quessionnaireData, refetch } = useQuery({
    queryKey: [
      `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
    ],
    select: (data) => data?.data?.data,
    enabled: !!user?.participant_id && !!QuestionerId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => axios.post("/cbi", payload),
    onSuccess: async (res) => {
      const response = res?.data?.data;
      setApiResponse(response);
      if (response?.is_prop_ques_available === true) {
        setIsTrueFlag(true);
        setProbCount((a) => a + 1);
        await refetch();
      }
    },
  });

  const { mutate: pauseMutate } = useMutation({
    mutationFn: () =>
      axios.put(
        `/cbi/${QuestionerId?.partiAssessments?.quessionnaire_id}/${user?.participant_id}`,
      ),
    onSuccess(response) {
      console.log(response?.data?.message, ">>>>>Pause");
      toast.success(response?.data?.message || "Successfully submited");
      // toast.success("Test toast");

      setOpenPop(true);
    },
  });

  useEffect(() => {
    if (apiResponse?.total_question_count) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompleted(true);
    }
  }, [apiResponse?.total_question_count]);

  function onSubmit(data) {
    const converstion_of_prop_question = (
      quessionnaireData?.prop_ques_resp ?? []
    )
      .map((item, index) => [
        { role: "assistant", id: item?.id || "" },
        { role: "user", text: data[`answer_${index}`] || "" },
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
          (i) => i?.expected_behaviour,
        ),
      questionnaire_id: QuestionerId?.partiAssessments?.quessionnaire_id,
      participant_id: user?.participant_id,
    };

    mutate(payload);
  }

  function PausedHandle() {
    Form.reset();
    setApiResponse(null);
    setProbCount(0);
    setIsTrueFlag(false);
    setOpenPop(false);
    refetch();
  }

  function LogoutHandle() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoader(true);
    setCompleted(false);
    setTimeout(() => {
    toast.error("Logged out successfully");

      navigate("/login");
    }, 1000);
  }

  {
    loader && (
      <div className="fixed inset-0 z-9999 bg-white flex justify-center items-center">
        <Loader className="w-20 h-20 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <CustomHeading
        heading={`Section ${quessionnaireData?.sequence} of ${QuestionerId?.sections}`}
        description="Assess your professional skills across key competencies"
        className={`sticky top-0 z-10`}
      />

      <section className="p-6 overflow-y-auto h-[80vh]">
        <div className="p-6 bg-white rounded-xl">
          <FormProvider {...Form}>
            <form className="flex flex-col gap-6">
              <div className="relative pl-5">
                {quessionnaireData?.prop_ques_resp?.length > 0 &&
                  isTrueFlag && (
                    <>
                      <GoDotFill className="absolute left-0 top-2 text-[#7F56D9]" />
                      <div className="absolute border-l-2 border-[#E4E7EC] left-1.75 top-7 h-full" />
                    </>
                  )}

                <h1 className="text-[18px] font-semibold text-[#181D27]">
                  Core Question
                </h1>

                <p className="text-base text-[#181D27] mb-4">
                  This is the main question for this competency.
                </p>

                <CustomTextArea
                  Question={quessionnaireData?.questions?.question}
                  name="answer"
                  required
                  disabled={quessionnaireData?.response || isPending}
                  defaultValue={quessionnaireData?.response ?? null}
                  placeholder="Write something here..."
                />
              </div>

              {isTrueFlag &&
                quessionnaireData?.prop_ques_resp?.map((item, index) => (
                  <div key={item?.id || index} className="relative pl-5">
                    <GoDotFill className="absolute left-0 top-2 text-[#7F56D9]" />

                    {item?.response && (
                      <div className="absolute border-l-2 border-[#E4E7EC] left-1.75 top-7 h-full" />
                    )}

                    <span className="text-[#535862] font-bold text-lg block mb-2">
                      Follow Up Question {index + 1}
                    </span>

                    <CustomTextArea
                      Question={item?.question_text}
                      name={`answer_${index}`}
                      required
                      disabled={
                        item?.response ||
                        apiResponse?.is_prop_ques_available === false ||
                        isPending
                      }
                      defaultValue={item?.response ?? null}
                      placeholder="Write something here..."
                    />
                  </div>
                ))}
            </form>
          </FormProvider>
        </div>

        {apiResponse?.is_prop_ques_available === false && !openPop && (
          <div className="p-2 my-4 bg-white border border-[#D5D7DA] rounded-xl text-sm text-[#4d5a72]">
            Your response is submitted. Please select continue to proceed to the
            next section.
          </div>
        )}

        {!apiResponse?.total_question_count && (
          <div className="flex justify-end py-8">
            {apiResponse?.is_prop_ques_available === false ? (
              <div className="flex gap-4">
                <button
                  onClick={() => pauseMutate()}
                  className="text-base font-semibold leading-5 outline-1 outline-[#c3cbd8] bg-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#c3cbd8] transition-all"
                >
                  <LuPause /> Pause Interview
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
                {isPending ? (
                  "Submitting..."
                ) : (
                  <span className=" flex justify-center items-center gap-1">
                    Submit <IoArrowForwardOutline />
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </section>

      <AlertPopUp
        open={openPop}
        setOpen={setOpenPop}
        Icon="PausedIcon"
        heading="Interview Paused"
        Paragraph="Your Interview has been paused. You can resume it at any time."
        cancel="Sign Out"
        action="Resume Now"
        LogoutHandle={LogoutHandle}
        PausedHandle={PausedHandle}
      />

      <Submittedsucessfully
        open={completed}
        answeredQues={apiResponse?.total_question_count}
        sections={quessionnaireData?.sequence}
        LogoutHandle={LogoutHandle}
      />
    </>
  );
}
