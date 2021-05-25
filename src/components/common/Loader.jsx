import React from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const Loader = () => {
  return (
    <Container>
      <Wrapper>
        <LoaderDot />
        <LoaderDot />
        <LoaderDot />
      </Wrapper>
    </Container>
  );
};

const Container = tw.div`flex-center h-full w-full`;

const Wrapper = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
const LoaderDot = styled.div`
  width: 0.75em;
  height: 0.75em;
  border-radius: 50%;
  background: #fafafa;
  animation-duration: 1.3s;
  animation-iteration-count: infinite;

  @keyframes loader_left {
    0% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.3;
    }
    40% {
      opacity: 0.8;
    }
    60% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes loader_middle {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 0.8;
    }
    40% {
      opacity: 0.3;
    }
    60% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes loader_right {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 1;
    }
    40% {
      opacity: 0.8;
    }
    60% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
  &:nth-of-type(1) {
    animation-name: loader_left;
  }
  &:nth-of-type(2) {
    animation-name: loader_middle;
  }
  &:nth-of-type(3) {
    animation-name: loader_right;
  }
`;

export default Loader;
