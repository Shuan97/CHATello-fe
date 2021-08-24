import Block from "components/common/Block";
import React from "react";
import tw from "tailwind-styled-components";
import styled from "styled-components";

const CategoryBlock = ({ category }) => {
  return (
    <StyledBlock className='cursor-pointer'>
      <Image src={category.image} alt={category.name} />
      <Wrapper>
        <Label>{category.name}</Label>
        <Description>{category.description}</Description>
      </Wrapper>
    </StyledBlock>
  );
};

const StyledBlock = tw(Block)`flex flex-row items-start my-8`;
const Image = tw.img`w-32 h-32`;
const Wrapper = tw.div`flex mx-8 flex-1 flex-col `;
const Label = tw.div`text-xl mb-4 font-bold`;
const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: gray;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export default CategoryBlock;
