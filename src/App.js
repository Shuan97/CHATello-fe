import Loader from "components/common/Loader";
import PrivateRoute from "components/common/PrivateRoute";
import { isEmpty } from "lodash";
import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { ThemeProvider } from "styled-components/macro";
import API from "utils/API";
import history from "utils/history";
import { dark, light } from "./assets/theme";
import {
  fetchUserProfile,
  selectToken,
  selectUser,
  setToken,
} from "./features/userSlice";
import { THEME } from "./utils/Constants";
import { UseDarkMode } from "./utils/UseDarkMode";

const Login = lazy(() => import("./components/Auth/Login"));
const Layout = lazy(() => import("./components/Layout"));

history.listen((location, action) => {
  console.log(
    `[History]: ${location.state?.from?.pathname} => ${location.pathname}`
  );
});

const App = () => {
  const [theme, toggleTheme] = UseDarkMode();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  /**
   * Pass [Authorization] header into axios instance
   * from localStorageToken or store token
   */
  useEffect(() => {
    if (!!token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    !token && dispatch(setToken());
  }, [dispatch, token]);

  /**
   * If localStorageToken or store token exists fetch user profile
   */
  useEffect(() => {
    if (!!token && isEmpty(user)) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);
  return (
    <ThemeProvider theme={theme === THEME.light ? light : dark}>
      <StyledApp
        onContextMenu={(e) => {
          e.preventDefault();
          console.log("Right mouse button pressed!");
        }}
      >
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path='/login' component={Login} />
            <PrivateRoute path='/' component={Layout} />
            <Route path='*'>No match</Route>
          </Switch>
        </Suspense>
      </StyledApp>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default App;

const StyledApp = styled.div`
  background: ${({ theme }) => theme.backgroundTertiary};
  display: flex;
  height: 100vh;
  overflow: hidden;

  // icons/controllers
  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.textPrimary};
    transition: font-size 100ms linear, color 100ms linear;
    cursor: pointer;

    ::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-left: 0 solid ${({ theme }) => theme.backgroundAccent};
      transition: border 100ms linear;
    }
  }

  .MuiSvgIcon-root:hover {
    color: ${({ theme }) => theme.backgroundAccent};
  }
`;
