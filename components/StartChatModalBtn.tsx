"use client";

import { useState } from "react";
import Modal from "react-modal";
import { actionTypes } from "../lib/reducer";
import { useStateValue } from "./StateProvider";

function StartChatModalBtn() {
  Modal.setAppElement("#modal");
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [{ isRecordingOn }, dispatch] = useStateValue();

  const handleRecordingOn = () => {
    dispatch({
      type: actionTypes.SET_IS_RECORDING_ON,
      isRecordingOn: true,
    });
    ModalToggle();
  };

  const handleRecordingOff = () => {
    dispatch({
      type: actionTypes.SET_IS_RECORDING_ON,
      isRecordingOn: false,
    });
  };

  const ModalToggle = () => {
    if (isModalOpen) {
      setIsModelOpen(false);
      // dispatch({
      //   type: actionTypes.SET_IS_RECORDING_ON,
      //   isRecordingOn: false,
      // });
    } else {
      setIsModelOpen(true);
    }
  };

  // use SWR to open the RealChat
  return (
    <>
      <button className="btnGray text-center" onClick={ModalToggle}>
        與 bot 實際對話
      </button>
      {/* 同意語音 Modal */}
      <div id="modal"></div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={ModalToggle}
        className="modal"
        // overlayClassName="overlay"
      >
        <h3 className="text-center font-bold">體驗與機器人真實對話</h3>
        <div className=" flex flex-col justify-center align-middle lg:flex-row">
          <button
            onClick={handleRecordingOn}
            className="btnGray bg-[green] text-white"
          >
            開啟語音
          </button>
          <button
            onClick={handleRecordingOff}
            className="btnGray text-gray-700"
          >
            下次吧
          </button>
        </div>
      </Modal>
    </>
  );
}

export default StartChatModalBtn;
