import React from "react";
import { useSelector } from "react-redux";
import SingleStep from "./SingleStep";

const StructuredSolution = () => {
  const { structuredSolution, isLoading, error } = useSelector(
    (state) => state.math
  );

  if (isLoading) return <p>Processing...</p>;
  if (error) return <p>Error: {error}</p>;
  // if (!structuredSolution || structuredSolution.length === 0)
  //   return <p>No solution available</p>;
  // console.log(structuredSolution);
  return (
    <div className="lg:h-[95%]">
      <div className="lg:h-[90%] lg:overflow-x-scroll">
        {structuredSolution &&
          structuredSolution.map((step, index) => (
            <SingleStep
              key={index}
              description={step.description || `Step ${step.step || index + 1}`}
              expression={
                step.equation || step.expression || "No equation provided"
              }
            />
          ))}
      </div>
    </div>
  );
};

export default StructuredSolution;
