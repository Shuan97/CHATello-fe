import Container, { InnerContainer } from "components/common/Container";
import TextInput from "components/common/Form/TextInput";
import Modal from "components/common/Modal/Modal";
import VariantButton from "components/common/VariantButton";
import { RoleEnum, SizeEnum } from "constants/enums";
import { variant } from "constants/variant";
import { createQuestion, fetchSetByUUID, selectSet } from "features/setsSlice";
import { selectUser } from "features/userSlice";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import * as Yup from "yup";
import Heading, { Description, Footer, Spacer } from "../common/Heading";

const QuestionsSet = () => {
  const { setUUID } = useParams();
  const dispatch = useDispatch();
  const { name, description, questions } = useSelector(selectSet);
  const [answers, setAnswers] = useState({});
  const [areAnswersSubmitted, setAreAnswersSubmitted] = useState(false);
  const [answersResult, setAnswersResult] = useState({
    answersCount: 0,
    correctAnswersCount: 0,
  });
  const user = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSetByUUID({ setUUID: setUUID }));
  }, []);

  const handleChange = (e) => {
    const [{ options }] = questions.filter(
      (question) => question.UUID === e.target.name
    );
    const [correctOption] = options.filter(
      (option) => option.isPositive === true
    );
    setAnswers((prevState) => {
      return {
        ...prevState,
        [e.target.name]: {
          selectedAnswer: e.target.id,
          correctAnswer: correctOption.UUID,
        },
      };
    });
  };

  const handleSubmit = () => {
    Object.keys(answers).forEach((key) => {
      setAnswersResult((prevState) => {
        return {
          ...prevState,
          answersCount: prevState.answersCount + 1,
        };
      });
      if (answers[key].selectedAnswer === answers[key].correctAnswer) {
        setAnswersResult((prevState) => {
          return {
            ...prevState,
            correctAnswersCount: prevState.correctAnswersCount + 1,
          };
        });
      }
    });
    scrollTop();
    setAreAnswersSubmitted(true);
  };

  const scrollTop = () => {
    const mainContent = document.querySelector("#main-content");
    !!mainContent && (mainContent.scrollTop = 0);
  };

  const renderQuestions = () => {
    if (!questions && questions.length < 1) {
      return <div>No questions found</div>;
    }
    return questions.map((question, i) => (
      <QuestionContainer key={question.UUID}>
        <QuestionText>{`${i + 1}. ${question.questionText}`}</QuestionText>
        {question.options &&
          question.options.length > 0 &&
          question.options.map((option) => {
            return (
              <QuestionOption key={option.UUID} onChange={handleChange}>
                <input
                  type='radio'
                  id={option.UUID}
                  name={`${question.UUID}`}
                  value={option.optionText}
                  hidden
                  disabled={areAnswersSubmitted}
                />
                <QuestionOptionLabel
                  htmlFor={option.UUID}
                  className={
                    !areAnswersSubmitted
                      ? "border-eerie-500"
                      : option.isPositive
                      ? "positive"
                      : "negative"
                  }
                >
                  {option.optionText}
                </QuestionOptionLabel>
              </QuestionOption>
            );
          })}
      </QuestionContainer>
    ));
  };

  return (
    <Container>
      <InnerContainer>
        <HeaderWrapper>
          <Heading>{name}</Heading>
          <Spacer />
          {user && user.role === RoleEnum.ADMIN && (
            <VariantButton
              text='Add'
              variant={variant.SUCCESS}
              onClick={() => setShowModal(true)}
            />
          )}
        </HeaderWrapper>
        <Description>{description}</Description>
        {!!areAnswersSubmitted && (
          <AnswersResult>
            Correctly answered to {answersResult.correctAnswersCount} of{" "}
            {answersResult.answersCount} questions. This is&nbsp;
            <span className='text-green-500'>
              {(
                answersResult.correctAnswersCount / answersResult.answersCount
              ).toFixed(2) * 100}
              %
            </span>
            .&nbsp;See the results below:
          </AnswersResult>
        )}
        <QuestionsWrapper>{renderQuestions()}</QuestionsWrapper>
        <Footer>
          {!areAnswersSubmitted && (
            <VariantButton
              type='submit'
              variant={variant.SUCCESS}
              text='Submit answers'
              onClick={handleSubmit}
            />
          )}
        </Footer>
      </InnerContainer>
      <NewQuestionModal
        showModal={showModal}
        setShowModal={setShowModal}
        setUUID={setUUID}
      />
    </Container>
  );
};

