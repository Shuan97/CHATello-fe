import { selectMessages } from "features/messagesSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Message from "../Message/Message";

const ChatMessages = () => {
  const messages = useSelector(selectMessages);
  const messagesWrapperRef = useRef();

  useEffect(() => {
    messagesWrapperRef.current.scrollTop =
      messagesWrapperRef.current.scrollHeight;
  }, [messages]);

  return (
    <StyledChatMessages role='log' ref={messagesWrapperRef}>
      <MessagesWrapper>
        {messages &&
          messages.length > 0 &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
      </MessagesWrapper>
    </StyledChatMessages>
  );
};

export default ChatMessages;

const StyledChatMessages = styled.div`
  display: flex;
  flex: 1;
  overflow-y: scroll;
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 2rem;
`;
