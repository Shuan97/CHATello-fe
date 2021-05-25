import Dashboard from "components/Dashboard/Dashboard";
import Navbar from "components/Navbar/Navbar";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Chat from "./Chat/Chat";

const Layout = () => {
  return (
    <StyledLayout id='layout'>
      <Navbar />
      <Main>
        <Switch>
          <Route exact path='/chat'>
            <Chat />
          </Route>
          <Route exact path='/'>
            <Dashboard />
          </Route>
          <Route path='*'>No match Layout</Route>
        </Switch>
      </Main>
    </StyledLayout>
  );
};

const Main = styled.main`
  display: flex;
  height: calc(100% - 64px);
  > * {
    flex: 1 100%;
  }
`;

export default Layout;

const StyledLayout = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: row wrap;
  height: 100%;
  width: 100%;

  > * {
    flex: 1 100%;
  }
`;
// const StyledLayout = tw.div`flex items-center flex-col flex-1`;
