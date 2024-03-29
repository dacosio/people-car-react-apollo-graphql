import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PEOPLE,
  REMOVE_CAR,
  REMOVE_PERSON,
  UPDATE_PERSON,
  UPDATE_CAR,
  GET_CARS,
  GET_CAR,
  GET_PERSON,
} from "../../graphql/queries";

const CarPersonItem = ({ id, firstName, lastName, cars, itemPersonId }) => {
  const navigate = useNavigate();
  const [removeCar] = useMutation(REMOVE_CAR);
  const [removePerson] = useMutation(REMOVE_PERSON);
  const [updatePerson] = useMutation(UPDATE_PERSON);
  const [updateCar] = useMutation(UPDATE_CAR);
  const { data } = useQuery(GET_PEOPLE);

  const [edit, setEdit] = useState(false);
  const [firstVal, setFirstVal] = useState(firstName);
  const [lastVal, setLastVal] = useState(lastName);

  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [option, setOption] = useState(itemPersonId);
  const [editCarId, setEditCarId] = useState(null);

  const handleDeleteCar = (id) => {
    let result = window.confirm("Are you sure you want to delete this car?");

    if (result) {
      removeCar({
        variables: {
          id,
        },
        update(cache, { data: { deleteCar } }) {
          if (result && itemPersonId) {
            const { person } = cache.readQuery({
              query: GET_PERSON,
              variables: {
                id: itemPersonId,
              },
            });

            const updatedPersonCars = person.cars.filter(
              (car) => car.id !== deleteCar.id
            );
            cache.writeQuery({
              query: GET_PERSON,
              variables: {
                id: itemPersonId,
              },
              data: {
                person: {
                  ...person,
                  cars: updatedPersonCars,
                },
              },
            });

            cache.modify({
              fields: {
                cars(existingCarsRefs, { readField }) {
                  return existingCarsRefs.filter(
                    (carRef) => id !== readField("id", carRef)
                  );
                },
              },
            });
          } else if (result) {
            cache.modify({
              fields: {
                cars(existingCarsRefs, { readField }) {
                  return existingCarsRefs.filter(
                    (carRef) => id !== readField("id", carRef)
                  );
                },
              },
            });
          }
        },
      });
    }
  };

  const handleDeletePerson = () => {
    let result = window.confirm("Are you sure you want to delete this Person?");

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
          navigate("/");
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

  const handleUpdateCar = (cId, option, year, make, model, price) => {
    updateCar({
      variables: {
        id: cId,
        year: Number(year),
        make,
        model,
        price: parseFloat(price),
        personId: option,
      },

      update: (cache, { data: { updateCar } }) => {
        if (!!itemPersonId) {
          const cachedPersonCars = cache.readQuery({
            query: GET_PERSON,
            variables: {
              id: itemPersonId,
            },
          });

          const { person } = cachedPersonCars;
          const updatedPersonCars = person.cars.filter((car) => car.id !== cId);
          const updatedPersonData = {
            ...person,
            cars: updatedPersonCars,
          };
          cache.writeQuery({
            query: GET_PERSON,
            variables: {
              id: itemPersonId,
            },
            data: {
              person: updatedPersonData,
            },
          });
        } else {
          const cachedCarData = cache.readQuery({ query: GET_CARS });
          const updatedCars = cachedCarData.cars.map((car) =>
            car.id === cId ? updateCar : car
          );

          cache.writeQuery({
            query: GET_CARS,
            data: {
              ...cachedCarData,
              cars: updatedCars,
            },
          });
        }
      },
    }).then((res) => console.log(res));
    setEditCarId(null);
  };

  const isCarFormValid =
    year.toString().trim() !== "" &&
    make.trim() !== "" &&
    model.trim() !== "" &&
    price.toString().trim() !== "" &&
    option !== "";
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
          .map(
            (
              {
                id: cId,
                year: cYear,
                make: cMake,
                model: cModel,
                price: cPrice,
                personId: cPersonId,
              },
              idx
            ) => (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginBottom={1}
                key={cId}>
                {!editCarId || editCarId !== cId ? (
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center">
                    <Grid item>
                      <Typography
                        marginLeft={2}
                        variant="body1"
                        key={cId + year}>
                        {cYear} {cMake} {cModel} {formatCurrency(cPrice)}
                      </Typography>
                    </Grid>
                    <Grid item paddingRight={2}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => {
                            setEditCarId(cId);
                            setEditCarId(cId);
                            setYear(cYear);
                            setMake(cMake);
                            setModel(cModel);
                            setPrice(cPrice);
                            itemPersonId
                              ? setOption(itemPersonId)
                              : setOption(cPersonId);
                          }}>
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteCar(cId)}>
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
                            value={option}
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
                    <Grid item paddingRight={2}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          disabled={!isCarFormValid}
                          onClick={() => {
                            handleUpdateCar(
                              cId,
                              option,
                              year,
                              make,
                              model,
                              price
                            );
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
            )
          )}
      {!itemPersonId && (
        <Link to={`/people/${id}`}>
          <div style={{ textAlign: "center" }}>
            <Button variant="text" size="small" color="info">
              Learn More
            </Button>
          </div>
        </Link>
      )}
    </Container>
  );
};

export default CarPersonItem;
