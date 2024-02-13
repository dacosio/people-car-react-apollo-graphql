import React from "react";
import { Container, Typography } from "@mui/material";
import CarPersonItem from "../listItems/CarPersonItem";
import { useQuery } from "@apollo/client";
import { GET_CARS, GET_PEOPLE } from "../../graphql/queries";

const CarPerson = () => {
  const { data } = useQuery(GET_PEOPLE);
  const { data: cars } = useQuery(GET_CARS);

  return (
    <Container>
      <Typography variant="h5" align="center" fontWeight="bold">
        Records
      </Typography>
      {cars &&
        data &&
        data.people.map((person) => (
          <CarPersonItem
            key={person.id}
            id={person.id}
            firstName={person.firstName}
            lastName={person.lastName}
            cars={cars.cars.filter((car) => car.personId === person.id)}
          />
        ))}
    </Container>
  );
};

export default CarPerson;
