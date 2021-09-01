import { Avatar } from "@material-ui/core";
import { selectUser } from "features/userSlice";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";

interface IMessageProps {
  message: any;
}

interface IMessageContainer {
  isUserMessage: boolean;
}

const Message: React.FC<IMessageProps> = ({ message }) => {
  const date = new Date(message.createdAt).toLocaleString();
  const { UUID } = useSelector(selectUser);

  const isUserMessage = () => {
    return UUID === message.user.UUID;
  };

  return (
    <MessageListItem>
      {!!message.user && (
        <MessageContainer isUserMessage={isUserMessage()}>
          <Avatar src={message.user?.image} />
          <MessageWrapper>
            <MessageHeader>
              <MessageLabel
                className={`${
                  message.user.name.indexOf("ADMIN") === 0 && "text-accent-1"
                }`}
              >
                {message.user.name}
              </MessageLabel>
              <MessageTimestamp>{date}</MessageTimestamp>
            </MessageHeader>
            <MessageBodyContent isUserMessage={isUserMessage()}>
              <span>{message.body}</span>
            </MessageBodyContent>
          </MessageWrapper>
        </MessageContainer>
      )}
    </MessageListItem>
  );
};

const MessageListItem = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textPrimary};
`;

const MessageContainer = styled.div<IMessageContainer>`
  display: flex;
  width: 100%;
  margin: 0.5rem 0;
  ${({ isUserMessage }) => isUserMessage && "flex-direction: row-reverse"};
`;

const MessageBodyContent = styled.div<IMessageContainer>`
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: ${({ isUserMessage }) => (isUserMessage ? "#57595C" : "#444")};
  font-size: 0.875rem;
  box-shadow: 0 0 4px ${({ theme }) => theme.borderPrimary};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 360px;
  max-width: 75%;
  margin: 0 1rem;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.25rem;
`;

const MessageLabel = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
`;

const MessageTimestamp = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.625rem;
  font-size: x-small;
`;

export default Message;
