import { selectChannelName, selectChannelUUID } from "features/channelsSlice";
import { fetchMessagesByChannel } from "features/messagesSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const Chat = () => {
  const dispatch = useDispatch();
  const channelUUID = useSelector(selectChannelUUID);
  const channelName = useSelector(selectChannelName);

  useEffect(() => {
    !!channelUUID && dispatch(fetchMessagesByChannel());
  }, [dispatch, channelUUID]);

  return (
    <StyledChat>
      <ChatHeader channelName={channelName} />
      <ChatMessages />
      <ChatInput channelUUID={channelUUID} channelName={channelName} />
    </StyledChat>
  );
};

export default Chat;

const StyledChat = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
