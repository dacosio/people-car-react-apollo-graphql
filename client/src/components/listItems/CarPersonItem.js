import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Button,
  Stack,
  FormControl,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import formatCurrency from "../../utils/formatCurrency";
import { useMutation, useQuery } from "@apollo/client";
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
  const { data } = useQuery(GET_PEOPLE);

  const [edit, setEdit] = useState(false);
  const [firstVal, setFirstVal] = useState(firstName);
  const [lastVal, setLastVal] = useState(lastName);

  const [year, setYear] = useState(0);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [option, setOption] = useState("");
  const [editCar, setEditCar] = useState(false);
  const [selectedCarIndex, setSelectedCarIndex] = useState(-1);
  const [carVal, setCarVal] = useState();

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
  const isFormValid = firstVal.trim() !== "" && lastVal.trim() !== "";
  const handleSubmit = (e) => {
    e.preventDefault();
    setEditCarId(null);
  };

  const [editCarId, setEditCarId] = useState(null);

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
                  disabled={!isFormValid}
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
        cars
          .slice(0, 5)
          .map(({ id, year, make, model, price, personId }, idx) => (
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              marginBottom={1}
              key={idx}>
              {!editCarId || editCarId !== id ? (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center">
                  <Grid item>
                    <Typography marginLeft={2} variant="body1" key={id + year}>
                      {year} {make} {model} {formatCurrency(price)}
                    </Typography>
                  </Grid>
                  <Grid item paddingRight={2}>
                    <Stack spacing={1} direction="row">
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setEditCarId(id);
                        }}>
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
              ) : (
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="nowrap">
                  {/* <form onSubmit={handleSubmit}> */}
                  <Grid
                    container
                    flex={"row"}
                    spacing={2}
                    sx={{ marginBottom: 0 }}>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          label="Year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          label="Make"
                          value={make}
                          onChange={(e) => setMake(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          label="Model"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          label="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <Select
                          value={personId}
                          onChange={(e) => setOption(e.target.value)}
                          displayEmpty
                          fullWidth
                          size="small">
                          <MenuItem value="" disabled>
                            Select an option
                          </MenuItem>
                          {data &&
                            data.people.map((person, idx) => (
                              <MenuItem key={idx} value={person.id}>
                                {person.firstName} {person.lastName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {/* </form> */}
                  <Grid item paddingRight={2}>
                    <Stack spacing={1} direction="row">
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => {
                          // setEditCarId(id);
                          console.log("submitted");
                        }}>
                        Submit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setEditCarId(null)}>
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </Grid>
          ))}
    </Container>
  );
};

export default CarPersonItem;
