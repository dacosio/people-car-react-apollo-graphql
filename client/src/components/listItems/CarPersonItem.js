import { Typography, Container, Grid, Button, Stack } from "@mui/material";
import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const CarPersonItem = ({ firstName, lastName, cars }) => {
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
              onClick={() => null}>
              Delete
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {cars.slice(0, 3).map(({ year, make, model, price }, idx) => (
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
                onClick={() => null}>
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
