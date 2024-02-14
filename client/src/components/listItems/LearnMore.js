import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_PERSON } from "../../graphql/queries";

const LearnMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PERSON, {
    variables: {
      id: id, // Use the id from useParams
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  // const { id: personId, firstName, lastName, cars } = data;
  return (
    <Container>
      <ArrowBackIcon onClick={() => navigate(-1)} fontSize="large" />
    </Container>
  );
};

export default LearnMore;
