import Sidebar from "components/Sidebar/Sidebar";
import { selectChannelName, selectChannelUUID } from "features/channelsSlice";
import { fetchMessagesByChannel } from "features/messagesSlice";
import { fetchTextChannels } from "features/channelsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatNavbar from "components/Chat/ChatNavbar";
import tw from "tailwind-styled-components";

const Chat = () => {
  const dispatch = useDispatch();
  const channelUUID = useSelector(selectChannelUUID);
  const channelName = useSelector(selectChannelName);

  useEffect(() => {
    if (!channelUUID) {
      dispatch(fetchTextChannels());
    } else {
      dispatch(fetchMessagesByChannel());
    }
  }, [dispatch, channelUUID]);

  return (
    <StyledChat>
      <ChatNavbar />
      <Sidebar />
      <MainChat>
        <ChatHeader channelName={channelName} />
        <ChatMessages />
        <ChatInput channelUUID={channelUUID} channelName={channelName} />
      </MainChat>
    </StyledChat>
  );
};

const MainChat = tw.div`flex flex-col w-full`;
const StyledChat = tw.div`flex`;

export default Chat;
