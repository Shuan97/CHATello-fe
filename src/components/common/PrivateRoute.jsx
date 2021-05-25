import React from "react";
import { Redirect, Route } from "react-router-dom";
import { historyLink } from "utils/history";
import { isTokenExpired } from "utils/token";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isTokenExpired() ? (
          <Component {...props} />
        ) : (
          <Redirect to={historyLink("/login")} />
        )
      }
    />
  );
};

export default PrivateRoute;
