import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "./Utils/theme";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "@apollo/client/link/context";
import { ApolloConsumer, ApolloProvider } from "react-apollo";

const root = ReactDOM.createRoot(document.getElementById("root"));

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_URL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  const loggedInUsedId = localStorage.getItem("loginId");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      loggedinuserid: loggedInUsedId ? loggedInUsedId : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  // for SSR, use:
  // cache: new Cache().restore(window.__APOLLO_STATE__ || {})
});

root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </ThemeProvider>
);
