import TextInput from "components/common/Form/Input";
import { authUser } from "features/userSlice";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import * as Yup from "yup";
// import background from "../../assets/pexels-bg.jpg";

const Login = (props) => {
  const dispatch = useDispatch();
  const [validationSchema] = useState(
    Yup.object().shape({
      email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required"),
      password: Yup.string("Must be a valid password").required(
        "Password is required"
      ),
    })
  );

  const handleLoginSubmit = ({ email, password }) => {
    dispatch(
      authUser({
        email: email,
        password: password,
      })
    );
  };

  return (
    <StyledLogin>
      <LoginForm>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleLoginSubmit(values);
          }}
        >
          {() => (
            <Form className='p-16 h-full'>
              <TextInput placeholder='email' label='Email' name='email' />
              <TextInput
                placeholder='password'
                label='Password'
                name='password'
                type='password'
              />
              <SubmitButton className='py-2 text-white' type='submit'>
                Login
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </LoginForm>
    </StyledLogin>
  );
};

export default Login;

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
/* background-image: url(${background});
  background-size: cover;
  background-position: 100%; */

const LoginForm = styled.div`
  height: 564px;
  width: 768px;
  padding: 2rem;
  background: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
`;

const CenteringWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 100%;
  margin-left: 4rem;
  border: 2px solid gold;
  background-size: cover;
  background-position: 100%;
  color: white;
  font-size: 24px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.backgroundSecondary};
  margin-top: 1rem;
  width: 100%;
`;
