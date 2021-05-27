import React from 'react'
import tw from 'tailwind-styled-components'

export interface IModalFooterProps {
  children: React.ReactNode | React.ReactNode[],
  show: boolean | null,
  onHide?: () => void | null,
}

const ModalFooter: React.FC<IModalFooterProps> = ({ children }) => {
  return (
    <Footer>
      {children}
    </Footer>
  )
}

const Footer = tw.div`flex justify-end border-t border-gray-600 p-4`

export default ModalFooter
