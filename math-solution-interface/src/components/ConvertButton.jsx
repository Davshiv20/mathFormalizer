import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { processSolution } from "../features/mathSlice";

const ConvertButton = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.math.input);

  return (
    // <div className='bg-green-600 rounded-full'>
    <button
      className="bg-green-600 hover:bg-green-700 rounded-full text-justify items-center text-white"
      onClick={() => dispatch(processSolution(input))}
      disabled={!input}
    >
      <div className="px-4 py-2">Generate </div>
    </button>
    // </div>
  );
};

export default ConvertButton;
