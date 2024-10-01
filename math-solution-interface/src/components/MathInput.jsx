import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInput } from '../features/mathSlice';

const MathInput = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.math.input);

  return (
    <textarea
      value={input}
      onChange={(e) => dispatch(setInput(e.target.value))}
      placeholder="Enter your math problem or solution"
    />
  );
};

export default MathInput;