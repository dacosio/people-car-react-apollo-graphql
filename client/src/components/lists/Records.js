import { useQuery, useMutation } from "@apollo/client";
import { GET_PEOPLE } from "../../graphql/queries";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";

const Records = () => {
  const styles = getStyles();

  const { loading, error, data } = useQuery(GET_PEOPLE);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        People
      </Typography>
      <List>
        {data.people.map((person) => (
          <ListItem key={person.id}>
            <ListItemText primary={`${person.firstName} ${person.lastName}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => null}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
            <List>
              {person.cars.map((car) => (
                <ListItem key={car.id}>
                  <ListItemText
                    primary={`${car.year} ${car.make} ${car.model} - $${car.price}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => null}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const getStyles = () => ({
  list: {
    display: "flex",
    justifyContent: "center",
  },
});

export default Records;
