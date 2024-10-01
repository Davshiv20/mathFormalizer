// src/store/reducers/mathReducer.js
import { SET_INPUT } from '../actionTypes';

const initialState = {
  input: ''
};

const mathReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUT:
      return {
        ...state,
        input: action.payload
      };
    default:
      return state;
  }
};

export default mathReducer;
