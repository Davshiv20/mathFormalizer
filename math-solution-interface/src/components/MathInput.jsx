import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput, setQuestion, processSolution } from "../features/mathSlice";
import { Camera } from "react-camera-pro";
import { Camera as CameraIcon, Upload, X } from "lucide-react";
import axios from "axios";

const MathInput = () => {
  const dispatch = useDispatch();
  const { input, question, isLoading, structuredSolution, error } = useSelector(
    (state) => state.math
  );
  const [showCamera, setShowCamera] = useState(false);
  const [isCaptureLoading, setIsCaptureLoading] = useState(false);
  const camera = useRef(null);

  const handleQuestionChange = (e) => {
    dispatch(setQuestion(e.target.value));
  };

  const handleAnswerChange = (e) => {
    dispatch(setInput(e.target.value));
  };

  const handleConvert = () => {
    dispatch(processSolution(input));
  };

  const processMathPix = async (imageData) => {
    setIsCaptureLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/mathpix", {
        image: imageData,
      });
      dispatch(setInput(input + " " + response.data.latex));
    } catch (error) {
      console.error("MathPix processing failed:", error);
      // Handle error (e.g., show a notification to the user)
    }
    setIsCaptureLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processMathPix(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    const imageSrc = camera.current.takePhoto();
    if (imageSrc) {
      processMathPix(imageSrc);
    }
  };

  return (
    <div className="bg-white p-8 pb-2 rounded-lg w-full h-[85%] overflow-x-auto">
      <textarea
        className="w-full p-2 border rounded mb-4 shadow-md"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter your math problem question"
        rows="2"
      />
      <textarea
        className="w-full p-2 border rounded mb-4 shadow-md"
        value={input}
        onChange={handleAnswerChange}
        placeholder="Enter or capture the answer here"
        rows="3"
      />

      <div className="flex justify-between mb-4 gap-3">
        <button
          onClick={() => setShowCamera(!showCamera)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <CameraIcon size={20} className="mr-2" />
          {showCamera ? "Hide Camera" : "Show Camera"}
        </button>
        <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 cursor-pointer">
          <Upload size={20} className="mr-2" />
          Upload Image
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </label>
      </div>
      {showCamera && (
        <div className="mb-4 relative">
          <Camera ref={camera} aspectRatio={16 / 9} />
          <button
            onClick={handleCameraCapture}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isCaptureLoading}
          >
            {isCaptureLoading ? "Processing..." : "Capture"}
          </button>
          <button
            onClick={() => setShowCamera(false)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}
      {/* <button
        onClick={handleConvert}
        disabled={isLoading || !input}
        className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
      >
        {isLoading ? 'Converting...' : 'Convert'}
      </button> */}
    </div>
  );
};

export default MathInput;
