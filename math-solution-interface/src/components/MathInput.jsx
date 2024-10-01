import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput, processSolution } from "../features/mathSlice";
import { Camera } from "react-camera-pro";
import { Camera as CameraIcon, Upload, X } from "lucide-react";
import axios from "axios";

const MathInput = () => {
  const dispatch = useDispatch();
  const { input, isLoading, structuredSolution, error } = useSelector(
    (state) => state.math
  );
  const [showCamera, setShowCamera] = useState(false);
  const [isCaptureLoading, setIsCaptureLoading] = useState(false);
  const camera = useRef(null);

  const handleInputChange = (e) => {
    dispatch(setInput(e.target.value));
  };

  const handleConvert = () => {
    dispatch(processSolution(input));
  };

  const processMathPix = async (imageData) => {
    setIsCaptureLoading(true);
    try {
      // Replace with your actual backend endpoint that interfaces with MathPix
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
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    //   <h1 className="text-4xl font-bold text-blue-600 mb-8">Math Solution Interface</h1>
    <div className="bg-white p-8 rounded-lg w-full max-w-md">
      <textarea
        className="w-full p-2 border rounded mb-4"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter your math problem question"
        rows="2"
      />

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowCamera(!showCamera)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <CameraIcon size={20} className="mr-2" />
          {showCamera ? "Hide Camera" : "Show Camera"}
        </button>
        <label className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
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
    //   {error && <p className="text-red-500 mt-4">{error}</p>}
    //   {structuredSolution && (
    //     <div className="mt-8 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    //       <h2 className="text-2xl font-bold mb-4">Structured Solution:</h2>
    //       <pre className="whitespace-pre-wrap">{structuredSolution}</pre>
    //     </div>
    //   )}
    // </div>
  );
};

export default MathInput;
