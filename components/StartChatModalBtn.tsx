"use client";
import { useState } from "react";
import Modal from "react-modal";

function StartChatModalBtn() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  Modal.setAppElement("#modal");

  // use SWR to open the RealChat
  return (
    <button
      className="btnGray text-center"
      onClick={() => setIsModalOpen(true)}
    >
      與 bot 實際對話
      {/* 同意語音 Modal */}
      <div id="modal"></div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        // overlayClassName="overlay"
      >
        <h3 className="text-center font-bold">體驗與機器人真實對話</h3>
        <div className=" flex flex-col justify-center align-middle lg:flex-row">
          <button className="btnGray bg-[green] text-white">開啟語音</button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="btnGray text-gray-700"
          >
            下次吧
          </button>
        </div>
      </Modal>
    </button>
  );
}

export default StartChatModalBtn;
