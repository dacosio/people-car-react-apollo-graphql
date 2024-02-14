import "./App.css";
import Title from "./components/layout/Title";
import AddPerson from "./components/forms/AddPerson";
import AddCar from "./components/forms/AddCar";
import CarPerson from "./components/lists/CarPerson";

const App = () => {
  return (
    <div className="App">
      <Title />
      <AddPerson />
      <AddCar />
      <CarPerson />
    </div>
  );
};

export default App;
