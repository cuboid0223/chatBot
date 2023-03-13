"use client";

export const initialState = {
  isStartChatModalOpen: false,
};

export const actionTypes = {
  SET_IS_START_CHAT_MODAL_OPEN: "SET_IS_START_CHAT_MODAL_OPEN",
};

const reducer = (state: any, action: Action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_IS_START_CHAT_MODAL_OPEN:
      return {
        ...state,
        isStartChatModalOpen: action.isStartChatModalOpen,
      };

    default:
      return state;
  }
};

export default reducer;
