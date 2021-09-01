import Container, { InnerContainer } from "components/common/Container";
import Heading, { Description } from "components/common/Heading";
import CategoryBlock from "components/KnowledgeCenter/CategoryBlock";
import {
  fetchCategories,
  selectCategories,
  setCategoryInfo,
} from "features/categoriesSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";
import { historyLink } from "utils/history";

const QuestionsCategoriesList = () => {
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
          to={historyLink(`/test_your_knowledge/${category.UUID}`)}
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
        <Heading>Test your knowledge!</Heading>
        <Description>Please select the category</Description>
        <Body>
          <List>{renderList()}</List>
        </Body>
      </InnerContainer>
    </Container>
  );
};

const Body = tw.div`text-white`;
const List = tw.div`pb-8`;

export default QuestionsCategoriesList;
