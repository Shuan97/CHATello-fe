import ChatIcon from "@material-ui/icons/Chat";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import WidgetsIcon from "@material-ui/icons/Widgets";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import { historyLink } from "utils/history";

const Dashboard = () => {
  return (
    <BlocksContainer>
      {/* <Header>Welcome!</Header> */}
      <BlockWrapper>
        <Link to={historyLink("/chat")}>
          <Block>
            <ChatIcon>Hello</ChatIcon>
            <Label>Chat</Label>
          </Block>
        </Link>
        <Link to={historyLink("/chat")}>
          <Block>
            <WidgetsIcon />
            <Label>Knowledge center</Label>
          </Block>
        </Link>
        <Link to={historyLink("/chat")}>
          <Block>
            <GroupWorkIcon />
            <Label>[WIP]</Label>
          </Block>
        </Link>
        <Link to={historyLink("/chat")}>
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
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 16%), 0px 1px 10px 0px rgb(0 0 0 / 12%);

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
