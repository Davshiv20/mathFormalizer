import React, { useState, useEffect, useRef } from "react";
import { Pencil, Save } from "lucide-react";

function SingleStep({ initialDescription, initialExpression }) {
  const [description, setDescription] = useState(initialDescription);
  const [expression, setExpression] = useState(initialExpression);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRefDesc = useRef(null);
  const textareaRefExpr = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 6}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight(textareaRefDesc.current);
      adjustTextareaHeight(textareaRefExpr.current);
    }
  }, [isEditing, description, expression]);

  return (
    <div className="w-[97%] p-2 border-2 rounded-xl m-2 relative">
      {isEditing ? (
        <div className="flex w-full">
          <div className="w-11/12">
            <div className="flex gap-2">
              <div className="w-3/12">
                <span className="font-bold break-all">Description: </span>
              </div>
              <div className="w-9/12 break-all">
                <textarea
                  ref={textareaRefDesc}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-2 rounded p-1 w-full"
                  placeholder="Enter description..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-3/12">
                <span className="font-bold break-all">Expression: </span>
              </div>
              <div className="w-9/12 break-all">
                <textarea
                  ref={textareaRefExpr}
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="border-2 rounded p-1 w-full"
                  placeholder="Enter expression..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-2 w-1/12">
            <button onClick={handleSaveClick} className="text-green-500">
              <Save className="inline-block" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-1">
          <div className="w-11/12">
            <div className="flex gap-1">
              <div className="w-3/12">
                <span className="font-bold break-all">Description: </span>
              </div>
              <div className="w-9/12 break-all">{description}</div>
            </div>
            <div className="flex gap-1">
              <div className="w-3/12">
                <span className="font-bold break-all">Expression: </span>
              </div>
              <div className="w-9/12 break-all">{expression}</div>
            </div>
          </div>
          <div className="w-1/12 flex align-middle justify-center">
            <button onClick={handleEditClick} className="text-blue-500">
              <Pencil className="inline-block" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleStep;
