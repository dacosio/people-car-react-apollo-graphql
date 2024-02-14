import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LearnMore from "./components/listItems/LearnMore";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/people/:id" element={<LearnMore />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);
