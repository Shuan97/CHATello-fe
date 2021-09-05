import PersonIcon from "@material-ui/icons/Person";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import { setChannelInfo } from "features/channelsSlice";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import tw from "tailwind-styled-components";

const VoiceChannelItem = ({ id, channelName, channelType, participants }) => {
  const dispatch = useDispatch();

  return (
    <VoiceChannelWrapper>
      <StyledVoiceChannel
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
          <VolumeUpIcon className='mr-2' />
          {channelName}
        </ChannelLabel>
      </StyledVoiceChannel>
      <ParticipantsList>
        {!!participants &&
          // !!participants.length &&
          participants.length > 0 &&
          participants.map((participant) => {
            return (
              <Participant key={participant.userUUID}>
                <PersonIcon className='mr-2' />
                {participant.userName}
              </Participant>
            );
          })}
      </ParticipantsList>
    </VoiceChannelWrapper>
  );
};

export default VoiceChannelItem;

const VoiceChannelWrapper = tw.div``;

const StyledVoiceChannel = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
  cursor: pointer;
`;

const ChannelLabel = styled.h4`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};

  ${StyledVoiceChannel}:hover && {
    color: ${({ theme }) => theme.textPrimary};
  }

  span {
    font-size: 1.25rem;
    margin-right: 0.375rem;
  }
`;

const ParticipantsList = tw.ul``;
const Participant = tw.li`px-4 py-2 ml-8 hover:text-accent-1 cursor-pointer text-sm`;
