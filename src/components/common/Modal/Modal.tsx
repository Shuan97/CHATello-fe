import ModalHeader from "components/common/Modal/ModalHeader";
import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

interface ModalProps {
  children: React.ReactNode | React.ReactNode[],
  show: boolean | null,
  onHide?: () => void | null,
}

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.element
  ]),
  show: PropTypes.bool,
  onHide: PropTypes.func,
}

// eslint-disable-next-line react/prop-types

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Modal: React.FC<ModalProps> = ({ children, show, onHide, ...props }) => {
  return (
    <StyledModal role='dialog'>
      <Backdrop />
      <Dialog>{children}</Dialog>
    </StyledModal>
  );
};

const StyledModal = styled.div``;
const Backdrop = styled.div``

const Dialog = styled.div``;
const Body = styled.div``;
const Footer = styled.div``;
const Title = styled.div``;

Modal.propTypes = propTypes;

export default Object.assign(Modal, {
  Dialog: Dialog,
  Header: ModalHeader,
  Body: Body,
  Footer: Footer,
  Title: Title,
});
