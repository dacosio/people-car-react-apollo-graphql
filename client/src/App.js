import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Title from "./components/layout/Title";
import AddPerson from "./components/forms/AddPerson";
import AddCar from "./components/forms/AddCar";
import CarPerson from "./components/lists/CarPerson";
import { useQuery } from "@apollo/client";
import { GET_PEOPLE } from "./graphql/queries";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Title />
        <AddPerson />
        <AddCar />
        <CarPerson />
      </div>
    </ApolloProvider>
  );
};

export default App;
