import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "../features/settingSlice";
import { Clipboard } from "lucide-react";

const Settings = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentSettings = useSelector((state) => state.settings);
  const [model, setModel] = useState(currentSettings.model);
  const [apiKey, setApiKey] = useState(currentSettings.apiKey);

  const handleSave = () => {
    dispatch(updateSettings({ model, apiKey }));
    onClose();
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setApiKey(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-blur- flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-2/3  relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-6"> Settings</h2>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold ">
            Choose Your Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 transition duration-200"
          >
            <option value="gpt-4">GPT-4 </option>
            <option value="gpt-4-32k">GPT-4-32k </option>
            <option value="gpt-4o">GPT-4o </option>
            <option value="gpt-4o-mini">GPT-4o Mini </option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo </option>
            <option value="gpt-3.5-turbo-16k">
              GPT-3.5 Turbo 16k 
            </option>
            
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold">
            Enter your API Key:
          </label>
          <div className="flex items-center">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-grow p-3 border-2 border-gray-300 rounded-l-lg focus:border-purple-500 focus:ring focus:ring-purple-200 transition duration-200"
              placeholder="Enter your OpenAI API key"
            />
            <button
              onClick={handlePaste}
              className="bg-gray-300 text-black p-3 mx-1 rounded-r-lg hover:bg-gray-500 transition duration-200"
              title="Paste API Key"
            >
              <Clipboard size={24} />
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 rounded-full hover:bg-gray-400 transition duration-200 transform hover:scale-105"
          >
           Back
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-black text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-200 transform hover:scale-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