const NewQuestionModal = ({ showModal, setShowModal, setUUID }) => {
  const dispatch = useDispatch();

  const [validationSchema] = useState(
    Yup.object().shape({
      questionText: Yup.string()
        .required("Title is required")
        .min(3, "Title must have at least 3 characters"),
      // description: Yup.string()
      //   .required("Body is required")
      //   .min(3, "Body must have at least 3 characters")
      //   .max(64000, "Maximum number of characters allowed is 64000"),
      positiveOption: Yup.string()
        .required("Option is required")
        .min(3, "Option must have at least 3 characters"),
      negativeOption_1: Yup.string()
        .required("Option is required")
        .min(3, "Option must have at least 3 characters"),
      negativeOption_2: Yup.string()
        .required("Option is required")
        .min(3, "Option must have at least 3 characters"),
      negativeOption_3: Yup.string()
        .required("Option is required")
        .min(3, "Option must have at least 3 characters"),
    })
  );

  const handleSubmit = ({ values, setUUID }) => {
    const {
      questionText,
      description,
      positiveOption,
      negativeOption_1,
      negativeOption_2,
      negativeOption_3,
    } = values;
    if (!!setUUID) {
      dispatch(
        createQuestion({
          questionText: questionText,
          description: description,
          setUUID: setUUID,
          positiveOption: positiveOption,
          negativeOption_1: negativeOption_1,
          negativeOption_2: negativeOption_2,
          negativeOption_3: negativeOption_3,
        })
      ).then(() => {
        setTimeout(() => {
          dispatch(fetchSetByUUID({ setUUID: setUUID }));
          setShowModal(false);
        }, 1000);
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Formik
      initialValues={{
        questionText: "",
        description: "",
        positiveOption: "",
        negativeOption_1: "",
        negativeOption_2: "",
        negativeOption_3: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        handleSubmit({
          values: values,
          setUUID: setUUID,
        });
        resetForm();
      }}
    >
      {({ resetForm }) => (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size={SizeEnum.FULL}
        >
          <Form>
            <Modal.Header title={"Add new question"} />
            <Modal.Body>
              <div className='flex flex-col w-full text-white'>
                <TextInput
                  placeholder='Question'
                  label='Question'
                  name='questionText'
                />
                <TextInput
                  placeholder='Positive option'
                  label='Positive option'
                  name='positiveOption'
                />
                <TextInput
                  placeholder='Negative option 1'
                  label='Negative option 1'
                  name='negativeOption_1'
                />
                <TextInput
                  placeholder='Negative option 2'
                  label='Negative option 2'
                  name='negativeOption_2'
                />
                <TextInput
                  placeholder='Negative option 3'
                  label='Negative option 3'
                  name='negativeOption_3'
                />
                {/* <TextareaInput
                  placeholder='Type your markdown here...'
                  label='Body'
                  name='description'
                /> */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <VariantButton
                  type='reset'
                  variant={variant.DANGER}
                  text='Cancel'
                  onClick={() => {
                    resetForm();
                    handleCancel();
                  }}
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

const QuestionsWrapper = tw.div``;
const QuestionContainer = tw.div`flex flex-col bg-eerie-300 p-4 my-16 rounded box-shadow`;
const QuestionText = tw.div`text-xl mb-2 pb-2 border-b`;
const QuestionOption = styled.div.attrs({ className: "flex items-center" })`
  [type="radio"]:checked + label {
    /* border-color: #ffaa32; */
    background-color: #af6600;

    &.negative {
      border-color: red;
    }
  }

  label {
    &.positive {
      border-color: #00ce00;
    }
  }

  /* [disabled] {
    pointer
  } */
`;
const QuestionOptionLabel = tw.label`flex items-center bg-eerie-400 border-2 border-eerie-500 rounded p-2 m-2 w-full`;
const AnswersResult = tw.div`flex`;
const HeaderWrapper = tw.div`flex items-center`;

export default QuestionsSet;
