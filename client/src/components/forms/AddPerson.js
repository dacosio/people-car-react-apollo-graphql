import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ADD_PERSON, GET_PEOPLE } from "../../graphql/queries";
import { useMutation } from "@apollo/client";
import { Typography } from "@mui/material";

const AddPerson = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addPerson] = useMutation(ADD_PERSON);

  const handleSubmit = (e) => {
    e.preventDefault();

    addPerson({
      variables: {
        firstName,
        lastName,
      },
      update: (cache, { data: { createPerson } }) => {
        const data = cache.readQuery({ query: GET_PEOPLE });
        const personWithCars = {
          ...createPerson,
          cars: createPerson.cars || [],
        };
        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            ...data,
            people: [...data.people, personWithCars],
          },
        });
      },
    });
    setFirstName("");
    setLastName("");
  };

  const isFormValid = firstName.trim() !== "" && lastName.trim() !== "";

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        variant="h5"
        align="center"
        marginBottom={2}
        fontWeight="bold">
        Add a Person
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              size="small"
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
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

export default AddPerson;
