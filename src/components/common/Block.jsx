import React from "react";
import styled from "styled-components";

// const Block = ({ children, ...props }) => {
//   return <StyledBlock {...props}>{children}</StyledBlock>;
// };

const Block = styled.div.attrs({
  className: "rounded-lg p-4",
})`
  background: ${({ theme }) => theme.backgroundPrimary};
  color: ${({ theme }) => theme.textPrimary};
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 16%), 0px 1px 10px 0px rgb(0 0 0 / 12%);

  svg {
    font-size: 8rem;
  }

  &:hover {
    box-shadow: 0 0 8px 2px ${({ theme }) => theme.shadowAccent};
    transform: translate(0, -8px);

    h4,
    svg {
      color: ${({ theme }) => theme.shadowAccent};
    }
  }

  /* @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  } */
`;

export default Block;
