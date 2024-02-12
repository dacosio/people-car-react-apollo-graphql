import { Container, Typography } from "@mui/material";
import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const CarItem = ({ year, make, model, price }) => {
  return (
    <Container sx={{ marginRight: 1 }}>
      <Typography variant="body1">
        {year} {make} {model} {formatCurrency(price)}
      </Typography>
    </Container>
  );
};

export default CarItem;
