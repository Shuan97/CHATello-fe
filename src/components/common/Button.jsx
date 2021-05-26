import React from "react";
import styled from "styled-components";

const Button = ({ type, variant, value, onClick, ...props }) => {
  return (
    <StyledButton {...type} {...variant} {...onClick} {...props}>
      {/* <StyledButton type={type} variant={variant} onClick={onClick} {...props}> */}
      {value}
    </StyledButton>
  );
};

const StyledButton = styled.button.attrs({
  className: "px-1.5 py-3",
})``;

export default Button;
