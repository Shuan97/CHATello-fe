import ChatNavbar from "components/Chat/ChatNavbar";
import ChatSidebar from "components/Chat/ChatSidebar/ChatSidebar";
import VoiceChannelDisplay from "components/Chat/VoiceChannel/VoiceChannelDisplay";
import {
  fetchTextChannels,
  selectCurrentChannel,
} from "features/channelsSlice";
import { fetchMessagesByChannel } from "features/messagesSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-styled-components";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const Chat = () => {
  const dispatch = useDispatch();
  const { UUID, name, type } = useSelector(selectCurrentChannel);

  useEffect(() => {
    if (!UUID) {
      dispatch(fetchTextChannels());
    } else {
      dispatch(fetchMessagesByChannel());
    }
  }, [dispatch, UUID]);

  const renderChat = () => {
    if (type === "TEXT") {
      return (
        <>
          <ChatMessages />
          <ChatInput channelUUID={UUID} channelName={name} />
        </>
      );
    }
    if (type === "VOICE") {
      return <VoiceChannelDisplay channelUUID={UUID} channelName={name} />;
    }
  };

  return (
    <StyledChat>
      <ChatNavbar />
      <ChatSidebar />
      <MainChat>
        <ChatHeader channelName={name} />
        {renderChat()}
      </MainChat>
    </StyledChat>
  );
};

const MainChat = tw.div`flex flex-col w-full`;
const StyledChat = tw.div`flex`;

export default Chat;
