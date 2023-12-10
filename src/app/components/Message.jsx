import React from "react";

import "../styles/message.css";

const Message = ({ sender, message }) => {
  return (
    <div
      className={`message-container ${
        sender == "You" ? "bg-user-color items-end" : "bg-bot-color items-start"
      }`}
    >
      <p className="text-lg md:text-2xl font-bold">{sender}</p>

      <p className="text-sm md:text-lg whitespace-pre-wrap">{message}</p>
    </div>
  );
};

export default Message;
