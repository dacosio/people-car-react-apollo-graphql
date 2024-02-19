import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container, Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_PERSON } from "../../graphql/queries";
import CarPersonItem from "./CarPersonItem";

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
      <Grid
        alignItems="flex-start"
        display="flex"
        marginTop={5}
        onClick={() => navigate(-1)}
        sx={{ cursor: "pointer" }}>
        <ArrowBackIcon fontSize="medium" />

        <Typography
          variant="body1"
          marginBottom={2}
          fontWeight="bold"
          paddingLeft={1}>
          Back
        </Typography>
      </Grid>
      {data && <CarPersonItem {...data.person} itemPersonId={id} />}
    </Container>
  );
};

export default LearnMore;
