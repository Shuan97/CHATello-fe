import Container, { InnerContainer } from "components/common/Container";
import TextareaInput from "components/common/Form/TextareaInput";
import TextInput from "components/common/Form/TextInput";
import Modal from "components/common/Modal/Modal";
import VariantButton from "components/common/VariantButton";
import ArticleListItem from "components/KnowledgeCenter/ArticleListItem";
import { SizeEnum } from "constants/enums";
import { variant } from "constants/variant";
import { createArticle } from "features/articlesSlice";
import {
  fetchCategoryByUUID,
  selectCategoryWithArticles,
} from "features/categoriesSlice";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import { historyLink } from "utils/history";
import * as Yup from "yup";
import Heading, { Description, Spacer } from "../common/Heading";

const ArticleList = () => {
  const { categoryUUID } = useParams();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { name, description, articles } = useSelector(
    selectCategoryWithArticles
  );

  useEffect(() => {
    dispatch(fetchCategoryByUUID({ categoryUUID: categoryUUID }));
  }, []);

  const renderArticles = () => {
    if (!categoryUUID && !name && articles.length < 1) {
      return <div>No articles found</div>;
    }
    return articles.map((article) => (
      <Link
        key={article.UUID}
        to={historyLink(`/knowledge_center/article/${article.UUID}`)}
        className={`${article.title.length > 64 ? "flex-basis-600" : ""}`}
      >
        <ArticleListItem article={article} />
      </Link>
    ));
  };

  return (
    <Container>
      <InnerContainer>
        <HeaderWrapper>
          <Heading>{name}</Heading>
          <Spacer />
          <VariantButton
            text='Add'
            variant={variant.SUCCESS}
            onClick={() => setShowModal(true)}
          />
        </HeaderWrapper>
        <Description>{description}</Description>
        <List>{renderArticles()}</List>
      </InnerContainer>
      <NewArticleModal
        showModal={showModal}
        setShowModal={setShowModal}
        categoryUUID={categoryUUID}
      />
    </Container>
  );
};

const NewArticleModal = ({ showModal, setShowModal, categoryUUID }) => {
  const dispatch = useDispatch();

  const [validationSchema] = useState(
    Yup.object().shape({
      title: Yup.string()
        .required("Title is required")
        .min(3, "Title must have at least 3 characters"),
      body: Yup.string()
        .required("Body is required")
        .min(3, "Body must have at least 3 characters")
        .max(64000, "Maximum number of characters allowed is 64000"),
    })
  );

  const handleSubmit = ({ title, body, categoryUUID }) => {
    console.log({ title, body, categoryUUID });
    if (!!categoryUUID) {
      dispatch(
        createArticle({
          title: title,
          body: body,
          categoryUUID: categoryUUID,
        })
      ).then(() => {
        dispatch(fetchCategoryByUUID({ categoryUUID: categoryUUID }));
        setShowModal(false);
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Formik
      initialValues={{
        title: "",
        body: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        handleSubmit({
          title: values.title,
          body: values.body,
          categoryUUID: categoryUUID,
        });
        resetForm();
      }}
    >
      {({ values }) => (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size={SizeEnum.FULL}
        >
          <Form>
            <Modal.Header title={"Add new article"} />
            <Modal.Body>
              <div className='flex flex-col w-full text-white'>
                <TextInput placeholder='Title' label='Title' name='title' />
                <TextareaInput
                  placeholder='Type your markdown here...'
                  label='Body'
                  name='body'
                />
                <MarkdownPreview>
                  <Description>Preview</Description>
                  <ReactMarkdown
                    className='text-white'
                    remarkPlugins={[remarkGfm]}
                  >
                    {values.body}
                  </ReactMarkdown>
                </MarkdownPreview>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <VariantButton
                  type='reset'
                  variant={variant.DANGER}
                  text='Cancel'
                  onClick={handleCancel}
                />
                <VariantButton
                  type='submit'
                  variant={variant.SUCCESS}
                  text='Create'
                />
              </div>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -16px;

  > a {
    display: flex;
    flex: 1 0 360px;
    padding: 0 16px;

    &.flex-basis-600 {
      flex-basis: 600px;
    }

    /* @media (min-width: 768px) {
      flex: 0 0 50%;
    }
    @media (min-width: 1024px) {
      flex: 0 0 33%;
    }
    @media (min-width: 1280px) {
      flex: 0 0 25%;
    }
    @media (min-width: 1536px) {
      flex: 0 0 20%;
    } */
  }
`;

const HeaderWrapper = tw.div`flex items-center`;
const MarkdownPreview = styled.div.attrs({
  className: "px-4 py-1 bg-primary-1",
})`
  height: 360px;
  /* background: 2px solid ${({ theme }) => theme.shadowAccent}; */
  border: 2px solid ${({ theme }) => theme.shadowAccent};
  border-radius: 8px;
  margin-top: 16px;
  overflow: auto;
`;

export default ArticleList;
