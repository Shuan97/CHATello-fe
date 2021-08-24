import ModalHeader from "components/common/Modal/ModalHeader";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ModalDialog from "./ModalDialog";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";
import { SizeEnum } from "constants/enums";

export interface IModalProps {
  children: React.ReactNode | React.ReactNode[];
  show: boolean | null;
  size: string;
  onHide: (show: boolean) => void;
}

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  show: PropTypes.bool.isRequired,
  size: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

const defaultProps = {
  show: false,
  size: SizeEnum.MEDIUM,
  onHide: () => {
    console.log("Hide modal");
  },
};

const Modal: React.FC<IModalProps> = ({
  children,
  show,
  onHide,
  size,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    !!show && setShowModal(true);
    return () => {
      setShowModal(false);
    };
  }, [show]);

  if (!showModal) {
    return null;
  }

  const handleBackdropClick = () => {
    setShowModal(false);
    onHide(false);
  };

  return (
    <StyledModal role='dialog'>
      <Backdrop onClick={handleBackdropClick} />
      <ModalDialog show={show} onHide={onHide} size={size} {...props}>
        {children}
      </ModalDialog>
    </StyledModal>
  );
};

const StyledModal = styled.div.attrs({
  className: "flex-center fixed w-screen h-screen z-50 top-0 left-0",
})``;
const Backdrop = styled.div.attrs({
  className: "absolute h-full w-full opacity-50 bg-black -z-10 cursor-pointer",
})``;

Modal.displayName = "Modal";
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Object.assign(Modal, {
  Dialog: ModalDialog,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
