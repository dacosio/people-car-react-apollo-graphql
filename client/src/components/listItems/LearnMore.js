import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container, Grid, Typography } from "@mui/material";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_PERSON } from "../../graphql/queries";
import CarPersonItem from "./CarPersonItem";

const LearnMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useApolloClient();

  const { loading, error, data } = useQuery(GET_PERSON, {
    variables: {
      id: id,
    },
  });
  //adding this line to ensure i am getting the data from the query, not from cache
  useEffect(() => {
    client.resetStore();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
