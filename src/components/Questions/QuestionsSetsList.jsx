import Container, { InnerContainer } from "components/common/Container";
import TextareaInput from "components/common/Form/TextareaInput";
import TextInput from "components/common/Form/TextInput";
import Heading, { Spacer } from "components/common/Heading";
import Modal from "components/common/Modal/Modal";
import VariantButton from "components/common/VariantButton";
import SetListItem from "components/Questions/SetListItem";
import { RoleEnum, SizeEnum } from "constants/enums";
import { variant } from "constants/variant";
import { createArticle } from "features/articlesSlice";
import { fetchCategoryByUUID } from "features/categoriesSlice";
import { createSet, fetchAllSets, selectAllSets } from "features/setsSlice";
import { selectUser } from "features/userSlice";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import { historyLink } from "utils/history";
import * as Yup from "yup";

const QuestionsSetsList = () => {
  const { categoryUUID } = useParams();
  const dispatch = useDispatch();
  const sets = useSelector(selectAllSets);
  const user = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSets({ categoryUUID: categoryUUID }));
  }, []);

  const renderSets = () => {
    if (!categoryUUID && !sets && sets.length < 1) {
      return <div>No sets found</div>;
    }
    return sets.map((set) => (
      <Link
        key={set.UUID}
        to={historyLink(`/questions_set/${set.UUID}`)}
        className={`${set.name.length > 64 ? "flex-basis-600" : ""}`}
      >
        <SetListItem set={set} />
      </Link>
    ));
  };

  return (
    <Container>
      <InnerContainer>
        <HeaderWrapper>
          <Heading>Please select the questions set</Heading>
          <Spacer />
          {user && user.role === RoleEnum.ADMIN && (
            <VariantButton
              text='Add'
              variant={variant.SUCCESS}
              onClick={() => setShowModal(true)}
            />
          )}
        </HeaderWrapper>
        <List>{renderSets()}</List>
      </InnerContainer>
      <NewSetModal
        showModal={showModal}
        setShowModal={setShowModal}
        categoryUUID={categoryUUID}
      />
    </Container>
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
  }
`;

const NewSetModal = ({ showModal, setShowModal, categoryUUID }) => {
  const dispatch = useDispatch();

  const [validationSchema] = useState(
    Yup.object().shape({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Name must have at least 3 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(3, "Description must have at least 3 characters")
        .max(64000, "Maximum number of characters allowed is 64000"),
    })
  );

  const handleSubmit = ({ name, description, categoryUUID }) => {
    console.log({ name, description, categoryUUID });
    if (!!categoryUUID) {
      dispatch(
        createSet({
          name: name,
          description: description,
          categoryUUID: categoryUUID,
        })
      ).then(() => {
        dispatch(fetchAllSets({ categoryUUID: categoryUUID }));
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
        name: "",
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        handleSubmit({
          name: values.name,
          description: values.description,
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
            <Modal.Header title={"Add new questions set"} />
            <Modal.Body>
              <div className='flex flex-col w-full text-white'>
                <TextInput placeholder='Name' label='Name' name='name' />
                <TextareaInput
                  placeholder='Description here...'
                  label='Description'
                  name='description'
                  rows={3}
                />
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

const HeaderWrapper = tw.div`flex items-center`;

export default QuestionsSetsList;
