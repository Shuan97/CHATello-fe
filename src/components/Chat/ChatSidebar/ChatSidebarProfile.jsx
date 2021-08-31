import { Avatar } from "@material-ui/core";
import HeadsetRoundedIcon from "@material-ui/icons/HeadsetRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import { selectUser } from "../../../features/userSlice";

const SidebarProfile = () => {
  const user = useSelector(selectUser);

  return (
    <StyledSidebarProfile>
      <Avatar src={`${user?.image}`} onClick={() => null} />
      <ProfileInfo>
        <h3>{user?.name}</h3>
        <p>{user?.nickname}#0000</p>
      </ProfileInfo>
      <ProfileIcons>
        <MicRoundedIcon />
        <HeadsetRoundedIcon />
        <SettingsRoundedIcon onClick={() => null} />
      </ProfileIcons>
    </StyledSidebarProfile>
  );
};

export default SidebarProfile;

const StyledSidebarProfile = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.5rem;
`;

const ProfileInfo = styled.div`
  margin: 0 0.5rem;
  flex: 1;
  overflow: hidden;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  h3 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textPrimary};
  }
  p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.675rem;
  }
`;
const ProfileIcons = styled.div`
  display: flex;
  svg {
    margin: 0.25rem;
    font-size: 1.25rem;
  }
`;
