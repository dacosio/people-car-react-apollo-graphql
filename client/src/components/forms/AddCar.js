import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ADD_CAR, GET_CARS, GET_PEOPLE } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

const AddCar = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [option, setOption] = useState("");
  const [addCar] = useMutation(ADD_CAR);
  const { data } = useQuery(GET_PEOPLE);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCar({
      variables: {
        year: Number(year),
        make,
        model,
        price: parseFloat(price),
        personId: option,
      },
      update: (cache, { data: { addCar } }) => {
        const data = cache.readQuery({ query: GET_CARS });

        cache.writeQuery({
          query: GET_CARS,
          data: {
            ...data,
            cars: [...data.cars, addCar],
          },
        });
      },
    });
  };

  const isFormValid =
    year.trim() !== "" &&
    make.trim() !== "" &&
    model.trim() !== "" &&
    price.trim() !== "" &&
    option !== "";

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        variant="h5"
        align="center"
        marginBottom={2}
        fontWeight="bold">
        Add a Car
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 5 }}>
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
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={!isFormValid}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddCar;
