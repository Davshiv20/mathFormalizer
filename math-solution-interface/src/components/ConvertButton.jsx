import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { processSolution } from "../features/mathSlice";

const ConvertButton = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.math.input);
  const question = useSelector((state) => state.math.question);

  const handleConvert = () => {
    dispatch(processSolution({ question, answer: input }));
  };

  return (
    <button
      className="bg-green-600 hover:bg-green-700 rounded-full text-justify items-center text-white"
      onClick={handleConvert}
      disabled={!input || !question}
    >
      <div className="px-4 py-2">Generate</div>
    </button>
  );
};

export default ConvertButton;