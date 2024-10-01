import React from "react";
import { useSelector } from "react-redux";
import SingleStep from "./SingleStep";

const data = [
  {
    step: "1",
    description: "Identify the problem",
    expression: "(x+1)^2",
  },
  {
    step: "2",
    description: "Apply the binomial square formula (a+b)^2 = a^2 + 2ab + b^2",
    expression: "",
  },
  {
    step: "3",
    description: "Square x and 1, and multiply x and 1 by 2",
    calculation: "x^2 + 2*(x*1) + 1^2",
    result: "x^2 + 2*x + 1",
  },
  {
    step: "4",
    description: "Simplified expression",
    expression: "x^2 + 2*x + 1",
    result: "",
  },
  {
    step: "5",
    description: "Final result",
    result: "x^2 + 2*x + 1",
  },
  {
    step: "1",
    description: "Identify the problem",
    expression: "(x+1)^2",
  },
  {
    step: "2",
    description: "Apply the binomial square formula (a+b)^2 = a^2 + 2ab + b^2",
    expression: "",
  },
  {
    step: "3",
    description: "Square x and 1, and multiply x and 1 by 2",
    calculation: "x^2 + 2*(x*1) + 1^2",
    result: "x^2 + 2*x + 1",
  },
  {
    step: "4",
    description: "Simplified expression",
    expression: "x^2 + 2*x + 1",
    result: "",
  },
  {
    step: "5",
    description: "Final result",
    result: "x^2 + 2*x + 1",
  },
];

const StructuredSolution = () => {
  const { structuredSolution, isLoading, error } = useSelector(
    (state) => state.math
  );

  if (isLoading) return <p>Processing...</p>;
  if (error) return <p>Error: {error}</p>;
  // if (!structuredSolution) return null;

  return (
    <div className="h-[95%]">
      {/* <pre>{structuredSolution}</pre> */}
      <div className="h-[90%] overflow-x-scroll">
        {data.map((step, index) => (
          <SingleStep
            key={index}
            description={step.description}
            expression={step.expression}
          />
        ))}
      </div>
    </div>
  );
};

export default StructuredSolution;
