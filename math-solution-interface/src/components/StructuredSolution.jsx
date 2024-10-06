import React from "react";
import { useSelector } from "react-redux";
import SingleStep from "./SingleStep";

const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-y-blue-500"></div>
  </div>
);

const StructuredSolution = () => {
  const { structuredSolution, isLoading, error } = useSelector(
    (state) => state.math
  );

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="lg:h-[95%]">
      <div className="lg:h-[90%] lg:overflow-x-scroll">
        {structuredSolution &&
          structuredSolution.map((step, index) => (
            <SingleStep
              key={index}
              initialDescription={
                step.description || `Step ${step.step || index + 1}`
              }
              initialExpression={
                step.equation || step.expression || "No equation provided"
              }
            />
          ))}
      </div>
    </div>
  );
};

export default StructuredSolution;
