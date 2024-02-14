import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Button,
  Stack,
  FormControl,
  TextField,
} from "@mui/material";

import formatCurrency from "../../utils/formatCurrency";
import { useMutation } from "@apollo/client";
import {
  GET_PEOPLE,
  REMOVE_CAR,
  REMOVE_PERSON,
  UPDATE_PERSON,
} from "../../graphql/queries";

const CarPersonItem = ({ id, firstName, lastName, cars }) => {
  const [removeCar] = useMutation(REMOVE_CAR);
  const [removePerson] = useMutation(REMOVE_PERSON);
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [edit, setEdit] = useState(false);
  const [firstVal, setFirstVal] = useState(firstName);
  const [lastVal, setLastVal] = useState(lastName);

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

  const handleDeletePerson = () => {
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

  const handleUpdatePerson = () => {
    updatePerson({
      variables: {
        id,
        firstName: firstVal,
        lastName: lastVal,
      },
      update(cache, { data: { updatePerson } }) {
        console.log("🚀 ~ update ~ updatePerson:", updatePerson);
        const data = cache.readQuery({ query: GET_PEOPLE });

        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            ...data,
          },
        });
        setEdit(false);
      },
    });
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
          {!edit ? (
            <Typography variant="h6">
              {firstName} {lastName}
            </Typography>
          ) : (
            <form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="First Name"
                      value={firstVal}
                      onChange={(e) => setFirstVal(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="Last Name"
                      value={lastVal}
                      onChange={(e) => setLastVal(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          )}
        </Grid>
        <Grid>
          <Stack spacing={1} direction="row">
            {!edit ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => setEdit(!edit)}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDeletePerson}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={handleUpdatePerson}>
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setEdit(false)}>
                  Cancel
                </Button>
              </>
            )}
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
