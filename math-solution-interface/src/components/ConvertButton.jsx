import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processSolution } from '../features/mathSlice';

const ConvertButton = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.math.input);

  return (
    <button onClick={() => dispatch(processSolution(input))} disabled={!input}>
      Convert
    </button>
  );
};

export default ConvertButton;