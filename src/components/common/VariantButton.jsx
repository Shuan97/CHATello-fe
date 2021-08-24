import { variant as btnVariant } from "constants/variant";
import React from "react";
import tw from "tailwind-styled-components";

const defaultProps = {
  type: "button",
  variant: btnVariant.PRIMARY,
  text: "Click me!",
};

const VariantButton = ({ type, variant, text, ...props }) => {
  return (
    <StyledButton type={type} variant={variant} {...props}>
      {text}
    </StyledButton>
  );
};

const StyledButton = tw.button`py-1.5 px-3 m-1.5 rounded 
${({ variant }) => {
  switch (variant) {
    case btnVariant.PRIMARY:
      return "bg-purple-600";
    case btnVariant.SUCCESS:
      return "bg-green-500";
    case btnVariant.WARN:
      return "bg-yellow-300";
    case btnVariant.DANGER:
      return "bg-red-600";
    case btnVariant.INFO:
      return "bg-gray-600";
    default:
      return "bg-gray-200";
  }
}}
`;

VariantButton.defaultProps = defaultProps;

export default VariantButton;
