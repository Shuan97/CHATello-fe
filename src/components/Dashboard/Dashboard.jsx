import ChatIcon from "@material-ui/icons/Chat";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import WidgetsIcon from "@material-ui/icons/Widgets";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const Dashboard = () => {
  return (
    <BlocksContainer>
      {/* <Header>Welcome!</Header> */}
      <BlockWrapper>
        <Link to='/chat'>
          <Block>
            <ChatIcon>Hello</ChatIcon>
            <Label>Chat</Label>
          </Block>
        </Link>
        <Link to='/'>
          <Block>
            <WidgetsIcon />
            <Label>Knowledge center</Label>
          </Block>
        </Link>
        <Link to='/'>
          <Block>
            <GroupWorkIcon />
            <Label>[WIP]</Label>
          </Block>
        </Link>
        <Link to='/'>
          <Block>
            <GroupWorkIcon />
            <Label>[WIP]</Label>
          </Block>
        </Link>
      </BlockWrapper>
    </BlocksContainer>
  );
};

const BlocksContainer = styled.div.attrs({
  className: "flex-center w-full h-full",
})``;
const BlockWrapper = styled.div.attrs({
  className: "flex-center flex-wrap",
})`
  width: 800px;
  gap: 32px;

  @media (max-width: 768px) {
    width: 400px;
  }
`;
const Block = styled.div.attrs({
  className: "flex-center flex-col rounded-lg p-4",
})`
  width: 320px;
  height: 320px;
  background: ${({ theme }) => theme.backgroundPrimary};

  svg {
    font-size: 8rem;
  }

  &:hover {
    box-shadow: 0 0 8px 2px ${({ theme }) => theme.shadowAccent};
    transform: translate(0, -8px);

    h4,
    svg {
      color: ${({ theme }) => theme.shadowAccent};
    }
  }

  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const Header = tw.div`flex-center flex-1 w-full`;
const Label = tw.h4`flex-center my-4 text-white text-4xl`;

export default Dashboard;
