import Container, { InnerContainer } from "components/common/Container";
import React, { useEffect, useState } from "react";
import Heading, { Description } from "../common/Heading";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";
import { fetchArticleByUUID, selectArticle } from "features/articlesSlice";

const Article = () => {
  const { articleUUID } = useParams();
  const dispatch = useDispatch();
  const { title, body, createdAt } = useSelector(selectArticle);
  // const [value, setValue] = useState("");

  useEffect(() => {
    dispatch(fetchArticleByUUID({ articleUUID: articleUUID }));
  }, []);

  return (
    <Container>
      <InnerContainer>
        <Heading>{title}</Heading>
        <Description>
          Created at {new Date(createdAt).toLocaleString()}
        </Description>
        <ReactMarkdown className='text-white' remarkPlugins={[remarkGfm]}>
          {body}
        </ReactMarkdown>
        {/* <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <ReactMarkdown className='text-white' remarkPlugins={[remarkGfm]}>
          {value}
        </ReactMarkdown> */}
      </InnerContainer>
    </Container>
  );
};

export default Article;
