import Container, { InnerContainer } from "components/common/Container";
import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategories,
  setCategoryInfo,
} from "features/categoriesSlice";
import CategoryBlock from "components/KnowledgeCenter/CategoryBlock";
import { Link } from "react-router-dom";
import { historyLink } from "utils/history";
import Heading from "components/common/Heading";

const KnowledgeCenter = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const renderList = () => {
    if (!!categories && categories.length > 0) {
      return categories.map((category) => (
        <Link
          key={category.UUID}
          to={historyLink(`/knowledge_center/${category.UUID}`)}
          onClick={() =>
            dispatch(
              setCategoryInfo({
                selectedCategory: category,
              })
            )
          }
        >
          <CategoryBlock category={category} />
        </Link>
      ));
    } else {
      return <div>No categories found</div>;
    }
  };

  return (
    <Container>
      <InnerContainer>
        <Heading>Welcome to Knowledge Center!</Heading>
        <Body>
          <List>{renderList()}</List>
        </Body>
      </InnerContainer>
    </Container>
  );
};

const Body = tw.div`text-white`;
const List = tw.div`pb-8`;

export default KnowledgeCenter;
