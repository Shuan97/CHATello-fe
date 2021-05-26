import ModalHeader from "components/common/Modal/ModalHeader";
import React from "react";
import styled from "styled-components";

const Modal = ({ children, show, onHide, ...props }) => {
  return (
    <StyledModal role='dialog'>
      <Dialog>{children}</Dialog>
    </StyledModal>
  );
};

const StyledModal = styled.div``;

const Dialog = styled.div``;
const Body = styled.div``;
const Footer = styled.div``;
const Title = styled.div``;

export default Object.assign(Modal, {
  Dialog: Dialog,
  Header: ModalHeader,
  Body: Body,
  Footer: Footer,
  Title: Title,
});
