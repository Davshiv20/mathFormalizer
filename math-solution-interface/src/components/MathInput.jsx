import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInput } from '../features/mathSlice';

const MathInput = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.math.input);

  return (
    <input
      value={input}
      className='border-grey px-4 py-4 border-2 rounded-md'
      onChange={(e) => dispatch(setInput(e.target.value))}
      placeholder="Enter your math problem or solution"
    />
  );
};

export default MathInput;