import React from "react";
import MathInput from "./components/mathInput";
import StructuredSolution from "./components/StructuredSolution";
import ConvertButton from "./components/ConvertButton";
import "./index.css";

function App() {
  return (
    <div className="bg-gray-100 w-full lg:h-screen">
      <div className="flex flex-col items-center justify-center p-6 lg:h-screen">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          Math Solution Interface
        </h1>
        <div className="w-5/6 bg-white rounded-lg shadow-lg p-6 lg:flex gap-1 lg:h-[90%]">
          <div className="lg:w-2/5">
            <MathInput />
            <div className="mt-4 flex justify-center">
              <ConvertButton />
            </div>
          </div>
          <div className="lg:w-3/5">
            <div className="mt-3 lg:h-full">
              <div className="text-2xl font-bold text-blue-600 mb-6 flex justify-center">
                Structured Solution
              </div>
              <div className="lg:h-full">
                <StructuredSolution />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
