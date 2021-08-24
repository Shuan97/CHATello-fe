import React from "react";
import PropTypes from "prop-types";
import { IModalProps } from "./Modal";
import styled from "styled-components";
import { ITheme } from "interfaces/theme.interface";
import { SizeEnum } from "constants/enums";

interface IDialogSize {
  size: string;
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
  onHide: () => {
    console.log("Hide modal");
  },
};

const ModalDialog: React.FC<IModalProps> = ({
  children,
  show,
  onHide,
  size,
  ...props
}) => {
  return (
    <Dialog size={size}>
      <DialogContent className='box-shadow' {...props}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

ModalDialog.displayName = "ModalDialog";
ModalDialog.propTypes = propTypes;
ModalDialog.defaultProps = defaultProps;

const Dialog = styled.div`
  max-width: ${({ size }: IDialogSize) => {
    switch (size) {
      case SizeEnum.SMALL:
        return "360px";
      case SizeEnum.MEDIUM:
        return "480px";
      case SizeEnum.LARGE:
        return "640px";
      case SizeEnum.FULL:
        return "90%";
      default:
        return "480px";
    }
  }};
  width: 100%;
`;

const DialogContent = styled.div`
  background: ${({ theme }: ITheme) => theme.backgroundPrimary};
  color: white;
  border-radius: 8px;
`;

export default ModalDialog;
