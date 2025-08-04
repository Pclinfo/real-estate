// ChatWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatBox from "./ChatBox";

const ChatWrapper = () => {
  const { partnerId } = useParams();
  const userId = useSelector((state) => state.user.user?.user_id);

  return (
    <ChatBox
      userId={userId}
      partnerId={partnerId}
      partnerProfileImage="" // Optional: you can pass the profile image if needed
    />
  );
};
         
export default ChatWrapper;
