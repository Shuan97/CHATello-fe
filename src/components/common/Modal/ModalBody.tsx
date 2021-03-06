import React from 'react';
import tw from 'tailwind-styled-components';

export interface IModalBodyProps {
  children: React.ReactNode | React.ReactNode[],
  show: boolean | null,
  onHide?: () => void | null,
}

const ModalBody: React.FC<IModalBodyProps> = ({ children, ...props }) => {
  return (
    <Body>
      {children}
    </Body>
  )
}

const Body = tw.div`flex px-4 py-6`

export default ModalBody
