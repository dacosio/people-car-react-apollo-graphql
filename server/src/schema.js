let people = [
  {
    id: "1",
    firstName: "Bill",
    lastName: "Gates",
  },
  {
    id: "2",
    firstName: "Steve",
    lastName: "Jobs",
  },
  {
    id: "3",
    firstName: "Linux",
    lastName: "Torvalds",
  },
];

let cars = [
  {
    id: "1",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    price: "40000",
    personId: "1",
  },
  {
    id: "2",
    year: 2018,
    make: "Lexus",
    model: "LX 600",
    price: "13000",
    personId: "1",
  },
  {
    id: "3",
    year: 2017,
    make: "Honda",
    model: "Civic",
    price: "20000",
    personId: "1",
  },
  {
    id: "4",
    year: 2019,
    make: "Acura ",
    model: "MDX",
    price: "60000",
    personId: "2",
  },
  {
    id: "5",
    year: 2018,
    make: "Ford",
    model: "Focus",
    price: "35000",
    personId: "2",
  },
  {
    id: "6",
    year: 2017,
    make: "Honda",
    model: "Pilot",
    price: "45000",
    personId: "2",
  },
  {
    id: "7",
    year: 2019,
    make: "Volkswagen",
    model: "Golf",
    price: "40000",
    personId: "3",
  },
  {
    id: "8",
    year: 2018,
    make: "Kia",
    model: "Sorento",
    price: "45000",
    personId: "3",
  },
  {
    id: "9",
    year: 2017,
    make: "Volvo",
    model: "XC40",
    price: "55000",
    personId: "3",
  },
];
const typeDefs = `
  type Person {
    id: String!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: String!
  }

  type Query {
    people: [Person],
    cars: [Car],
    person(id: String): Person,
    car(id: String): Car
  }
  
  type Mutation {
    createPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String, lastName: String): Person
    deletePerson(id: String!): Person

    createCar(year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    deleteCar(id: String!): Car
  }
`;

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find((person) => person.id === id),
    car: (_, { id }) => cars.find((car) => car.id === id),
  },
  Mutation: {
    createPerson: (_, { firstName, lastName }) => {
      const newPerson = {
        id: String(people.length + 1),
        firstName,
        lastName,
        cars: [],
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) return null;
      if (firstName) people[personIndex].firstName = firstName;
      if (lastName) people[personIndex].lastName = lastName;
      return people[personIndex];
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) return null;
      const deletedPerson = people.splice(personIndex, 1)[0];
      // Remove cars associated with the deleted person
      cars = cars.filter((car) => car.personId !== id);
      return deletedPerson;
    },
    createCar: (_, { year, make, model, price, personId }) => {
      const newCar = {
        id: String(cars.length + 1),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);

      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) return null;

      if (year) cars[carIndex].year = year;
      if (make) cars[carIndex].make = make;
      if (model) cars[carIndex].model = model;
      if (price) cars[carIndex].price = price;

      if (personId !== undefined) {
        cars[carIndex].personId = personId;
      }

      return cars[carIndex];
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) return null;
      const deletedCar = cars.splice(carIndex, 1)[0];
      // Remove the car from the associated person's cars array
      const personIndex = people.findIndex(
        (person) => person.id === deletedCar.personId
      );
      if (personIndex !== -1) {
        if (people[personIndex].cars) {
          // Check if cars array is defined
          people[personIndex].cars = people[personIndex].cars.filter(
            (car) => car.id !== id
          );
        }
      }

      return deletedCar;
    },
  },
  Person: {
    cars: (person) => cars.filter((car) => car.personId === person.id),
  },
};

export { typeDefs, resolvers };
