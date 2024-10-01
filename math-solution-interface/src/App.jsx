import React from "react";
import MathInput from "./components/mathInput";
import StructuredSolution from "./components/StructuredSolution";
import ConvertButton from "./components/ConvertButton";
import "./index.css";

function App() {
  return (
    <div className="bg-gray-100 w-full h-screen">
      <div className="flex flex-col items-center justify-center p-6 h-screen">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          Math Solution Interface
        </h1>
        <div className="w-5/6 bg-white rounded-lg shadow-lg p-6 flex gap-1 h-[90%]">
          <div className="w-2/5">
            <MathInput />
            <div className="mt-4 flex justify-center">
              <ConvertButton />
            </div>
          </div>
          <div className="w-3/5">
            <div className="mt-3 h-full">
              <div className="text-2xl font-bold text-blue-600 mb-6 flex justify-center">
                Structured Solution
              </div>
              <div className="h-full">
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
