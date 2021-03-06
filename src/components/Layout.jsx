import Dashboard from "components/Dashboard/Dashboard";
import Article from "components/KnowledgeCenter/Article";
import ArticleList from "components/KnowledgeCenter/ArticleList";
import KnowledgeCenter from "components/KnowledgeCenter/KnowledgeCenter";
import Navbar from "components/Navbar/Navbar";
import QuestionsCategoriesList from "components/Questions/QuestionsCategoriesList";
import QuestionsSet from "components/Questions/QuestionsSet";
import QuestionsSetsList from "components/Questions/QuestionsSetsList";
import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Chat from "./Chat/Chat";

const Layout = () => {
  return (
    <StyledLayout id='layout'>
      <Navbar />
      <Main id='main-content'>
        <Switch>
          <Route exact path='/chat'>
            <Chat />
          </Route>
          <Route exact path='/knowledge_center/article/:articleUUID'>
            <Article />
          </Route>
          <Route exact path='/knowledge_center/:categoryUUID'>
            <ArticleList />
          </Route>
          <Route exact path='/knowledge_center'>
            <KnowledgeCenter />
          </Route>
          <Route exact path='/test_your_knowledge'>
            <QuestionsCategoriesList />
          </Route>
          <Route exact path='/test_your_knowledge/:categoryUUID'>
            <QuestionsSetsList />
          </Route>
          <Route exact path='/questions_set/:setUUID'>
            <QuestionsSet />
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
  overflow: auto;

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
