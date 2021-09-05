import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { setChannelInfo } from "features/channelsSlice";
import ChatIcon from "@material-ui/icons/Chat";

const SidebarChannel = ({ id, channelName, channelType }) => {
  const dispatch = useDispatch();

  return (
    <StyledSidebarChannel
      onClick={() =>
        dispatch(
          setChannelInfo({
            UUID: id,
            name: channelName,
            type: channelType,
          })
        )
      }
    >
      <ChannelLabel>
        <ChatIcon className='mr-2' />
        {channelName}
      </ChannelLabel>
    </StyledSidebarChannel>
  );
};

export default SidebarChannel;

const StyledSidebarChannel = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
  cursor: pointer;
`;

const ChannelLabel = styled.h4`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};

  ${StyledSidebarChannel}:hover && {
    color: ${({ theme }) => theme.textPrimary};
  }

  span {
    font-size: 1.25rem;
    margin-right: 0.375rem;
  }
`;
