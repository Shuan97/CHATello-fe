import React from "react";
import PropTypes from "prop-types";
import { IModalProps } from "./Modal";
import styled from "styled-components";
import { ITheme } from "interfaces/theme.interface";

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

const defaultProps = {
  show: false,
  onHide: () => {
    console.log("Hide modal");
  },
};

const ModalDialog: React.FC<IModalProps> = ({
  children,
  show,
  onHide,
  ...props
}) => {
  return (
    <Dialog>
      <DialogContent className='box-shadow'>{children}</DialogContent>
    </Dialog>
  );
};

ModalDialog.displayName = "ModalDialog";
ModalDialog.propTypes = propTypes;
ModalDialog.defaultProps = defaultProps;

const Dialog = styled.div`
  max-width: 480px;
  width: 100%;
`;

const DialogContent = styled.div`
  background: ${({ theme }: ITheme) => theme.backgroundPrimary};
  color: white;
  border-radius: 8px;
`;

export default ModalDialog;
