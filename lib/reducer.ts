"use client";

export const initialState = {
  isRecordingOn: false,
};

export const actionTypes = {
  SET_IS_RECORDING_ON: "SET_IS_RECORDING_ON",
};

const reducer = (state: any, action: Action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_IS_RECORDING_ON:
      return {
        ...state,
        isRecordingOn: action.isRecordingOn,
      };

    default:
      return state;
  }
};

export default reducer;
