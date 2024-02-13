import { Typography, Container, Grid, Button, Stack } from "@mui/material";
import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import { useMutation } from "@apollo/client";
import { GET_CARS, REMOVE_CAR, REMOVE_PERSON } from "../../graphql/queries";

const CarPersonItem = ({ id, firstName, lastName, cars }) => {
  const [removeCar] = useMutation(REMOVE_CAR);
  const [removePerson] = useMutation(REMOVE_PERSON);

  const handleDeleteCar = (id) => {
    let result = window.confirm("Are you sure you want to delete this car?");

    if (result) {
      removeCar({
        variables: {
          id,
        },
        update(cache) {
          cache.modify({
            fields: {
              cars(existingCarsRefs, { readField }) {
                return existingCarsRefs.filter(
                  (carRef) => id !== readField("id", carRef)
                );
              },
            },
          });
        },
      });
    }
  };

  const handleDeletePerson = (id) => {
    console.log("🚀 ~ handleDeletePerson ~ id:", id);
    let result = window.confirm("Are you sure you want to delete this car?");
    if (result) {
      removePerson({
        variables: {
          id,
        },
        update(cache) {
          cache.modify({
            fields: {
              people(existingPeopleRefs, { readField }) {
                return existingPeopleRefs.filter(
                  (peopleRef) => id !== readField("id", peopleRef)
                );
              },
            },
          });
        },
      });
    }
  };
  return (
    <Container sx={{ marginBottom: 2 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
        padding={2}
        sx={{ backgroundColor: "whitesmoke" }}>
        <Grid>
          <Typography variant="h6">
            {firstName} {lastName}
          </Typography>
        </Grid>
        <Grid>
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => null}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeletePerson(id)}>
              Delete
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {cars &&
        cars.slice(0, 5).map(({ id, year, make, model, price }, idx) => (
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            marginBottom={1}
            key={idx}>
            <Grid item>
              <Typography marginLeft={2} variant="body1" key={idx}>
                {year} {make} {model} {formatCurrency(price)}
              </Typography>
            </Grid>
            <Grid item paddingRight={2}>
              <Stack spacing={1} direction="row">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => null}>
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteCar(id)}>
                  Delete
                </Button>
              </Stack>
            </Grid>
          </Grid>
        ))}
    </Container>
  );
};

export default CarPersonItem;
