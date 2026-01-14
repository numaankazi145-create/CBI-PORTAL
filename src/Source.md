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
