"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { actionTypes } from "../lib/reducer";
import { useStateValue } from "./StateProvider";

function StartChatModalBtn() {
  Modal.setAppElement("#modal");
  const [{ isStartChatModalOpen }, dispatch] = useStateValue();

  const handleModalOpen = () => {
    isStartChatModalOpen
      ? dispatch({
          type: actionTypes.SET_IS_START_CHAT_MODAL_OPEN,
          isStartChatModalOpen: false,
        })
      : dispatch({
          type: actionTypes.SET_IS_START_CHAT_MODAL_OPEN,
          isStartChatModalOpen: true,
        });
  };

  // use SWR to open the RealChat
  return (
    <>
      <button className="btnGray text-center" onClick={handleModalOpen}>
        與 bot 實際對話
      </button>
      {/* 同意語音 Modal */}
      <div id="modal"></div>
      <Modal
        isOpen={isStartChatModalOpen}
        onRequestClose={handleModalOpen}
        className="modal"
        // overlayClassName="overlay"
      >
        <h3 className="text-center font-bold">體驗與機器人真實對話</h3>
        <div className=" flex flex-col justify-center align-middle lg:flex-row">
          <button className="btnGray bg-[green] text-white">開啟語音</button>
          <button onClick={handleModalOpen} className="btnGray text-gray-700">
            下次吧
          </button>
        </div>
      </Modal>
    </>
  );
}

export default StartChatModalBtn;
