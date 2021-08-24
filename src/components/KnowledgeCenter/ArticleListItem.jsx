import Block from "components/common/Block";
import { Description } from "components/common/Heading";
import React from "react";
import tw from "tailwind-styled-components";
import { formatDate } from "utils/helpers";

const ArticleListItem = ({ article }) => {
  return (
    <StyledBlock className='cursor-pointer'>
      <Wrapper>
        <Label>{article.title}</Label>
        <Description>{formatDate(article.createdAt)}</Description>
      </Wrapper>
    </StyledBlock>
  );
};

const StyledBlock = tw(Block)`flex flex-1 flex-row items-start my-8`;
// const Image = tw.img`w-32 h-32`;
const Wrapper = tw.div`flex mx-8 my-4 flex-1 flex-col `;
const Label = tw.div`text-xl font-bold`;

export default ArticleListItem;
