import React from 'react';
import { useSelector } from 'react-redux';

const StructuredSolution = () => {
  const { structuredSolution, isLoading, error } = useSelector((state) => state.math);

  if (isLoading) return <p>Processing...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!structuredSolution) return null;

  return (
    <div>
      <h2>Structured Solution:</h2>
      <pre>{structuredSolution}</pre>
    </div>
  );
};

export default StructuredSolution;