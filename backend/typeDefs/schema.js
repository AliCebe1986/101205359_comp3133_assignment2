const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    salary: Float!
    profileImage: String
  }

  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload

    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      salary: Float!
      profileImage: String
    ): Employee

    updateEmployee(
      id: ID!
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      salary: Float!
      profileImage: String
    ): Employee

    deleteEmployee(id: ID!): Boolean
  }
`;
