import React from "react";
import { Container, Typography } from "@mui/material";
import CarPersonItem from "../listItems/CarPersonItem";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PEOPLE } from "../../graphql/queries";

const CarPerson = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);
  return (
    <Container>
      <Typography variant="h5" align="center" fontWeight="bold">
        Records
      </Typography>
      {data &&
        data.people.map((person) => (
          <CarPersonItem
            key={person.id}
            firstName={person.firstName}
            lastName={person.lastName}
            cars={person.cars}
          />
        ))}
    </Container>
  );
};

export default CarPerson;
