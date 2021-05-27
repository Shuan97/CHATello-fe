import React from "react";
import tw from "tailwind-styled-components";

const ModalHeader: React.FC<{title: string}> = ({ title }) => {
  return <Header>{title}</Header>;
};

const Header = tw.div`flex border-b border-gray-600 p-4`

export default ModalHeader;
