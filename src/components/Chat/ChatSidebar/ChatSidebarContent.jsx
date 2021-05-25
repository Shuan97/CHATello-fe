import AddRoundedIcon from "@material-ui/icons/AddRounded";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { createChannel, selectTextChannels } from "features/channelsSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import SidebarChannel from "./ChatSidebarChannel";

const SidebarContent = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectTextChannels);

  const handleAddChannel = () => {
    const channelName = prompt("Enter new channel name");

    if (channelName) {
      dispatch(createChannel({ name: channelName }));
    }
  };

  return (
    <StyledSidebarContent>
      <ChannelHeaderWrapper>
        <ChannelHeader>
          <ExpandMoreRoundedIcon />
          <h2>Text channels</h2>
        </ChannelHeader>
        <AddRoundedIcon onClick={handleAddChannel} />
      </ChannelHeaderWrapper>
      <ChannelsList>
        {channels &&
          channels.length > 0 &&
          channels.map(({ UUID, name }) => (
            <SidebarChannel key={UUID} id={UUID} channelName={name} />
          ))}
      </ChannelsList>

      <ChannelHeaderWrapper>
        <ChannelHeader>
          <ExpandMoreRoundedIcon />
          <h2>Voice channels</h2>
        </ChannelHeader>
        <AddRoundedIcon />
      </ChannelHeaderWrapper>
    </StyledSidebarContent>
  );
};

export default SidebarContent;

const StyledSidebarContent = styled.div`
  height: 100%;
`;

const ChannelHeaderWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    transition: font-size 100ms linear, color 100ms linear;
    font-size: 1.25rem;
  }
`;

const ChannelHeader = styled.div`
  display: flex;
  flex: 1;

  h2 {
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }
`;

const ChannelsList = styled.div`
  /* border: 2px solid red; */
`;
