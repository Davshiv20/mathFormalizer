import React from "react";
import MathInput from "./components/mathInput";
import StructuredSolution from "./components/StructuredSolution";
import ConvertButton from "./components/ConvertButton";
import "./index.css";

function App() {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen flex flex-col items-center justify-center  p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          Math Solution Interface
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <MathInput />
          <div className="mt-4">
            <ConvertButton />
          </div>
          <div className="mt-6">
            <StructuredSolution />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
